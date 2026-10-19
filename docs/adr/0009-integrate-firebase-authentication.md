# ADR 0009: Integrate Firebase Authentication

- **Status**: Accepted (amended: environment-driven configuration and canonical root emulator setup)
- **Date**: 2026-10-19
- **Deciders**: ianmaciel7

## Context

The template includes the immutable FirebaseUI registry layer but no authentication
routes or Firebase project configuration. It has no authenticated product page or
server resource requiring authorization.

## Decision

Use the Firebase Web SDK and the copied Firebase registry screens and buttons
for sign-in, registration, and password recovery under the `(public)` route
group. They are shadcn source owned by this project and use `@firebase-oss/ui-react`
for shared runtime behavior. Initialize
one default Firebase app, Auth instance, and FirebaseUI store in the browser;
`src/lib/firebase.ts` reuses the app and the UI store across development reloads;
the global store's type declaration lives in `src/types/global.d.ts`.
The shared route-group provider in `src/app/_components` observes Auth state
before rendering a screen. Authenticated users go to the existing home page.
Navigation destinations are fixed paths, not user-provided URLs. Google popup
sign-in is optional and controlled by `NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED`.
The UI store follows the next-intl locale using the installed FirebaseUI
translations. Existing next-intl, theme, and tooltip providers remain in place.

The public layout supplies the shared `main` landmark. The route pages compose
the local registry screens directly. They do not add forms,
authentication context, or optional FirebaseUI behaviors. Missing public Web SDK
configuration produces a configuration error on the authentication routes.

For local development and browser tests, opt in to the Auth Emulator by setting
the official Firebase environment variable `FIREBASE_AUTH_EMULATOR_HOST` (e.g.
`127.0.0.1:9099`) alongside a demo project ID starting with `demo-` (such as
`demo-test`, configured via `NEXT_PUBLIC_FIREBASE_PROJECT_ID` or `GCLOUD_PROJECT`
in `.env`). The client connects to the emulator endpoint before initializing
FirebaseUI and rejects non-demo project IDs. In-code default fallback values are
strictly avoided: configuration is read from `.env` and missing variables raise
explicit errors. Production uses the Web SDK configuration with
`FIREBASE_AUTH_EMULATOR_HOST` omitted. Canonical Firebase emulator configuration
resides at the repository root in `firebase.json`, and the default project alias
is maintained in `.firebaserc`, eliminating custom `--config` and `--project` CLI flags.
The configuration enables the Firebase Emulator Suite UI on port 4000 for visual
inspection and interactive debugging of auth accounts during development.
Operational commands for the Firebase Auth Emulator:

- `pnpm emulator`: starts the local Auth Emulator (`firebase emulators:start --only auth`),
  serving the Auth service on port 9099 and the Emulator Suite UI at
  `http://127.0.0.1:4000`.
- `pnpm emulator:seed`: sends seed test accounts to the running emulator for
  local development and testing (`node scripts/emulator/seed.mjs`).
- `pnpm emulator:clear`: clears all accounts in the emulator (`node scripts/emulator/clear.mjs`).

Operational setup is documented in
[TOOLING.md](../../TOOLING.md#firebase-authentication).

## Consequences

Browser authentication and navigation are not server authorization. Route groups
provide no security, and server resources must independently verify credentials
and authorization when introduced. No Admin SDK, server session, protected route,
or logout UI is needed yet. Firebase Console setup and testing expectations are
in [TOOLING.md](../../TOOLING.md#firebase-authentication).

The auth SDK and screens increase the measured client JavaScript bundle to about
467 kB gzip. The client budget is 500 kB gzip to allow for this required auth
runtime while retaining a finite regression limit.

The mocked unit tests cover the initial Auth state and route navigation. The
separate Playwright Auth Emulator suite, configured in `playwright.config.ts`,
exercises email registration and sign-in, persistence, password recovery, locale
navigation, and simulated Google popup sign-in without production credentials.
It runs against a development server and is not part of the standard Playwright
or CI suite. It does not validate real Google consent, email delivery, or MFA;
see [TESTING.md](../../TESTING.md#first-time-setup).

The registry source had upstream type mismatches for optional auth credentials
and optional Base UI selection values. Local forms and the country selector now
handle those API results explicitly. [ADR 0008](0008-install-firebase-ui-registry.md)
records the project's shadcn source-ownership policy.

Firebase Web SDK and emulator parameters are externalized to environment
variables (`.env.example` / `.env`), completely removing in-code default fallback
values across project source, scripts, and test runners. Local emulator usage
relies on the official `FIREBASE_AUTH_EMULATOR_HOST` variable and the `demo-*`
project naming convention to prevent unintended requests to live Firebase services.
Canonical root configuration files (`firebase.json` and `.firebaserc`) enable
the Firebase CLI and test suites to discover emulator bindings and project aliases
natively, eliminating non-standard file paths and custom CLI flags, while enabling
the local Emulator Suite UI for visual user inspection.
