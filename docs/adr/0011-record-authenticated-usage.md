# ADR 0011: Record authenticated usage

Status: Accepted

## Context

The application needs records of authenticated screen and functionality access
using its existing Firebase browser SDK and protected gate.

## Decision

Persist append-only, client-reported usage in `usageLogs`, with an authenticated
UID, event type, screen or functionality name, and server timestamp. Await the
write in the protected gate and before profile updates. Keep sign-out independent
so logging outages never prevent ending a session. Exclude queries and form data.

## Consequences

Logging failures block protected screens and profile saves. Browser records
represent attempts and cannot prove completed actions or prevent modified clients
from bypassing instrumentation. Resource authorization remains in Firebase rules.
Authoritative business auditing requires future server-owned mutations. Every
new functionality must explicitly use the shared guard. Rules deployment is
required; no production deployment is performed as part of this change.
