# Next.js project structure reference

- Source: user-supplied Next.js documentation, `https://nextjs.org/docs/app/getting-started/project-structure`
- Page metadata date: 2026-07-21
- Freshness boundary: validate against the installed Next.js version before using it to change application code.
- Installed-version review: verified against Next.js 16.4.2 on 2026-10-24 using `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`.
- Scope: concise durable guidance, not a complete file-convention inventory. Consult the version-matched guide for `global-error`, metadata conventions, and other specialized files.

## Durable findings

- `src/` may contain application code; top-level configuration stays at the repository root.
- App Router routes become public only with `page` or `route`; other colocated files are not exposed as routes.
- Route groups, `(group)`, organize routes and layouts without affecting URLs.
- Private folders, `_folder`, are excluded from routing and suit route-local implementation details.
- Layouts nest and wrap descendant route segments. Standard route files include `layout`, `page`, `loading`, `error`, `not-found`, `route`, `template`, and `default`.
- Dynamic routing supports single, catch-all, and optional catch-all segment patterns.
- Parallel routes (`@slot`) and interception conventions fit named slots and modal/overlay navigation.
- Next.js does not prescribe a single organization strategy; consistency and feature/route-local colocation are encouraged.
