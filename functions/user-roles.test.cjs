const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createSetUserRoleHandler } = require("./user-roles.cjs");

class HttpsError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

function setup() {
  const calls = [];
  const auth = {
    getUser: async (uid) => ({ uid, customClaims: { plan: "pro" } }),
    setCustomUserClaims: async (uid, claims) =>
      calls.push(["claims", uid, claims]),
    revokeRefreshTokens: async (uid) => calls.push(["revoke", uid]),
  };
  return { calls, handler: createSetUserRoleHandler({ auth, HttpsError }) };
}

const admin = { uid: "admin-1", token: { role: "admin" } };

test("rejects unauthenticated callers", async () => {
  const { handler } = setup();
  await assert.rejects(handler({ data: { uid: "u1", role: "admin" } }), {
    code: "unauthenticated",
  });
});

test("rejects callers without the admin role", async () => {
  const { handler, calls } = setup();
  for (const token of [{}, { role: "user" }, { role: "ADMIN" }]) {
    await assert.rejects(
      handler({
        auth: { uid: "u2", token },
        data: { uid: "u1", role: "admin" },
      }),
      { code: "permission-denied" },
    );
  }
  assert.deepEqual(calls, []);
});

test("rejects malformed requests", async () => {
  const { handler, calls } = setup();
  for (const data of [
    null,
    [],
    { uid: "u1" },
    { uid: "", role: "admin" },
    { uid: "u1", role: "owner" },
    { uid: "u1", role: "admin", extra: true },
  ]) {
    await assert.rejects(handler({ auth: admin, data }), {
      code: "invalid-argument",
    });
  }
  assert.deepEqual(calls, []);
});

test("administrators cannot demote themselves", async () => {
  const { handler, calls } = setup();
  await assert.rejects(
    handler({ auth: admin, data: { uid: "admin-1", role: "user" } }),
    { code: "failed-precondition" },
  );
  assert.deepEqual(calls, []);
});

test("merges the role into existing claims and revokes sessions", async () => {
  const { handler, calls } = setup();
  const result = await handler({
    auth: admin,
    data: { uid: "u1", role: "admin" },
  });
  assert.deepEqual(result, { uid: "u1", role: "admin" });
  assert.deepEqual(calls, [
    ["claims", "u1", { plan: "pro", role: "admin" }],
    ["revoke", "u1"],
  ]);
});
