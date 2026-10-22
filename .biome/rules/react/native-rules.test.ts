import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const biome = join(root, "node_modules/@biomejs/biome/bin/biome");
const directories = [
  "src/app",
  "src/components",
  "src/hooks",
  "src/components/ui/extensions",
].map((path) => mkdtempSync(join(root, path, "react-native-rules-")));
const vendorFile = join(
  root,
  "src/components/ui",
  `react-native-${process.pid}.tsx`,
);

afterAll(() => {
  for (const directory of directories)
    rmSync(directory, { recursive: true, force: true });
  rmSync(vendorFile, { force: true });
});

function lint(directory: string, source: string) {
  const file = directory.endsWith(".tsx")
    ? directory
    : join(directory, "fixture.tsx");
  writeFileSync(file, source);
  try {
    return execFileSync(process.execPath, [biome, "lint", file], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const { stdout = "", stderr = "" } = error as {
      stdout?: string;
      stderr?: string;
    };
    return `${stdout}${stderr}`;
  }
}

const invalid = [
  {
    rule: "useHookAtTopLevel",
    source:
      'import { useState } from "react"; export function Demo({ enabled }) { if (enabled) { const [value] = useState(0); return <span>{value}</span>; } return null; }',
  },
  {
    rule: "useExhaustiveDependencies",
    source:
      'import { useEffect } from "react"; export function Demo({ value }) { useEffect(() => { console.log(value); }, []); return null; }',
  },
  {
    rule: "noNestedComponentDefinitions",
    source:
      "export function Demo() { function Child() { return <span />; } return <Child />; }",
  },
  {
    rule: "noReactPropAssignments",
    source:
      "export function Demo(props) { props.value = 1; return <span>{props.value}</span>; }",
  },
  {
    rule: "noReactForwardRef",
    source:
      'import { forwardRef } from "react"; export const Demo = forwardRef((props, ref) => <input ref={ref} {...props} />);',
  },
];

describe("native React guard configuration", () => {
  it.each(invalid)(
    "enforces $rule throughout owned code",
    ({ rule, source }) => {
      for (const directory of directories) {
        expect(lint(directory, source)).toContain(`/${rule}`);
      }
    },
  );

  it.each([
    [
      "top-level state",
      'import { useState } from "react"; export function Demo() { const [value] = useState(0); return <span>{value}</span>; }',
    ],
    [
      "complete dependencies",
      'import { useEffect } from "react"; export function Demo({ value }) { useEffect(() => { console.log(value); }, [value]); return null; }',
    ],
    [
      "stable component identity",
      "function Child() { return <span />; } export function Demo() { return <Child />; }",
    ],
    [
      "local copies of props",
      "export function Demo(props) { const copy = { ...props, value: 1 }; return <span>{copy.value}</span>; }",
    ],
    [
      "React 19 ref props",
      'import type { ComponentProps } from "react"; export function Demo({ ref, ...props }: ComponentProps<"input">) { return <input ref={ref} {...props} />; }',
    ],
    [
      "conditional React use",
      'import { use } from "react"; export function Demo({ enabled, data }) { if (enabled) { const value = use(data); return <span>{value}</span>; } return null; }',
    ],
  ])("accepts %s", (_name, source) => {
    const output = lint(directories[1], source);
    for (const { rule } of invalid) expect(output).not.toContain(`/${rule}`);
    expect(output).not.toContain("parse");
  });

  it("preserves registry exclusions for the newly configured policies", () => {
    const output = lint(
      vendorFile,
      "export function Demo(props) { props.value = 1; function Child() { return <span />; } return <Child />; }",
    );
    expect(output).not.toContain("/noReactPropAssignments");
    expect(output).not.toContain("/noNestedComponentDefinitions");
  });
});
