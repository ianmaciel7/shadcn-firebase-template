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

function checkName(source, stem, report) {
  if (!kebabCase.test(stem)) {
    report(source, "Component filename must be kebab-case.");
    return;
  }
  if (environmentSuffix.test(stem)) {
    report(
      source,
      "Name by semantic role, never by Client/Server/Component/UI.",
    );
  }
  const expected = pascalCase(stem);
  const names = componentExports(source);
  if (names.length !== 1 || names[0] !== expected) {
    report(source, `Export exactly one named component ${expected}.`);
  }
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
  checkName(source, stem, report);
  checkProps(source, pascalCase(stem), report);
  checkClientImports(source, report);
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
