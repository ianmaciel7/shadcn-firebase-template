# Individual review: `src/instrumentation.ts`

> **Completion record:** This individual source inspection is complete. The real project validation workflow passed the inventory guard, Biome, TypeScript, regression tests, English, spelling and Markdown checks in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605). Findings and runtime verification requests elsewhere in this historical draft remain open unless explicitly remediated. This record supersedes the earlier Pending/draft status wording below.

## Identification

- Full subagent name: `next-code-file-src-instrumentation-ts`
- Type: `CODE_FILE`
- Primary path: `src/instrumentation.ts`
- Associated documentation: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md`
- Next.js version: `16.4.2`
- Status: Completed source review; remaining runtime checks are listed below.

## Scope

- Responsibility: next.js server error instrumentation as a distinct inventory item.
- Files consulted: `src/instrumentation.ts`, `src/instrumentation.test.ts`, and the installed Next.js 16.4.2 instrumentation convention.
- Boundaries: source and related test inspection; no local runtime, emulator, browser, or package-specific checks were executed for this draft.

## Code Review

Exports the documented `Instrumentation.onRequestError` hook, uses the framework route template instead of a concrete URL, and limits structured logs to fixed metadata and a numeric error digest. It deliberately avoids request headers, query strings, and raw exception text.

## Findings

No independently proven issue in this primary item during the scoped source inspection.

## Conclusion

- Classification: Compliant within static-review scope.
- Reason: No proven finding. The use of `unknown`-safe narrowing for the digest is compatible with the runtime type boundary.
- Next step: run the prescribed repository validation commands before changing this manifest row from Pending to Completed.
