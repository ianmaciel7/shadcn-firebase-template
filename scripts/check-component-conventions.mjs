import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const kebabCase = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const environmentSuffix = /-(client|server|component|ui)$/;
const serverImports =
  /^(next\/(headers|cache|server)|next-intl\/server|server-only|firebase-admin)(\/|$)/;

export function isOwnedComponent(filename) {
  const path = filename.replaceAll("\\", "/");
  if (!path.endsWith(".tsx") || /\.(test|spec|stories)\.tsx$/.test(path)) {
    return false;
  }
  if (path.startsWith("src/app/")) return path.includes("/_components/");
  if (!path.startsWith("src/components/")) return false;
  if (/^src\/components\/(firebase|ai-elements)\//.test(path)) return false;
  if (path.startsWith("src/components/ui/")) {
    return path.startsWith("src/components/ui/extensions/");
  }
  return true;
}

function pascalCase(name) {
  return name
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function exported(statement) {
  return statement.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  );
}

function namedExports(statement) {
  if (
    !ts.isExportDeclaration(statement) ||
    !statement.exportClause ||
    !ts.isNamedExports(statement.exportClause)
  )
    return [];
  return statement.exportClause.elements
    .map((specifier) => specifier.name.text)
    .filter((name) => /^[A-Z]/.test(name));
}

function exportedFunctionNames(statement) {
  if (
    !ts.isFunctionDeclaration(statement) ||
    !exported(statement) ||
    !statement.name
  )
    return [];
  const name = statement.name.text;
  return /^[A-Z]/.test(name) ? [name] : [];
}

function exportedVariableNames(statement) {
  if (!ts.isVariableStatement(statement) || !exported(statement)) return [];
  return statement.declarationList.declarations
    .filter((declaration) => ts.isIdentifier(declaration.name))
    .map((declaration) => declaration.name.text)
    .filter((name) => /^[A-Z]/.test(name));
}

function componentExports(source) {
  return source.statements.flatMap((statement) => [
    ...namedExports(statement),
    ...exportedFunctionNames(statement),
    ...exportedVariableNames(statement),
  ]);
}

function checkFileName(source, stem, report) {
  if (!kebabCase.test(stem)) {
    report(source, "Component filename must be kebab-case.");
  }
  if (environmentSuffix.test(stem)) {
    report(
      source,
      "Name by semantic role, never by Client/Server/Component/UI.",
    );
  }
}

function checkPrimaryExport(source, stem, report) {
  const expected = pascalCase(stem);
  const isLocalFunction = source.statements.some(
    (statement) =>
      ts.isFunctionDeclaration(statement) &&
      statement.name?.text === expected &&
      !exported(statement),
  );
  if (!isLocalFunction) {
    report(source, "The component must be declared as a local named function.");
  }
  const names = componentExports(source);
  if (names.length !== 1 || names[0] !== expected) {
    report(source, `Export exactly one named component ${expected}.`);
  }
}

function checkExportStyle(source, report) {
  for (const statement of source.statements) {
    if (ts.isExportAssignment(statement)) {
      report(statement, "Owned components must use named exports.");
    }
    if (ts.isFunctionDeclaration(statement) && exported(statement)) {
      const isDefault = statement.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword,
      );
      report(
        statement,
        isDefault
          ? "Owned components must use named exports."
          : "Declare the component locally, then export { Name }.",
      );
    }
  }
}

function checkProps(source, expected, report) {
  for (const statement of source.statements) {
    if (
      !ts.isTypeAliasDeclaration(statement) &&
      !ts.isInterfaceDeclaration(statement)
    )
      continue;
    const name = statement.name.text;
    if (name.endsWith("Props") && name !== `${expected}Props`) {
      report(statement, `Props type must be named ${expected}Props.`);
    }
  }
}

function isClientBoundary(source) {
  const first = source.statements[0];
  return (
    first &&
    ts.isExpressionStatement(first) &&
    ts.isStringLiteral(first.expression) &&
    first.expression.text === "use client"
  );
}

function checkClientImports(source, report) {
  if (!isClientBoundary(source)) return;
  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      serverImports.test(statement.moduleSpecifier.text)
    ) {
      report(
        statement,
        "Never import server-only modules in a client boundary.",
      );
    }
    if (
      ts.isExpressionStatement(statement) &&
      ts.isStringLiteral(statement.expression) &&
      statement.expression.text === "use server"
    ) {
      report(statement, "Do not mix use client and use server in one module.");
    }
  }
}

function checkFieldControllerNames(source, stem, report) {
  if (!stem.endsWith("-field")) return;

  function visit(node) {
    if (
      ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(source) === "Controller"
    ) {
      const name = node.attributes.properties.find(
        (attribute) =>
          ts.isJsxAttribute(attribute) && attribute.name.text === "name",
      );
      if (name?.initializer && ts.isStringLiteral(name.initializer)) {
        const fieldName = name.initializer.text.replace(
          /[A-Z]/g,
          (letter) => `-${letter.toLowerCase()}`,
        );
        if (
          stem !== `${fieldName}-field` &&
          !stem.endsWith(`-${fieldName}-field`)
        ) {
          report(
            name,
            `Field component filename must match Controller name="${name.initializer.text}" (e.g. *-${fieldName}-field.tsx).`,
          );
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
}

function checkProfilePropDrilling(source, report) {
  function visit(node) {
    if (
      (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) &&
      /^(ProfileForm|ProfileAvatarField|SignOutButton)$/.test(
        node.tagName.getText(source),
      )
    ) {
      for (const attribute of node.attributes.properties) {
        if (ts.isJsxAttribute(attribute) && attribute.name.text === "profile") {
          report(
            attribute,
            "Pass focused field/form/button props instead of the entire profile controller.",
          );
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
}

function jsxEntries(source) {
  const elements = [];

  function visit(node, ancestors = []) {
    if (ts.isJsxElement(node)) {
      const name = node.openingElement.tagName.getText(source);
      elements.push({ name, node: node.openingElement, ancestors });
      for (const child of node.children) visit(child, [...ancestors, name]);
      return;
    }
    if (ts.isJsxSelfClosingElement(node)) {
      elements.push({ name: node.tagName.getText(source), node, ancestors });
      return;
    }
    ts.forEachChild(node, (child) => visit(child, ancestors));
  }

  visit(source);
  return elements;
}

function checkProfileFormSafety(source, stem, report) {
  const guarded = new Set([
    "profile-card",
    "profile-form",
    "profile-form-content",
    "profile-form-footer",
    "profile-button",
    "sign-out-button",
  ]);
  if (!guarded.has(stem)) return;
  if (!source.fileName.replaceAll("\\", "/").includes("/profile/_components/")) {
    return;
  }

  const elements = jsxEntries(source);
  const named = (name) => elements.filter((element) => element.name === name);
  const inside = (element, ancestors) =>
    ancestors.every((name) => element.ancestors.includes(name));

  if (stem === "profile-card") {
    const form = named("ProfileForm");
    if (form.length !== 1) {
      report(source, "ProfileCard must compose exactly one ProfileForm.");
    }
    for (const region of ["ProfileFormContent", "ProfileFormFooter"]) {
      if (
        named(region).length !== 1 ||
        !named(region).every((element) => inside(element, ["ProfileForm", "Card"]))
      ) {
        report(source, `${region} must be inside the Card and ProfileForm.`);
      }
    }
    for (const action of ["ProfileButton", "SignOutButton"]) {
      if (
        named(action).length !== 1 ||
        !named(action).every((element) =>
          inside(element, ["ProfileForm", "Card", "ProfileFormFooter"]),
        )
      ) {
        report(source, `${action} must be inside ProfileFormFooter and ProfileForm.`);
      }
    }
    if (named("form").length > 0) {
      report(source, "Do not nest an HTML form inside ProfileForm.");
    }
    for (const signOut of named("SignOutButton")) {
      const typeProp = signOut.node.attributes.properties.find(
        (attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === "type",
      );
      if (typeProp) {
        report(typeProp, "SignOutButton must not accept a submit type.");
      }
    }
  }

  if (stem === "profile-form") {
    if (
      named("form").length !== 1 ||
      !inside(named("form")[0], ["FormProvider"])
    ) {
      report(source, "ProfileForm must provide exactly one HTML form inside FormProvider.");
    }
    if (named("FieldGroup").length || named("Button").length) {
      report(source, "ProfileForm must delegate fields and actions to its children.");
    }
  }

  if (stem === "profile-form-content") {
    if (
      named("CardContent").length !== 1 ||
      named("FieldGroup").length !== 1 ||
      !inside(named("FieldGroup")[0], ["CardContent"]) ||
      named("form").length
    ) {
      report(source, "ProfileFormContent must wrap FieldGroup in CardContent without a nested form.");
    }
  }

  if (stem === "profile-form-footer" && named("CardFooter").length !== 1) {
    report(source, "ProfileFormFooter must use the shadcn CardFooter primitive.");
  }

  if (stem === "profile-button" || stem === "sign-out-button") {
    const expected = stem === "profile-button" ? "submit" : "button";
    const buttons = named("Button");
    if (buttons.length !== 1) {
      report(source, `${stem} must render exactly one Button.`);
      return;
    }
    const button = buttons[0];
    const attributes = button.node.attributes.properties;
    const typeIndex = attributes.findIndex(
      (attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === "type",
    );
    const typeAttribute = attributes[typeIndex];
    if (
      !typeAttribute ||
      !typeAttribute.initializer ||
      !ts.isStringLiteral(typeAttribute.initializer) ||
      typeAttribute.initializer.text !== expected ||
      attributes.slice(typeIndex + 1).some(ts.isJsxSpreadAttribute)
    ) {
      report(button.node, `${stem} must enforce type="${expected}" after any spread props.`);
    }
    const disabledIndex = attributes.findIndex(
      (attribute) =>
        ts.isJsxAttribute(attribute) && attribute.name.text === "disabled",
    );
    if (
      disabledIndex < 0 ||
      attributes.slice(disabledIndex + 1).some(ts.isJsxSpreadAttribute)
    ) {
      report(button.node, `${stem} must preserve disabled state after spread props.`);
    }
  }
}

export function inspectComponent(content, filename) {
  if (!isOwnedComponent(filename)) return [];
  const source = ts.createSourceFile(
    filename,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const findings = [];
  const report = (node, message) => {
    const position = source.getLineAndCharacterOfPosition(
      node.getStart(source),
    );
    findings.push({
      file: filename,
      line: position.line + 1,
      column: position.character + 1,
      message,
    });
  };
  const stem = basename(filename, ".tsx");
  checkFileName(source, stem, report);
  checkPrimaryExport(source, stem, report);
  checkExportStyle(source, report);
  checkProps(source, pascalCase(stem), report);
  checkClientImports(source, report);
  checkFieldControllerNames(source, stem, report);
  checkProfilePropDrilling(source, report);
  checkProfileFormSafety(source, stem, report);
  return findings;
}

function scan(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return scan(path);
    return entry.isFile() ? [path] : [];
  });
}

export function checkComponents(root) {
  const files = [
    ...scan(join(root, "src/app")),
    ...scan(join(root, "src/components")),
  ];
  return files.flatMap((file) => {
    const path = relative(root, file).split(sep).join("/");
    return inspectComponent(readFileSync(file, "utf8"), path);
  });
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const findings = checkComponents(
    fileURLToPath(new URL("../", import.meta.url)),
  );
  for (const issue of findings) {
    console.error(
      `${issue.file}:${issue.line}:${issue.column} ${issue.message}`,
    );
  }
  if (findings.length) process.exitCode = 1;
  else console.log("Component conventions: all owned files passed.");
}
