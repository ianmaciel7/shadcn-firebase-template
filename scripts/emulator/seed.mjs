const rawHost =
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST ||
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||
  "http://127.0.0.1:9099";
const emulatorHost =
  rawHost.startsWith("http://") || rawHost.startsWith("https://")
    ? rawHost.replace(/\/$/, "")
    : `http://${rawHost}`.replace(/\/$/, "");

const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-auth-e2e";

const defaultPassword = process.env.TEST_USER_PASSWORD || "Test-password-123";

const DEFAULT_USERS = [
  {
    email: "user@example.test",
    password: defaultPassword,
  },
  {
    email: "admin@example.test",
    password: defaultPassword,
  },
];

export async function seedUsers(users = DEFAULT_USERS) {
  const endpoint = `${emulatorHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only`;

  console.log(
    `[seed] Seeding ${users.length} initial test users to Firebase Auth emulator at ${emulatorHost} (project: ${projectId})...`,
  );

  for (const user of users) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          returnSecureToken: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          `[seed] ✓ Created user: ${user.email} (UID: ${data.localId})`,
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData?.error?.message;
        if (message === "EMAIL_EXISTS") {
          console.log(`[seed] ℹ User already exists: ${user.email}`);
        } else {
          console.error(
            `[seed] ✗ Failed to create user ${user.email} (${response.status} ${response.statusText}):`,
            message || errorData,
          );
        }
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        (error.message.includes("fetch failed") ||
          error.cause?.code === "ECONNREFUSED")
      ) {
        console.error(
          `[seed] ✗ Error: Unable to connect to Firebase Auth emulator at ${emulatorHost}.`,
        );
        console.error(
          "[seed] Make sure the emulator is running first (e.g. via 'pnpm emulator').",
        );
      } else {
        console.error(
          `[seed] ✗ Unexpected error creating user ${user.email}:`,
          error,
        );
      }
      process.exitCode = 1;
      return;
    }
  }

  console.log("[seed] Seeding completed.");
}

await seedUsers();
