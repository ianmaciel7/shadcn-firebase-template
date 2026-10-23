import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = new URL("./seed.mjs", import.meta.url).href;
const cwd = fileURLToPath(new URL("../../", import.meta.url));

function runSeed(response) {
  return spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `
    process.loadEnvFile = () => {};
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = "demo-seed-test";
    process.env.TEST_USER_PASSWORD = "local-test-placeholder";
    globalThis.fetch = async () => ${response};
    await import(${JSON.stringify(script)});
  `,
    ],
    { cwd, encoding: "utf8", timeout: 10000 },
  );
}

test("HTTP failures fail the seed process without a success message", () => {
  for (const status of [400, 500]) {
    const result = runSeed(
      `({ ok: false, status: ${status}, statusText: "Failed", json: async () => ({ error: { message: "REJECTED" } }) })`,
    );
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /Failed to create user/);
    assert.doesNotMatch(result.stdout, /Seeding completed/);
  }
});

test("existing users remain an idempotent success", () => {
  const result = runSeed(
    '({ ok: false, status: 400, json: async () => ({ error: { message: "EMAIL_EXISTS" } }) })',
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Seeding completed/);
});

test("successful creation completes normally", () => {
  const result = runSeed(
    '({ ok: true, json: async () => ({ localId: "test-user" }) })',
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Created user/);
  assert.match(result.stdout, /Seeding completed/);
});

test("network failures fail the seed process", () => {
  const result = runSeed('Promise.reject(new TypeError("fetch failed"))');
  assert.equal(result.status, 1, result.stderr);
  assert.doesNotMatch(result.stdout, /Seeding completed/);
});
