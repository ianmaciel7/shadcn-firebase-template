# ADR 0013: Capture Next.js server errors

Status: Accepted

## Context

ADR 0012 emits authenticated usage events from Firebase Cloud Functions.
It does not capture errors in the Next.js application server. The installed
Next.js version supports a native `onRequestError` instrumentation hook.

## Decision

Use `src/instrumentation.ts` to emit structured JSON on stderr when Next.js
captures a request error. Include `ERROR` severity, a stable event name, framework
route metadata, and a numeric error digest when available. Exclude raw errors,
stacks, and request headers, URLs, and bodies from the custom entry.

## Consequences

Cloud Run can collect these entries without an extra logging SDK or credentials.
Other hosts require log forwarding to Cloud Logging. No host, IAM policy,
retention policy, or exporter is provisioned here. The hook does not replace
Next.js diagnostic output, catch arbitrary background failures or browser errors,
or guarantee durable log ingestion. Provider-level request logs, application
errors, and authenticated usage events remain distinct event sources.
