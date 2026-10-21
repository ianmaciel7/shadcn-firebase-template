import ts from "typescript";

function primitiveImports(source) {
  const names = new Set();
  for (const statement of source.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      !/^@\/components\/ui\/(?!extensions\/)/.test(
        statement.moduleSpecifier.text,
      ) ||
      statement.importClause?.isTypeOnly
    )
      continue;
    const bindings = statement.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const binding of bindings.elements) {
        if (!binding.isTypeOnly) names.add(binding.name.text);
      }
    }
  }
  return names;
}

function inheritedPrimitive(type, source, primitives, seen = new Set()) {
  if (!type || seen.has(type)) return undefined;
  seen.add(type);
  if (ts.isParenthesizedTypeNode(type)) {
    return inheritedPrimitive(type.type, source, primitives, seen);
  }
  if (ts.isIntersectionTypeNode(type)) {
    return type.types
      .map((part) => inheritedPrimitive(part, source, primitives, seen))
      .find(Boolean);
  }
  if (!ts.isTypeReferenceNode(type)) return undefined;
  const name = type.typeName.getText(source);
  const argument = type.typeArguments?.[0];
  if (/^(React\.)?ComponentProps(WithRef|WithoutRef)?$/.test(name)) {
    const primitive =
      argument && ts.isTypeQueryNode(argument)
        ? argument.exprName.getText(source)
        : undefined;
    return primitives.has(primitive) ? primitive : undefined;
  }
  if (name === "Omit") {
    return inheritedPrimitive(argument, source, primitives, seen);
  }
  const alias = source.statements.find(
    (statement) =>
      ts.isTypeAliasDeclaration(statement) && statement.name.text === name,
  );
  return alias
    ? inheritedPrimitive(alias.type, source, primitives, seen)
    : undefined;
}

function returnRoot(statement) {
  let expression = statement.expression;
  while (expression && ts.isParenthesizedExpression(expression)) {
    expression = expression.expression;
  }
  if (expression && ts.isJsxElement(expression)) {
    return {
      opening: expression.openingElement,
      children: expression.children,
    };
  }
  if (expression && ts.isJsxSelfClosingElement(expression)) {
    return { opening: expression, children: [] };
  }
  return undefined;
}

function references(node, name) {
  if (!node) return false;
  if (ts.isIdentifier(node) && node.text === name) return true;
  return !!ts.forEachChild(node, (child) => references(child, name));
}

function forwardsSpread(root, name) {
  return root.opening.attributes.properties.some(
    (attribute) =>
      ts.isJsxSpreadAttribute(attribute) &&
      ts.isIdentifier(attribute.expression) &&
      attribute.expression.text === name,
  );
}

function forwardsBinding(root, binding, report) {
  const property = binding.propertyName?.getText() ?? binding.name.getText();
  if (!ts.isIdentifier(binding.name)) return;
  if (property !== "className" && property !== "children") return;
  const attribute = root.opening.attributes.properties.find(
    (candidate) =>
      ts.isJsxAttribute(candidate) && candidate.name.text === property,
  );
  const explicit =
    attribute && references(attribute.initializer, binding.name.text);
  const child =
    property === "children" &&
    root.children.some((node) => references(node, binding.name.text));
  if (!explicit && !child) {
    report(binding, `Primitive adapters must forward extracted ${property}.`);
  }
}

function checkAdapterRoot(root, binding, primitive, report) {
  const rest = ts.isObjectBindingPattern(binding)
    ? binding.elements.find((element) => element.dotDotDotToken)?.name
    : binding;
  if (!rest || !ts.isIdentifier(rest) || !forwardsSpread(root, rest.text)) {
    report(
      root.opening,
      `Primitive adapters must forward remaining props to ${primitive}.`,
    );
  }
  if (ts.isObjectBindingPattern(binding)) {
    for (const element of binding.elements) {
      if (!element.dotDotDotToken) forwardsBinding(root, element, report);
    }
  }
}

function checkAdapter(declaration, source, primitives, report) {
  const parameter = declaration.parameters[0];
  if (!parameter || !declaration.body) return;
  const primitive = inheritedPrimitive(parameter.type, source, primitives);
  if (!primitive) return;
  const roots = declaration.body.statements
    .filter(ts.isReturnStatement)
    .map(returnRoot)
    .filter((root) => root?.opening.tagName.getText(source) === primitive);
  for (const root of roots)
    checkAdapterRoot(root, parameter.name, primitive, report);
}

function staticTarget(node) {
  if (
    ts.isBinaryExpression(node) &&
    node.operatorToken.kind === ts.SyntaxKind.EqualsToken
  ) {
    const target = node.left;
    if (
      ts.isPropertyAccessExpression(target) ||
      ts.isElementAccessExpression(target)
    ) {
      return target.expression;
    }
  }
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === "Object" &&
    ["assign", "defineProperty", "defineProperties"].includes(
      node.expression.name.text,
    )
  )
    return node.arguments[0];
  return undefined;
}

export function checkComponentComposition(source, componentNames, report) {
  const primitives = primitiveImports(source);
  for (const statement of source.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      componentNames.includes(statement.name.text)
    )
      checkAdapter(statement, source, primitives, report);
  }
  function visit(node) {
    const target = staticTarget(node);
    if (
      target &&
      ts.isIdentifier(target) &&
      componentNames.includes(target.text)
    ) {
      report(
        node,
        "Expose compound parts as separate named exports, not static component properties.",
      );
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
