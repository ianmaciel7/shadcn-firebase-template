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
].map((path) => mkdtempSync(join(root, path, "next-import-rules-")));
const vendorFile = join(
  root,
  "src/components/ui",
  `next-import-${process.pid}.tsx`,
);

afterAll(() => {
  for (const directory of directories)
    rmSync(directory, { recursive: true, force: true });
  rmSync(vendorFile, { force: true });
});

function lint(file: string, source: string) {
  writeFileSync(file, source);
  try {
    return execFileSync(
      process.execPath,
      [biome, "lint", "--only=style/noRestrictedImports", file],
      {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      },
    );
  } catch (error) {
    const { stdout = "", stderr = "" } = error as {
      stdout?: string;
      stderr?: string;
    };
    return `${stdout}${stderr}`;
  }
}

describe("native App Router import policy", () => {
  it.each(["next/router", "next/head", "next/document", "next/app"])(
    "rejects %s throughout owned application code",
    (path) => {
      for (const directory of directories) {
        const output = lint(
          join(directory, "invalid.tsx"),
          `import Legacy from "${path}"; export { Legacy };`,
        );
        expect(output).toContain("lint/style/noRestrictedImports");
        expect(output).toContain("App Router");
      }
    },
  );

  it.each([
    "next/navigation",
    "next/link",
    "next/image",
    "next/headers",
    "next/cache",
  ])("accepts the App Router API %s", (path) => {
    const output = lint(
      join(directories[0], "valid.tsx"),
      `import * as NextApi from "${path}"; export { NextApi };`,
    );
    expect(output).not.toContain("lint/style/noRestrictedImports");
    expect(output).not.toContain("parse");
  });

  it("rejects re-exports of the legacy router", () => {
    expect(
      lint(
        join(directories[0], "re-export.ts"),
        'export { useRouter } from "next/router";',
      ),
    ).toContain("lint/style/noRestrictedImports");
  });

  it("keeps untouched vendor components outside this policy", () => {
    expect(
      lint(vendorFile, 'import Router from "next/router"; export { Router };'),
    ).not.toContain("lint/style/noRestrictedImports");
  });
});
