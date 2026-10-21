import { readdirSync, readFileSync } from "node:fs";
import { basename, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Project policy, not a Next.js framework restriction: route entrypoints
// orchestrate and compose; feature logic belongs in colocated modules.
const entrypointPattern = /^(page|layout|template)\.[jt]sx?$/;
const permittedNextFunctions = new Set([
  "generateMetadata",
  "generateViewport",
  "generateStaticParams",
]);
const forbiddenImports = /^(firebase|firebase-admin)(\/|$)|^@\/lib\/firebase\/client$/;

export function isRouteEntrypoint(path) {
  const normalized = path.replaceAll("\\", "/");
  return normalized.startsWith("src/app/") &&
    entrypointPattern.test(basename(normalized));
}

export function inspectRouteSource(contents, filename) {
  if (!isRouteEntrypoint(filename)) return [];

  const source = ts.createSourceFile(
    filename,
    contents,
    ts.ScriptTarget.Latest,
    true,
    /\.[jt]sx$/.test(filename) ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const violations = [];
  const fail = (node, message) => {
    const location = source.getLineAndCharacterOfPosition(node.getStart(source));
    violations.push({
      filename,
      line: location.line + 1,
      column: location.character + 1,
      message,
    });
  };

  function visit(node) {
    if (
      ts.isExpressionStatement(node) &&
      ts.isStringLiteral(node.expression) &&
      node.expression.text === "use client" &&
      node.parent === source
    ) {
      fail(node, "Keep route entrypoints as Server Components; move client behavior to _components/.");
    }
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      if (forbiddenImports.test(node.moduleSpecifier.text)) {
        fail(node, "Import Firebase through a dedicated data/service layer or client component.");
      }
    }
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const name = ts.isIdentifier(callee)
        ? callee.text
        : ts.isPropertyAccessExpression(callee)
          ? callee.name.text
          : "";
      if (/^use[A-Z]/.test(name)) {
        fail(node, "React/client hooks belong in _components/ or _hooks/, not route entrypoints.");
      }
    }
    if (
      ts.isIfStatement(node) ||
      ts.isSwitchStatement(node) ||
      ts.isTryStatement(node) ||
      ts.isForStatement(node) ||
      ts.isForOfStatement(node) ||
      ts.isForInStatement(node) ||
      ts.isWhileStatement(node) ||
      ts.isDoStatement(node) ||
      ts.isConditionalExpression(node) ||
      ts.isThrowStatement(node)
    ) {
      fail(node, "Extract conditional, iterative, and error-handling logic out of route entrypoints.");
    }
    if (
      ts.isBinaryExpression(node) &&
      (node.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
        node.operatorToken.kind === ts.SyntaxKind.BarBarToken ||
        (node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment &&
          node.operatorToken.kind <= ts.SyntaxKind.LastAssignment))
    ) {
      fail(node, "Extract conditionals and mutations to a focused component or service.");
    }
    if (
      ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)
    ) {
      if (
        node.operator === ts.SyntaxKind.PlusPlusToken ||
        node.operator === ts.SyntaxKind.MinusMinusToken
      ) {
        fail(node, "Mutations do not belong in route entrypoints.");
      }
    }
    if (ts.isVariableDeclarationList(node) && (node.flags & ts.NodeFlags.Let)) {
      fail(node, "Mutable local state belongs in a component, hook, or service.");
    }
    if (ts.isJsxAttribute(node) && /^on[A-Z]/.test(node.name.getText(source))) {
      fail(node, "Event handlers belong in Client Components, not route entrypoints.");
    }
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      /^(window|document|localStorage|sessionStorage|navigator)$/.test(
        node.expression.text,
      )
    ) {
      fail(node, "Browser APIs belong in Client Components.");
    }
    if (ts.isFunctionDeclaration(node)) {
      const modifiers = node.modifiers ?? [];
      const exported = modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      const isDefault = modifiers.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      const isNextFunction = exported && permittedNextFunctions.has(node.name?.text);
      if (!isDefault && !isNextFunction) {
        fail(node, "Extract helper functions; allow only the default route component and Next.js generators.");
      }
    }
    if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
      fail(node, "Extract inline functions and callbacks into focused modules.");
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return violations;
}

function listEntrypoints(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listEntrypoints(path);
    return entry.isFile() && entrypointPattern.test(entry.name) ? [path] : [];
  });
}

export function checkRouteEntrypoints(repoRoot) {
  const files = listEntrypoints(join(repoRoot, "src/app"));
  return files.flatMap((file) => {
    const relativePath = relative(repoRoot, file).split(sep).join("/");
    return inspectRouteSource(readFileSync(file, "utf8"), relativePath);
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const repoRoot = fileURLToPath(new URL("../", import.meta.url));
  const violations = checkRouteEntrypoints(repoRoot);
  if (violations.length > 0) {
    for (const violation of violations) {
      console.error(
        violation.filename + ":" + violation.line + ":" +
          violation.column + " " + violation.message,
      );
    }
    process.exitCode = 1;
  } else {
    console.log("Route entrypoints: no embedded client or business logic.");
  }
}
