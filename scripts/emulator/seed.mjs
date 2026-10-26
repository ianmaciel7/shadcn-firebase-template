import fs from "node:fs";

for (const envFile of [".env.local", ".env"]) {
  if (fs.existsSync(envFile)) {
    process.loadEnvFile(envFile);
    break;
  }
}

const rawHost =
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
if (!rawHost) {
  console.error(
    "[seed] Missing FIREBASE_AUTH_EMULATOR_HOST in environment. Define it in .env (e.g. 127.0.0.1:9099).",
  );
  process.exit(1);
}

const emulatorHost = rawHost.includes("://")
  ? rawHost.replace(/\/$/, "")
  : `http://${rawHost}`.replace(/\/$/, "");
const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
if (!projectId) {
  console.error(
    "[seed] Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in environment. Define it in .env (e.g. demo-test).",
  );
  process.exit(1);
}

const defaultPassword = process.env.TEST_USER_PASSWORD;
if (!defaultPassword) {
  console.error(
    "[seed] Missing TEST_USER_PASSWORD in environment. Define it in .env.",
  );
  process.exit(1);
}

const DEFAULT_USERS = [
  { email: "user@example.test", password: defaultPassword },
  { email: "admin@example.test", password: defaultPassword, role: "admin" },
];

async function createUser(endpoint, { role: _role, ...credentials }) {
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...credentials, returnSecureToken: true }),
  });
}

// Mirrors the setUserRole Cloud Function; "Bearer owner" is emulator-only.
async function assignRole(user) {
  const signIn = await fetch(
    `${emulatorHost}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=emulator-only`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        password: user.password,
        returnSecureToken: true,
      }),
    },
  );
  if (!signIn.ok) return false;
  const { localId } = await signIn.json();
  const update = await fetch(
    `${emulatorHost}/identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:update`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer owner",
      },
      body: JSON.stringify({
        localId,
        customAttributes: JSON.stringify({ role: user.role }),
      }),
    },
  );
  return update.ok;
}

async function reportCreateUserResult(response, email) {
  if (response.ok) {
    const data = await response.json();
    console.log(`[seed] Created user: ${email} (UID: ${data.localId})`);
    return true;
  }

  const errorData = await response.json().catch(() => ({}));
  if (errorData?.error?.message === "EMAIL_EXISTS") {
    console.log(`[seed] User already exists: ${email}`);
    return true;
  }

  console.error(
    `[seed] Failed to create user ${email} (${response.status} ${response.statusText}):`,
    errorData?.error?.message || errorData,
  );
  return false;
}

function reportSeedError(error, email) {
  const connectionFailure =
    error instanceof TypeError &&
    (error.message.includes("fetch failed") ||
      error.cause?.code === "ECONNREFUSED");
  if (connectionFailure) {
    console.error(
      `[seed] Unable to connect to Firebase Auth emulator at ${emulatorHost}. Start it with 'pnpm emulator'.`,
    );
    return;
  }

  console.error(`[seed] Unexpected error creating user ${email}:`, error);
}

export async function seedUsers(users = DEFAULT_USERS) {
  const endpoint = `${emulatorHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only`;
  console.log(
    `[seed] Seeding ${users.length} initial test users to Firebase Auth emulator at ${emulatorHost} (project: ${projectId})...`,
  );

  for (const user of users) {
    try {
      const response = await createUser(endpoint, user);
      if (!(await reportCreateUserResult(response, user.email))) {
        process.exitCode = 1;
        return;
      }
      if (user.role && !(await assignRole(user))) {
        console.error(
          `[seed] Failed to assign role ${user.role}: ${user.email}`,
        );
        process.exitCode = 1;
        return;
      }
    } catch (error) {
      reportSeedError(error, user.email);
      process.exitCode = 1;
      return;
    }
  }

  console.log("[seed] Seeding completed.");
}

await seedUsers();
