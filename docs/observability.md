# Observability and application logging

## Native services

Next.js logs framework diagnostics and server console output to its host.
Its `logging` configuration controls development request and fetch output; it
does not provide persistent, authenticated product usage tracking. Instrumentation
and tracing address server observability and do not automatically record browser
navigation or button usage.

`src/instrumentation.ts` uses the native `onRequestError` hook for captured
Next.js server request failures. It emits an `ERROR` JSON entry on stderr with
`event="next_request_error"`, a framework route template, route type, router
kind, and an optional numeric error digest. It excludes raw errors and stacks,
actual URLs, request headers, cookies, and bodies. This does not replace or
sanitize Next.js's own diagnostic output, and it does not catch arbitrary
background-task failures or browser exceptions.

Cloud Run collects container stderr into Cloud Logging automatically. Elsewhere,
JSON appears in the host's logs and needs an appropriate forwarding mechanism
for Cloud Logging. Merely configuring Firebase Authentication in the browser
does not send the Next.js server logs to Google Cloud. No hosting provider or
exporter is selected by this implementation.

Firebase Cloud Functions provides `firebase-functions/logger`. The `recordUsage`
callable uses `logger.info` with structured fields, forwarded to Google Cloud
Logging in production and printed locally by the Functions emulator. Firebase
verifies callable authentication; the handler rejects anonymous callers, unknown
events, and extra fields. It takes the UID from the verified auth context.

The current allowlist covers the `/profile` screen and `profile.update`
functionality. Screen events mean an access attempt, and functionality events
mean an operation was requested. They do not assert completion. An event has:

- `event`: `app_usage`.
- `schemaVersion`: `1`.
- `eventId`: server-generated UUID for searching and correlation.
- `uid`: authenticated Firebase user ID.
- `type`: `screen_view` or `function_use`.
- `name`: the allowlisted screen or functionality.

Cloud Logging supplies timestamp and severity. Tokens, query strings, form
values, and email addresses are excluded. UID is still personal data; restrict
log access and choose retention according to the application's requirements.

## Guard behavior

`recordUsage` calls the backend before releasing a protected screen.
`withUsageGuard` awaits the same callable before executing a functionality.
Failures, including a 15-second client timeout, block continuation. Sign-out is
independent of the callable, although a blocked screen does not render its
profile controls. Blocking access when telemetry fails is this project's
explicit policy, not a requirement of Next.js or Firebase. The response confirms
handler execution, not durable log storage;
Cloud Logging collection and exclusions still apply. A timeout may happen after
the server emitted an entry, so retrying can generate duplicates.

This is browser instrumentation with authenticated server emission. A modified
client can bypass UI instrumentation or submit allowed events for its own UID.
Authoritative auditing requires logging alongside server-owned mutations.

## Deployment and local use

Deploy the callable before releasing the frontend, and deploy the tightened
Firestore rules to close legacy browser writes:

```bash
firebase deploy --only functions:recordUsage,firestore:rules
```

This document supplies deployment instructions; it does not mean a deployment
has occurred. Function deployment needs an eligible Firebase billing plan and
project permissions. The repository's existing Functions SDK dependencies suffice.

For local testing, start the existing Auth, Functions, and Firestore emulators.
Use the configured Functions emulator host and an authenticated browser session.
Do not point a development build at production accidentally.

Run the handler's authorization and input-validation tests from the root:

```bash
pnpm test:logging
```

Both `pnpm verify:fast` and `pnpm verify:static` include these callable tests.
The CI static job uses `verify:static`.

## Official guidance review

Reviewed against the installed Next.js 16.4.2 documentation and official Firebase
and Cloud Logging references on 2026-10-22. This is a source review, not evidence
of a deployed environment passing verification.

| Area | Implementation and verification status |
| --- | --- |
| Next.js server errors | Native `src/instrumentation.ts` and typed `onRequestError`; synchronous JSON stderr emission, without starting background network tasks. |
| Firebase logs | Native `firebase-functions/logger.info` with approved structured fields. |
| Callable boundary | Authentication required; UID comes from `request.auth`; extra fields and unknown events rejected with `HttpsError`. |
| Log contents | Custom entries omit request headers, tokens, query strings, forms, and raw error messages/stacks. Framework diagnostics are separate. |
| Log collection | Firebase collects deployed Functions logs. Next.js stderr requires Cloud Run or a configured collector on another host. No Next.js host is provisioned here. |
| Abuse protection | App Check is not initialized or enforced. Enabling it requires provider registration and a client setup before backend enforcement; instance limits do not replace it or per-user rate limits. |
| Operational controls | IAM, actual bucket retention, exclusions, sinks, and alerts are not inspected or configured in this repository. |
| Validation | Guard, instrumentation, and callable tests exercise behavior; a successful production build and deployed ingestion test are still required. |

The CLI alias currently points to `demo-test` in `.firebaserc`. Select the actual
production project explicitly before deployment; this review did not select one
or deploy anything. Cloud Logging's `_Default` bucket normally retains entries
for 30 days unless configured otherwise; inspect the actual bucket before
claiming that retention applies to a deployed application.

App Check is a separate protection against unauthorized clients and is not a
mandatory prerequisite for using the logger SDK. Its absence is an outstanding
production hardening decision, not evidence that the logging API is used
incorrectly. Native logging emission also does not guarantee immutable business
auditing, successful mutation completion, or exactly-once delivery.

Raw stacks are intentionally omitted from custom error entries. This limits
debugging detail and automatic Error Reporting grouping; the numeric React digest
helps correlation when available. Do not treat these entries as complete
exception traces. Captured request failures also exclude expected framework
navigation control flow such as `redirect()` and `notFound()`.

## Viewing and controlling logs

Use Firebase Console's Functions logs, Google Cloud Logs Explorer, or:

```bash
firebase functions:log --only recordUsage
```

In Logs Explorer, select the intended project and filter structured usage:

```text
jsonPayload.event="app_usage"
```

Add `jsonPayload.type="screen_view"`, `jsonPayload.name="profile.update"`,
`jsonPayload.uid="USER_UID"`, or `jsonPayload.eventId="EVENT_UUID"` as needed.
For server errors use:

```text
jsonPayload.event="next_request_error"
severity>=ERROR
```

The framework route template (for example `/profile/[id]`) supports grouping
without sending the actual user ID in the URL. An emitted entry can be correlated
with the UI's numeric error digest when Next.js supplies one.

Application usage entries use `INFO`; platform failures can be inspected with
`severity>=ERROR` and the function's resource filters.

Cloud IAM controls who can read logs. Use Logs Viewer for standard logs and
review private-log and log-view permissions separately when applicable. Avoid
exposing a public log endpoint. In Cloud Logging's storage settings, review the
actual bucket retention; configure exclusions or routing sinks there for
volume, cost, and exports. No IAM grants, retention changes, exclusion rules,
alerts, or production exports are provisioned by this implementation.

The function has `maxInstances: 10` and a 15-second handler timeout. These limit
resources and do not provide per-user rate limiting. App Check can add abuse
protection after provisioning its provider and handling debug/emulator clients.
Add new event names to the backend allowlist and the frontend contract together.

Sources: [Firebase logging](https://firebase.google.com/docs/functions/writing-and-viewing-logs),
[callable functions](https://firebase.google.com/docs/functions/callable), and
[Next.js logging](https://nextjs.org/docs/app/api-reference/config/next-config-js/logging),
[Next.js instrumentation](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation),
[App Check enforcement](https://firebase.google.com/docs/app-check/cloud-functions),
[structured logging](https://cloud.google.com/logging/docs/structured-logging), and
[log storage and retention](https://cloud.google.com/logging/docs/store-log-entries).
