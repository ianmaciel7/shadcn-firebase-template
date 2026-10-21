import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { checkComponentComposition } from "./check-component-composition.mjs";

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
    statement.isTypeOnly ||
    !statement.exportClause ||
    !ts.isNamedExports(statement.exportClause)
  )
    return [];
  return statement.exportClause.elements
    .filter((specifier) => !specifier.isTypeOnly)
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

const profileCardParts = [
  "ProfileCard",
  "ProfileCardHeader",
  "ProfileCardAction",
  "ProfileCardTitle",
  "ProfileCardDescription",
  "ProfileCardContent",
  "ProfileCardFooter",
];

const profileFormParts = [
  "ProfileForm",
  "ProfileFormContent",
  "ProfileFormFooter",
];

function expectedComponentNames(source, stem) {
  const path = source.fileName.replaceAll("\\", "/");
  if (path.endsWith("/profile/_components/profile-card.tsx")) {
    return profileCardParts;
  }
  if (path.endsWith("/profile/_components/profile-form.tsx")) {
    return profileFormParts;
  }
  const root = pascalCase(stem);
  const parts = componentExports(source).filter(
    (name) => name.startsWith(root) && /^[A-Z]/.test(name.slice(root.length)),
  );
  return [root, ...parts];
}

function checkPrimaryExport(source, stem, report) {
  const expected = expectedComponentNames(source, stem);
  for (const name of expected) {
    const isLocalFunction = source.statements.some(
      (statement) =>
        ts.isFunctionDeclaration(statement) &&
        statement.name?.text === name &&
        !exported(statement),
    );
    if (!isLocalFunction) {
      report(source, `Declare ${name} as a local named function.`);
    }
  }
  const names = componentExports(source);
  if (
    names.length !== expected.length ||
    !expected.every((name) => names.includes(name))
  ) {
    report(
      source,
      `Export exactly the named components: ${expected.join(", ")}.`,
    );
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

function checkProps(source, _expected, report) {
  const allowed = expectedComponentNames(
    source,
    basename(source.fileName, ".tsx"),
  ).map((name) => `${name}Props`);
  for (const statement of source.statements) {
    if (
      !ts.isTypeAliasDeclaration(statement) &&
      !ts.isInterfaceDeclaration(statement)
    )
      continue;
    const name = statement.name.text;
    if (name.endsWith("Props") && !allowed.includes(name)) {
      report(
        statement,
        `Props type must be named one of: ${allowed.join(", ")}.`,
      );
    }
  }
}

function isClientBoundary(source) {
  for (const statement of source.statements) {
    if (
      !ts.isExpressionStatement(statement) ||
      !ts.isStringLiteral(statement.expression)
    )
      break;
    if (statement.expression.text === "use client") return true;
  }
  return false;
}

function isRuntimeImport(statement) {
  const clause = statement.importClause;
  if (!clause) return true;
  if (clause.isTypeOnly) return false;
  if (
    clause.name ||
    !clause.namedBindings ||
    ts.isNamespaceImport(clause.namedBindings) ||
    clause.namedBindings.elements.length === 0
  )
    return true;
  return clause.namedBindings.elements.some(
    (specifier) => !specifier.isTypeOnly,
  );
}

function checkClientImports(source, report) {
  if (!isClientBoundary(source)) return;
  for (const statement of source.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      isRuntimeImport(statement) &&
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
      /^(ProfileForm|ProfileAvatarField|ProfileSignOutButton)$/.test(
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

function jsxEntries(source, root = source) {
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

  visit(root);
  return elements;
}

function profileElements(elements, name) {
  return elements.filter((element) => element.name === name);
}

function isInsideProfile(element, ancestors) {
  const parents = element.ancestors.slice(-ancestors.length).reverse();
  return (
    parents.length === ancestors.length &&
    ancestors.every((name, index) => parents[index] === name)
  );
}

function requireProfilePlacement(source, elements, name, parents, report) {
  const matching = profileElements(elements, name);
  if (
    matching.length !== 1 ||
    !matching.every((element) => isInsideProfile(element, parents))
  ) {
    report(source, `${name} must be inside ${parents.join(" and ")}.`);
  }
}

function checkProfileCardSafety(source, elements, report) {
  const cards = profileElements(elements, "Card");
  if (cards.length !== 1 || cards[0].ancestors.length > 0) {
    report(source, "ProfileCard must render one native Card as its root.");
  }
  if (
    profileElements(elements, "ProfileForm").length ||
    profileElements(elements, "ProfileFormContent").length ||
    profileElements(elements, "ProfileFormFooter").length
  ) {
    report(
      source,
      "ProfileCard must accept children; compose profile UI in ProfileSection.",
    );
  }
  for (const primitive of [
    "CardHeader",
    "CardAction",
    "CardTitle",
    "CardDescription",
    "CardContent",
    "CardFooter",
  ]) {
    if (profileElements(elements, primitive).length !== 1) {
      report(source, `ProfileCard must wrap exactly one ${primitive}.`);
    }
  }
}

function checkProfileSectionSafety(source, elements, report) {
  if (profileElements(elements, "ProfileCard").length === 0) {
    report(source, "ProfileSection must compose ProfileCard.");
  }
  requireProfilePlacement(
    source,
    elements,
    "ProfileForm",
    ["ProfileCard"],
    report,
  );
  requireProfilePlacement(
    source,
    elements,
    "ProfileCardHeader",
    ["ProfileForm", "ProfileCard"],
    report,
  );
  for (const part of ["ProfileCardTitle", "ProfileCardDescription"]) {
    requireProfilePlacement(
      source,
      elements,
      part,
      ["ProfileCardHeader", "ProfileForm", "ProfileCard"],
      report,
    );
  }
  requireProfilePlacement(
    source,
    elements,
    "ProfileFormContent",
    ["ProfileCardContent", "ProfileForm", "ProfileCard"],
    report,
  );
  requireProfilePlacement(
    source,
    elements,
    "ProfileCardFooter",
    ["ProfileForm", "ProfileCard"],
    report,
  );
  requireProfilePlacement(
    source,
    elements,
    "ProfileFormFooter",
    ["ProfileCardFooter", "ProfileForm", "ProfileCard"],
    report,
  );
  for (const action of ["ProfileSaveButton", "ProfileSignOutButton"]) {
    requireProfilePlacement(
      source,
      elements,
      action,
      ["ProfileFormFooter", "ProfileCardFooter", "ProfileForm", "ProfileCard"],
      report,
    );
    for (const button of profileElements(elements, action)) {
      const typeProp = button.node.attributes.properties.find(
        (attribute) =>
          ts.isJsxAttribute(attribute) && attribute.name.text === "type",
      );
      if (typeProp) {
        report(
          typeProp,
          `${action} must not accept an override of its fixed type.`,
        );
      }
    }
  }
  if (
    profileElements(elements, "form").length ||
    profileElements(elements, "Card").length
  ) {
    report(source, "ProfileSection must delegate native Card and form roots.");
  }
}

function checkProfileProviderSafety(source, elements, report) {
  const nativeForms = profileElements(elements, "form");
  if (
    nativeForms.length !== 1 ||
    !isInsideProfile(nativeForms[0], ["FormProvider"])
  ) {
    report(
      source,
      "ProfileForm must provide exactly one HTML form inside FormProvider.",
    );
  }
  if (profileElements(elements, "Card").length > 0) {
    report(source, "ProfileForm must delegate the Card root to ProfileCard.");
  }
  if (
    profileElements(elements, "FieldGroup").length ||
    profileElements(elements, "Button").length
  ) {
    report(
      source,
      "ProfileForm must delegate fields and actions to its children.",
    );
  }
}

function checkProfileContentSafety(source, elements, report) {
  if (
    profileElements(elements, "FieldGroup").length !== 1 ||
    profileElements(elements, "CardContent").length ||
    profileElements(elements, "form").length
  ) {
    report(
      source,
      "ProfileFormContent must render exactly one FieldGroup without CardContent or a nested form.",
    );
  }
}

function checkProfileFooterSafety(source, elements, report) {
  if (
    profileElements(elements, "div").length !== 1 ||
    profileElements(elements, "CardFooter").length > 0
  ) {
    report(
      source,
      "ProfileFormFooter must render a layout div inside ProfileCardFooter.",
    );
  }
}

function attributePosition(attributes, name) {
  return attributes.findIndex(
    (attribute) => ts.isJsxAttribute(attribute) && attribute.name.text === name,
  );
}

function spreadAfter(attributes, position) {
  return attributes.slice(position + 1).some(ts.isJsxSpreadAttribute);
}

function checkFixedProfileButtonType(
  button,
  attributes,
  stem,
  expected,
  report,
) {
  const typeIndex = attributePosition(attributes, "type");
  const typeAttribute = attributes[typeIndex];
  const typeValue = typeAttribute?.initializer;
  if (
    !typeValue ||
    !ts.isStringLiteral(typeValue) ||
    typeValue.text !== expected ||
    spreadAfter(attributes, typeIndex)
  ) {
    report(
      button.node,
      `${stem} must enforce type="${expected}" after any spread props.`,
    );
  }
}

function checkFixedProfileButtonDisabled(button, attributes, stem, report) {
  const disabledIndex = attributePosition(attributes, "disabled");
  if (disabledIndex < 0 || spreadAfter(attributes, disabledIndex)) {
    report(
      button.node,
      `${stem} must preserve disabled state after spread props.`,
    );
  }
}

function checkProfileButtonSafety(source, elements, report, stem) {
  const expected = stem === "profile-save-button" ? "submit" : "button";
  const buttons = profileElements(elements, "Button");
  if (buttons.length !== 1) {
    report(source, `${stem} must render exactly one Button.`);
    return;
  }
  const button = buttons[0];
  const attributes = button.node.attributes.properties;
  checkFixedProfileButtonType(button, attributes, stem, expected, report);
  checkFixedProfileButtonDisabled(button, attributes, stem, report);
}

function checkProfileFormSafety(source, stem, report) {
  const checks = {
    "profile-card": checkProfileCardSafety,
    "profile-section": checkProfileSectionSafety,
    "profile-form": checkProfileProviderSafety,
    "profile-form-content": checkProfileContentSafety,
    "profile-form-footer": checkProfileFooterSafety,
    "profile-save-button": (file, elements, addIssue) =>
      checkProfileButtonSafety(file, elements, addIssue, stem),
    "profile-sign-out-button": (file, elements, addIssue) =>
      checkProfileButtonSafety(file, elements, addIssue, stem),
  };
  const check = checks[stem];
  if (
    !check ||
    !source.fileName.replaceAll("\\", "/").includes("/profile/_components/")
  ) {
    return;
  }
  if (stem === "profile-form") {
    for (const [name, partCheck] of [
      ["ProfileForm", checkProfileProviderSafety],
      ["ProfileFormContent", checkProfileContentSafety],
      ["ProfileFormFooter", checkProfileFooterSafety],
    ]) {
      const declaration = source.statements.find(
        (statement) =>
          ts.isFunctionDeclaration(statement) && statement.name?.text === name,
      );
      if (declaration)
        partCheck(source, jsxEntries(source, declaration), report);
    }
    return;
  }
  check(source, jsxEntries(source), report);
}

const statefulHooks = new Set([
  "useState",
  "useReducer",
  "useEffect",
  "useLayoutEffect",
  "useSyncExternalStore",
]);

function checkStateHookImport(bindings, report) {
  if (!bindings || !ts.isNamedImports(bindings)) return;
  for (const element of bindings.elements) {
    if (element.isTypeOnly) continue;
    if (statefulHooks.has((element.propertyName ?? element.name).text)) {
      report(
        element,
        "Move state and effects into a responsibility-specific custom hook; keep components declarative.",
      );
    }
  }
}

function hasValueImport(bindings) {
  if (!bindings || !ts.isNamedImports(bindings)) return true;
  return bindings.elements.some((element) => !element.isTypeOnly);
}

function checkHookImport(statement, report) {
  if (
    !ts.isImportDeclaration(statement) ||
    !ts.isStringLiteral(statement.moduleSpecifier)
  )
    return;
  const module = statement.moduleSpecifier.text;
  const clause = statement.importClause;
  if (clause?.isTypeOnly) return;
  const bindings = clause?.namedBindings;
  const valueImport = hasValueImport(bindings);
  if (valueImport && /^(firebase\/|@\/lib\/firebase\/)/.test(module)) {
    report(
      statement,
      "Move Firebase/session operations into a responsibility-specific custom hook or data module.",
    );
  }
  if (module === "react") checkStateHookImport(bindings, report);
}

function isAsyncWorkflow(node, source) {
  if (
    ts.isFunctionDeclaration(node) &&
    source.statements.includes(node) &&
    /^[A-Z]/.test(node.name?.text ?? "")
  )
    return false;
  if (
    !ts.isFunctionDeclaration(node) &&
    !ts.isArrowFunction(node) &&
    !ts.isFunctionExpression(node)
  )
    return false;
  return node.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword,
  );
}

function isStateHookCall(node) {
  return (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    statefulHooks.has(node.expression.name.text)
  );
}

function hookImportNames(source) {
  const names = new Map();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const element of bindings.elements) {
      names.set(element.name.text, (element.propertyName ?? element.name).text);
    }
  }
  return names;
}

function checkComponentHook(component, source, report) {
  const names = hookImportNames(source);
  const hooks = [];
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const expression = node.expression;
      const localName = ts.isIdentifier(expression)
        ? expression.text
        : ts.isPropertyAccessExpression(expression)
          ? expression.name.text
          : "";
      const name = names.get(localName) ?? localName;
      if (/^use[A-Z]/.test(name)) hooks.push({ name, node });
    }
    ts.forEachChild(node, visit);
  }
  visit(component);
  if (!hooks.length) return;
  const presentationHooks = new Set([
    "useTranslations",
    "useFormatter",
    "useId",
  ]);
  if (hooks.length === 1 && presentationHooks.has(hooks[0].name)) return;
  const expected = `use${component.name.text}`;
  if (hooks.length !== 1 || hooks[0].name !== expected) {
    report(
      component,
      `${component.name.text} must delegate hook coordination to ${expected} in a separate hook module; call only that component hook.`,
    );
    return;
  }
  if (
    !names.has(
      ts.isIdentifier(hooks[0].node.expression)
        ? hooks[0].node.expression.text
        : "",
    )
  ) {
    report(
      component,
      `${expected} must be imported from a separate hook module.`,
    );
  }
}

function checkHookResponsibilities(source, report) {
  for (const statement of source.statements) checkHookImport(statement, report);
  function hasLogic(node) {
    if (
      ts.isBinaryExpression(node) &&
      [
        ts.SyntaxKind.AmpersandAmpersandToken,
        ts.SyntaxKind.BarBarToken,
        ts.SyntaxKind.QuestionQuestionToken,
      ].includes(node.operatorToken.kind)
    )
      return true;
    let found = false;
    ts.forEachChild(node, (child) => {
      if (hasLogic(child)) found = true;
    });
    return found;
  }
  function checkDerivedState(node) {
    if (ts.isIfStatement(node) && hasLogic(node.expression)) {
      report(
        node.expression,
        "Derive compound loading/auth/error decisions in a custom hook; render a named state or discriminated status.",
      );
    }
    if (
      ts.isVariableDeclaration(node) &&
      node.initializer &&
      hasLogic(node.initializer)
    ) {
      report(
        node.initializer,
        "Derive compound state in a responsibility-specific custom hook instead of component locals.",
      );
    }
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken &&
      /error/i.test(node.left.getText(source))
    ) {
      report(
        node,
        "Resolve error-message fallbacks in a custom hook, not in component rendering.",
      );
    }
  }
  function visit(node) {
    checkDerivedState(node);
    if (isAsyncWorkflow(node, source)) {
      report(
        node,
        "Move asynchronous workflow handlers into a responsibility-specific custom hook.",
      );
    }
    if (isStateHookCall(node)) {
      report(
        node,
        "Move state and effects into a responsibility-specific custom hook; keep components declarative.",
      );
    }
    ts.forEachChild(node, visit);
  }
  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      /^[A-Z]/.test(statement.name?.text ?? "")
    ) {
      checkComponentHook(statement, source, report);
      visit(statement);
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
  checkComponentComposition(
    source,
    expectedComponentNames(source, stem),
    report,
  );
  checkHookResponsibilities(source, report);
  checkFieldControllerNames(source, stem, report);
  checkProfilePropDrilling(source, report);
  checkProfileFormSafety(source, stem, report);
  return findings;
}

function hasBannedNamingTerm(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .some((word) => /^(view|screen)$/i.test(word));
}

function isOwnedNamingFile(filename) {
  const path = filename.replaceAll("\\", "/");
  return (
    path.startsWith("src/") &&
    /\.tsx?$/.test(path) &&
    !/\.(test|spec|stories)\.tsx?$/.test(path) &&
    !/^src\/components\/(firebase|ai-elements)\//.test(path) &&
    (!path.startsWith("src/components/ui/") ||
      path.startsWith("src/components/ui/extensions/"))
  );
}

const namedDeclarationKinds = new Set([
  ts.SyntaxKind.ImportSpecifier,
  ts.SyntaxKind.ImportClause,
  ts.SyntaxKind.NamespaceImport,
  ts.SyntaxKind.FunctionDeclaration,
  ts.SyntaxKind.ClassDeclaration,
  ts.SyntaxKind.TypeAliasDeclaration,
  ts.SyntaxKind.InterfaceDeclaration,
  ts.SyntaxKind.VariableDeclaration,
  ts.SyntaxKind.BindingElement,
  ts.SyntaxKind.Parameter,
]);

function declaredName(node) {
  return namedDeclarationKinds.has(node.kind) ? node.name : undefined;
}

export function inspectNaming(content, filename) {
  if (!isOwnedNamingFile(filename)) return [];
  const findings = [];
  const source = ts.createSourceFile(
    filename,
    content,
    ts.ScriptTarget.Latest,
    true,
    filename.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  function report(node, name) {
    const position = source.getLineAndCharacterOfPosition(
      node.getStart(source),
    );
    findings.push({
      file: filename,
      line: position.line + 1,
      column: position.character + 1,
      message: `Do not use View or Screen as naming terms (${name}); choose a concrete responsibility such as Status, Section, Content or Flow.`,
    });
  }
  if (hasBannedNamingTerm(basename(filename).replace(/\.tsx?$/, "")))
    report(source, basename(filename));
  function visit(node) {
    const name = declaredName(node);
    if (name && ts.isIdentifier(name) && hasBannedNamingTerm(name.text))
      report(name, name.text);
    ts.forEachChild(node, visit);
  }
  visit(source);
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
  const files = scan(join(root, "src"));
  return files.flatMap((file) => {
    const path = relative(root, file).split(sep).join("/");
    if (!/\.tsx?$/.test(path)) return [];
    const content = readFileSync(file, "utf8");
    return [
      ...inspectNaming(content, path),
      ...inspectComponent(content, path),
    ];
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
