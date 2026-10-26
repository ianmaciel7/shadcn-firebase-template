# Individual review: `src/lib/firebase/auth-service-worker.test.ts`

## Identification

- Unique review identity: `next-code-file-src-lib-firebase-auth-service-worker-test-ts`
- Primary file: `src/lib/firebase/auth-service-worker.test.ts`
- Type: CODE_FILE
- Source checkpoint: post-audit security and navigation follow-up
- Baseline: Next.js 16.4.2 and React 19.3.1
- Status: Completed static source inspection; CI validation is tracked on the PR.

## Scope and evidence

This test reads the actual tracked Service Worker source, removes the two
static Firebase CDN imports for isolation, and runs the event listeners
under a Node VM with mocked Auth and Fetch. It checks authenticated
navigation headers and the original-request fallback when token
refresh fails.

## Findings and limits

The test is intentionally isolated from a real Service Worker lifecycle
and Firebase network, so it cannot prove session restoration, production
RSC streaming, or deployed authorization. The protected server route
still enforces its own authorization policy. Runtime assertions are
subject to the GitHub Actions CI result for the accompanying commit.

## Disposition

A source-level regression test with distinct inventory identity. This
report is not evidence of an independent delegated agent execution.
