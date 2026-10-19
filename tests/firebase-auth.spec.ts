import { expect, test } from "@playwright/test";

const emulator = "http://127.0.0.1:9099";
const project = "demo-auth-e2e";
const password = "Test-password-123";

test("registration and persisted authentication redirect", async ({ page }) => {
  const email = `register-${crypto.randomUUID()}@example.test`;
  await page.goto("/sign-in");
  await page.getByRole("button", { name: /don't have an account/i }).click();
  await expect(page).toHaveURL(/\/register$/);
  await page.getByLabel("Email Address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/sign-in");
  await expect(page).toHaveURL("/");
});

test("invalid credentials and successful sign-in", async ({
  page,
  request,
}) => {
  const email = `login-${crypto.randomUUID()}@example.test`;
  const created = await request.post(
    `${emulator}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only`,
    { data: { email, password, returnSecureToken: true } },
  );
  expect(created.ok()).toBeTruthy();
  await page.goto("/sign-in");
  await page.getByLabel("Email Address").fill(email);
  await page.locator("#password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page.getByText(/invalid|incorrect/i)).toBeVisible();
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test("password recovery sends an emulator reset code and displays failures", async ({
  page,
  request,
}) => {
  const email = `reset-${crypto.randomUUID()}@example.test`;
  const create = await request.post(
    `${emulator}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only`,
    { data: { email, password, returnSecureToken: true } },
  );
  expect(create.ok()).toBeTruthy();
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "Forgot Password?" }).click();
  await expect(page).toHaveURL(/\/forgot-password$/);
  await page.getByLabel("Email Address").fill(email);
  await page.route("**/accounts:sendOobCode?*", (route) =>
    route.abort("failed"),
  );
  await page
    .getByRole("button", { name: "Reset Password", exact: true })
    .click();
  await expect(page.getByText(/unable to connect|network/i)).toBeVisible();
  await page.unrouteAll();
  await page
    .getByRole("button", { name: "Reset Password", exact: true })
    .click();
  await expect(
    page.getByText("Check your email for password reset instructions"),
  ).toBeVisible();
  const response = await request.get(
    `${emulator}/emulator/v1/projects/${project}/oobCodes`,
  );
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(
    body.oobCodes.some(
      (code: { email: string; requestType: string }) =>
        code.email === email && code.requestType === "PASSWORD_RESET",
    ),
  ).toBe(true);
});

test("navigation and translated screens", async ({ page, context }) => {
  await page.goto("/forgot-password");
  await page.getByRole("button", { name: /back to sign in/i }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await context.addCookies([
    { name: "NEXT_LOCALE", value: "pt-BR", url: "http://127.0.0.1:3100" },
  ]);
  await page.reload();
  await expect(page.getByLabel("Endereço de e-mail")).toBeVisible();
});

test("Google popup signs in with the emulator", async ({ page }) => {
  await page.goto("/sign-in");
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Sign in with Google" }).click();
  const popup = await popupPromise;
  await popup.getByRole("button", { name: /add new account/i }).click();
  await popup
    .getByLabel(/email/i)
    .fill(`google-${crypto.randomUUID()}@example.test`);
  await popup.getByRole("button", { name: /sign in/i }).click();
  await expect(page).toHaveURL("/");
});
