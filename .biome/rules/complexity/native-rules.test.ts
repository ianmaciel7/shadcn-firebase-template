import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const biome = join(root, "node_modules/@biomejs/biome/bin/biome");
const locations = [
  "src/app/_hooks",
  "src/app/(protected)/_hooks",
  "src/app/(protected)/profile/_hooks",
  "src/app/(public)/_hooks",
  "src/app/(public)/forgot-password/_hooks",
  "src/app/(public)/register/_hooks",
  "src/app/(public)/sign-in/_hooks",
  "src/lib",
  "src/hooks",
  "src/i18n",
  "src/components/ui/extensions",
];
// Interrupted runs skip afterAll, so sweep fixtures they left behind.
for (const directory of locations)
  for (const entry of readdirSync(join(root, directory)))
    if (entry.startsWith("complexity-native-"))
      rmSync(join(root, directory, entry), { recursive: true, force: true });

const directories = locations.map((directory) =>
  mkdtempSync(join(root, directory, "complexity-native-")),
);
const vendorFiles = ["src/components/ui", "src/components/ai-elements"].map(
  (directory) => join(root, directory, `complexity-native-${process.pid}.tsx`),
);

afterAll(() => {
  for (const directory of directories)
    rmSync(directory, { recursive: true, force: true });
  for (const file of vendorFiles) rmSync(file, { force: true });
});

type Result = {
  diagnostics: Array<{ category: string; severity: string; message: string }>;
};

function lint(source: string, file = join(directories[0], "fixture.ts")) {
  writeFileSync(file, source);
  const args = [biome, "lint", file, "--reporter=json"];
  try {
    return JSON.parse(
      execFileSync(process.execPath, args, {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }),
    ) as Result;
  } catch (error) {
    const { stdout } = error as { stdout?: string };
    if (!stdout) throw error;
    return JSON.parse(stdout) as Result;
  }
}

function branches(count: number) {
  const checks = Array.from(
    { length: count },
    (_, index) => `if (value > ${index}) result += 1;`,
  ).join("\n");
  return `export function choose(value: number) { let result = 0;\n${checks}\nreturn result; }`;
}

function lines(count: number) {
  return `export function longFunction() {\n${Array.from({ length: count }, () => 'console.log("step");').join("\n")}\n}`;
}

function nested(depth: number) {
  let call = "1";
  for (let index = 0; index < depth; index++)
    call = `Promise.resolve(1).then(() => ${call})`;
  return `export function nestedCallbacks() { return ${call}; }`;
}

const categories = {
  cognitive: "lint/complexity/noExcessiveCognitiveComplexity",
  lines: "lint/complexity/noExcessiveLinesPerFunction",
  callbacks: "lint/nursery/noExcessiveNestedCallbacks",
};

describe("owned function complexity budgets", () => {
  it.each([
    ["cognitive", branches(8), branches(9)],
    ["lines", lines(40), lines(41)],
    ["callbacks", nested(2), nested(3)],
  ] as const)(
    "accepts the exact %s limit and blocks the next value",
    (kind, valid, invalid) => {
      expect(
        lint(valid).diagnostics.filter(
          ({ category }) => category === categories[kind],
        ),
      ).toEqual([]);
      expect(lint(invalid).diagnostics).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: categories[kind],
            severity: "error",
          }),
        ]),
      );
    },
  );

  it.each(locations)(
    "captures long functions in owned %s modules",
    (location) => {
      const directory = directories[locations.indexOf(location)];
      expect(
        lint(lines(41), join(directory, "fixture.ts")).diagnostics.some(
          ({ category }) => category === categories.lines,
        ),
      ).toBe(true);
    },
  );

  it("does not let an IIFE bypass the function size budget", () => {
    const source = `export const value = (() => {\n${Array.from({ length: 41 }, () => 'console.log("step");').join("\n")}\n})();`;
    expect(
      lint(source).diagnostics.some(
        ({ category }) => category === categories.lines,
      ),
    ).toBe(true);
  });

  it("also covers TSX hook functions", () => {
    expect(
      lint(branches(9), join(directories[0], "fixture.tsx")).diagnostics.some(
        ({ category }) => category === categories.cognitive,
      ),
    ).toBe(true);
  });

  it("keeps blank lines from consuming the function budget", () => {
    expect(
      lint(lines(40).replaceAll("\n", "\n\n")).diagnostics.filter(
        ({ category }) => category === categories.lines,
      ),
    ).toEqual([]);
  });

  it.each(["test", "spec", "stories"])(
    "preserves %s fixture exclusions",
    (kind) => {
      const result = lint(
        `${branches(9)}\n${lines(41)}\n${nested(3)}`,
        join(directories[0], `fixture.${kind}.tsx`),
      );
      expect(
        result.diagnostics.filter(({ category }) =>
          Object.values(categories).includes(category),
        ),
      ).toEqual([]);
    },
  );

  it.each(vendorFiles)("preserves copied registry exclusions: %s", (file) => {
    expect(
      lint(
        `${branches(9)}\n${lines(41)}\n${nested(3)}`,
        file,
      ).diagnostics.filter(({ category }) =>
        Object.values(categories).includes(category),
      ),
    ).toEqual([]);
  });
});
