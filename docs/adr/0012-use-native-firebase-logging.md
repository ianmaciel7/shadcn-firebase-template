# ADR 0012: Use native Firebase logging

Status: Accepted

## Context

Usage events should use Firebase's native logging infrastructure. Next.js
request and fetch logging is a development diagnostic and does not automatically
identify authenticated screen or functionality usage.

## Decision

Replace ADR 0011's browser Firestore writes with an authenticated Firebase
callable that validates an event allowlist and emits structured entries through
`firebase-functions/logger` to Cloud Logging. Preserve the guards. Derive user
identity from callable authentication, omit sensitive request values, and deny
browser access to legacy usage documents.

## Consequences

Cloud Logging controls viewing permissions, severity filters, retention,
exclusions, and exports. No new logging library or database collection is needed.
Deploy the function before the frontend. The guard acknowledgment confirms
execution of the handler, not durable Cloud Logging ingestion. Events remain
client-reported attempts; authoritative mutation auditing requires server-owned
operations. An authenticated client can call allowed events repeatedly; instance
limits bound concurrency but are not per-user rate limiting. App Check requires
separate application provisioning and is not enabled by this change.
