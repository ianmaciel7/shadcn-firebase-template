# Next.js compatibility

- Installed version: **16.4.2**, read from `node_modules/next/package.json`.
- Primary source: `node_modules/next/dist/docs/` from the installed package.
- The project uses the App Router under `src/app/`, with Cache Components and Partial Prefetching configured. The completed reviews of setup, project structure, layouts, navigation, Server/Client Components, data fetching, mutation, and caching found no proven mismatch for the inspected surfaces, except the `html lang` issue documented in [findings](findings.md).
- Pages Router guidance, Proxy/Middleware examples, Server Actions, Route Handlers, and deployment recipes must be marked not applicable when the relevant feature is absent; they are not blanket requirements.
- Recommendations from current upstream `canary` are not treated as installed-version contracts unless the installed package supports them. This partial report has not performed a full comparison with canary.

The documentation corpus contains 482 files and 44 folders. Only 21 files and 3 folders have completed individual reports so far. Compatibility conclusions are therefore limited to those reports and are not a whole-framework certification.

Subsequent implementation retains the installed error-boundary retry API. ADR 0019 reverses the ADR 0018 internal route migration: current locale selection uses request cookies without a locale segment or Proxy. Historical applicability statements above describe the audit checkpoint. See [remediation verification limits](resolutions.md); production verification is not established by the individual audit reports.
