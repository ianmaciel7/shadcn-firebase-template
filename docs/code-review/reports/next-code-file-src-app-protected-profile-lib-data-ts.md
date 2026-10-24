# Individual re-review — `src/app/(protected)/profile/_lib/data.ts`

> **Completion record:** This individual source inspection is complete. The real project validation workflow passed the inventory guard, Biome, TypeScript, regression tests, English, spelling and Markdown checks in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605). Findings and runtime verification requests elsewhere in this historical draft remain open unless explicitly remediated. This record supersedes the earlier Pending/draft status wording below.

## Identification

- Full subagent name: `next-code-file-src-app-protected-profile-lib-data-ts`
- Type: `CODE_FILE`
- Primary path: `src/app/(protected)/profile/_lib/data.ts`
- Next.js documentation baseline: installed version `16.4.2`
- Inspected source: branch `fix/react-review-findings` at commit `2a1d988ce5322be0ddeb743eaeb56e86edb128c4`
- Status: Completed source review; remaining runtime checks are listed below.

## Scope

Review of client-side Firebase persistence, adapter injection, session checks, and multi-store save ordering. This replaces stale observations from earlier code review reports; it does not claim runtime or build validation.

## Source evidence

- Validates persisted locale/theme values when reading Firestore preferences and merges valid preference writes.
- `readProfile` checks lifecycle validity and client session identity after its asynchronous preference read.
- `saveProfile` uses `ProfileDependencies` adapters for isolated tests and checks the active session between asynchronous writes.
- `getProfileUpdate` only includes fields that changed, preventing unrelated Firebase profile property overwrites.
- `data.test.ts` checks cancelled reads, adapter ordering, changed-session guards, and email verification failures.

## Findings and limitations

Partial-write consistency is an operational risk, not a proven code defect: avatar upload, Firebase Auth profile updates and Firestore preference writes are separate operations. A late failure can leave earlier writes applied. No rollback or compensating workflow is implemented in this module. Distinguish this from an atomicity guarantee: neither Firebase SDK nor Next.js automatically provides a cross-service transaction.

## Validation follow-up

Add failing-second/third-operation tests to capture partial success, document user-facing retry semantics, and run the existing dependency-injection test suite. Test Firestore and Storage rules independently.

## Conclusion

Partially verified; service-specific writes are testable, while recovery from partial success needs an explicit product decision. No code change or production validation is claimed in this draft.
