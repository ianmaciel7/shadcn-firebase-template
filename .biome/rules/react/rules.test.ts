import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const root = resolve(__dirname, "../../..");
const biome = join(root, "node_modules/@biomejs/biome/bin/biome");
// Biome 2.5 expects explicitly checked files to be under the workspace root.
// Keep fixtures inside the repository and remove them after the test suite.
const vendorDir = mkdtempSync(join(root, "src/components/ui", "grit-rules-"));
const dir = mkdtempSync(join(root, "src/components", "grit-rules-"));

afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
  rmSync(vendorDir, { recursive: true, force: true });
});

// Biome has no test harness for GritQL plugins, so lint a fixture with the
// project configuration and return everything the CLI printed.
function lint(name: string, source: string, directory = dir) {
  const file = join(directory, name);
  writeFileSync(file, source);
  const args = [
    biome,
    "lint",
    `--config-path=${join(root, "biome.json")}`,
    file,
  ];
  try {
    return execFileSync(process.execPath, args, {
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

describe("prefer-is-error", () => {
  const message = "Expose isError from the hook";

  it.each(["===", "==", "!==", "!="])(
    "reports %s in either operand order",
    (operator) => {
      for (const expression of [
        `state.status ${operator} "error"`,
        `'error' ${operator} session.status`,
      ]) {
        expect(
          lint("invalid.tsx", `export const failed = ${expression};`),
        ).toContain(message);
      }
    },
  );

  it.each(["state.isError", "!state.isError", 'state.status === "success"'])(
    "accepts %s",
    (expression) => {
      const output = lint("valid.tsx", `export const failed = ${expression};`);
      expect(output).not.toContain(message);
      expect(output).not.toContain("parse");
    },
  );

  it("excludes vendored components", () => {
    expect(
      lint(
        "vendor.tsx",
        'export const failed = state.status === "error";',
        vendorDir,
      ),
    ).not.toContain(message);
  });

  it("allows deriving the flag in a hook module", () => {
    const output = lint(
      "use-state.ts",
      'export const isError = state.status === "error";',
    );
    expect(output).not.toContain(message);
  });
});
