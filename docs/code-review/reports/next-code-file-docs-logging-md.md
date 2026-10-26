# Individual source review — `docs/logging.md`

## Identification

- Review identity: `next-code-file-docs-logging-md`
- Inventory type: `CODE_FILE`
- Primary path: `docs/logging.md`
- Repository baseline: `bbb02cee5bb8ec943fb66fdfbde8cc67a1bb0170`
- Framework baseline: Next.js 16.4.2 and React 19.3.1
- Status: Completed source inspection; CI revalidation pending

## Scope and evidence

This review addresses only **native error reporting and authenticated usage events**.
The source was read directly at the pinned GitHub branch checkpoint.
The review was performed directly in this session; no independent
subagent process, runtime execution or browser verification is claimed.

Sources cross-checked:

- `src/instrumentation.ts`
- `functions/index.js`
- `functions/usage-logs.cjs`
- `package.json`

## Observed behavior and contracts

- src/instrumentation.ts implements onRequestError and writes structured JSON without serializing raw errors, URLs, headers or request bodies.
- functions/index.js registers the recordUsage callable with a 15-second timeout and maxInstances 10.
- functions/usage-logs.cjs checks request.auth, accepts only approved screen_view and function_use pairs, and generates a server-side eventId.
- The document distinguishes a callable handler acknowledgment from durable Cloud Logging ingestion and explicitly leaves production IAM, retention and App Check decisions open.

## Findings and limitations

- No live Cloud Run, Cloud Logging or Firebase project was accessed. Export, IAM, retention and alerting behavior remain unverified.
- Application and platform error output can still have different redaction semantics; custom structured logs do not sanitize independent framework logs.

No additional confirmed source defect was established within this
documentation review's stated scope. This is not an assertion of
project-wide correctness or complete compatibility.

## Disposition

The individual file and its linked local contracts were inspected.
The inventory item may be counted as a completed static source review;
CI validation and all deployment or behavior tests remain separate.
