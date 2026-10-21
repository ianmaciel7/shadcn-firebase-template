# ADR 0009: Integrate Firebase Authentication

- **Status**: Accepted (amended: protected profile route, user session display, and dynamic auth navigation)
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
`src/lib/firebase/client.ts` reuses the app and the UI store across development reloads;
the global store's type declaration lives in `src/types/global.d.ts`.
The shared route-group provider in `src/app/_components` observes Auth state
before rendering a screen. Authenticated users are redirected to `/profile`.
Navigation destinations are fixed paths, not user-provided URLs. Google popup
sign-in is optional and controlled by `NEXT_PUBLIC_FIREBASE_GOOGLE_ENABLED`.
The UI store follows the next-intl locale using the installed FirebaseUI
translations. Existing next-intl, theme, and tooltip providers remain in place.

The public layout supplies the shared `main` landmark. The route pages compose
the local registry screens directly. They do not add forms,
authentication context, or optional FirebaseUI behaviors. Missing public Web SDK
configuration produces a configuration error on the authentication routes.
The home page (`src/app/page.tsx`) incorporates a dynamic client navigation control (`src/app/_components/auth-nav-button.tsx`) observing auth state via `onAuthStateChanged`: it presents an accessible link to `/sign-in` ('Sign In') when unauthenticated, and dynamically switches to 'Open App' linking directly to `/profile` when authenticated.

Authenticated user interaction is structured under the `(protected)` route group:

- `src/app/(protected)/layout.tsx` implements a client-side auth guard observing
  `onAuthStateChanged` using the shared Firebase Auth instance. It displays a localized
  loading state while resolving auth state and redirects unauthenticated visitors to `/sign-in`.
- `src/app/(protected)/profile/page.tsx` renders user session details (`email`, `displayName`,
  `uid`) and provides sign-out controls that trigger Firebase `signOut(auth)` and redirect
  to `/sign-in` upon completion, and exposes language and theme preferences.
- User preferences are stored in the Firestore document `users/{uid}` using the modular
  Web SDK. Firebase initialization lives in `src/lib/firebase/client.ts`; the profile
  route's `useProfileActions` hook coordinates Firebase Auth, Storage, and Firestore;
  preference reads/writes and Firestore data validation live in
  `src/lib/firebase/firestore/user-preferences.ts`. The locale is also written
  to the existing `NEXT_LOCALE` cookie and the theme is applied through `next-themes`,
  so both changes take effect immediately. Firestore rules restrict reads and writes to
  the authenticated user whose UID matches the document ID and validate supported
  preference fields and values. Preference synchronization is best-effort so an
  unavailable Firestore instance does not prevent the local controls from working.
- Profile avatars are stored at `users/{uid}/avatar`. Storage rules restrict access to
  the matching authenticated UID and limit uploads to JPEG, PNG, or WebP images no larger
  than 2 MiB, matching client-side validation.

For local development and browser tests, opt in to the Auth Emulator by setting
the official Firebase environment variable `FIREBASE_AUTH_EMULATOR_HOST` (e.g.
`127.0.0.1:9099`) alongside the project configuration in `.env`. The project ID
may use any value appropriate for the local environment; the client connects to
the emulator endpoint before initializing FirebaseUI and only permits emulator
usage in development. In-code default fallback values are strictly avoided:
configuration is read from `.env` and missing variables raise explicit errors.
Production uses the Web SDK configuration with
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
provide UI navigation guarding rather than zero-trust security; server resources
must independently verify credentials and authorization when introduced. While client-side
protected route `/profile` and sign-out UI are implemented under the `(protected)` route
group, no Admin SDK or server-side session management is required at this stage.
Firebase Console setup and testing expectations are
in [TOOLING.md](../../TOOLING.md#firebase-authentication).

The auth SDK and registry screens increase the measured client JavaScript bundle to
about 732 kB gzip. The client budget is 750 kB gzip to accommodate the required
runtime while retaining a finite regression limit.

The mocked unit tests cover the initial Auth state, route navigation, and protected
profile components, meeting the repository's `>= 70%` coverage threshold. The
separate Playwright Auth Emulator suite, configured in `playwright.config.ts`,
exercises email registration and sign-in, persistence, password recovery, locale
navigation, protected profile display, sign-out, and simulated Google popup
sign-in without production credentials. It runs against a development server and
is not part of the standard Playwright or CI suite. It does not validate real
Google consent, email delivery, or MFA; see [TESTING.md](../../TESTING.md#first-time-setup).

The registry source had upstream type mismatches for optional auth credentials
and optional Base UI selection values. Local forms and the country selector now
handle those API results explicitly. [ADR 0008](0008-install-firebase-ui-registry.md)
records the project's shadcn source-ownership policy.

Firebase Web SDK and emulator parameters are externalized to environment
variables (`.env.example` / `.env`), completely removing in-code default fallback
values across project source, scripts, and test runners. Local emulator usage
relies on the official `FIREBASE_AUTH_EMULATOR_HOST` variable and a development-
only guard; no special project ID naming convention is required.
Canonical root configuration files (`firebase.json` and `.firebaserc`) enable
the Firebase CLI and test suites to discover emulator bindings and project aliases
natively, eliminating non-standard file paths and custom CLI flags, while enabling
the local Emulator Suite UI for visual user inspection.
