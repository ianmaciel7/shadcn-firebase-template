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

export async function clearAccounts() {
  const endpoint = `${emulatorHost}/emulator/v1/projects/${projectId}/accounts`;

  console.log(
    `[clear] Clearing accounts from Firebase Auth emulator at ${emulatorHost} (project: ${projectId})...`,
  );

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log(
        `[clear] ✓ Successfully cleared all accounts for project: ${projectId}`,
      );
    } else {
      const errorText = await response.text().catch(() => "");
      console.error(
        `[clear] ✗ Failed to clear accounts (${response.status} ${response.statusText}): ${errorText}`,
      );
      process.exitCode = 1;
    }
  } catch (error) {
    if (
      error instanceof TypeError &&
      (error.message.includes("fetch failed") ||
        error.cause?.code === "ECONNREFUSED")
    ) {
      console.error(
        `[clear] ✗ Error: Unable to connect to Firebase Auth emulator at ${emulatorHost}.`,
      );
      console.error(
        "[clear] Make sure the emulator is running first (e.g. via 'pnpm emulator').",
      );
    } else {
      console.error(
        "[clear] ✗ Unexpected error while clearing accounts:",
        error,
      );
    }
    process.exitCode = 1;
  }
}

await clearAccounts();
