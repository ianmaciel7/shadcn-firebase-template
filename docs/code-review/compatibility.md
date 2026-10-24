# Next.js compatibility

- Installed version: **16.4.2**, read from `node_modules/next/package.json`.
- Primary source: `node_modules/next/dist/docs/` from the installed package.
- The project uses the App Router under `src/app/`, with Cache Components and Partial Prefetching configured. The completed reviews of setup, project structure, layouts, navigation, Server/Client Components, data fetching, mutation, and caching found no proven mismatch for the inspected surfaces, except the `html lang` issue documented in [findings](findings.md).
- Pages Router guidance, Proxy/Middleware examples, Server Actions, Route Handlers, and deployment recipes must be marked not applicable when the relevant feature is absent; they are not blanket requirements.
- Recommendations from current upstream `canary` are not treated as installed-version contracts unless the installed package supports them. This partial report has not performed a full comparison with canary.

The reconciled official documentation corpus contains 474 files and 40 folders (after excluding 12 generated `graphify-out/` artifacts). Only 21 files and 3 folders have completed individual reports so far. Compatibility conclusions are therefore limited to those reports and are not a whole-framework certification.

Subsequent implementation retains the installed error-boundary retry API. [ADR 0004](../adr/0004-configure-internationalization.md) preserves direct cookie-only locale selection after reversing the temporary internal route migration: current locale selection uses request cookies without a locale segment or Proxy. [ADR 0005](../adr/0005-document-project-standards.md) and [ADR 0009](../adr/0009-integrate-firebase-authentication.md) place cross-route components/hooks outside `src/app/` and add server-side Firebase session verification with custom claims. Historical applicability statements above describe the audit checkpoint. See [remediation verification limits](resolutions.md); production verification is not established by the individual audit reports.

## Current reviewed source status

As of the validated UI checkpoint, the active inventory has 680 project items and 514 official installed-documentation items. The three new UI corrections are not Next.js-specific API upgrades; their focused unit tests and TypeScript checks passed in the branch review workflow. No complete compatibility certification is claimed for the remaining 1036 pending items.

## Validated source-review completion scope

The updated manifest records 330 completed items (including coordinator and documentary reviews) out of 1210. The additional source-review reports passed English, spelling and Markdown validations at [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605); this is not an exhaustive installed Next.js 16.4.2 documentation review, nor a framework-wide compatibility certification.
