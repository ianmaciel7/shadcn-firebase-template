# Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-02-project-structure-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Associated documentation: Project structure and organization (installed documentation)
- Next.js version: `16.4.2`
- Status: completed

## Scope

Responsibility: interpret exclusively the project organization convention and compare it with the repository's structure. Consulted only as evidence of applicability: `src/app/layout.tsx`, `src/app/page.tsx`, the layouts and pages of the `(protected)` and `(public)` groups, `next.config.ts`, `.gitignore`, and the `src/app` tree.

Dependencies analyzed: the Next.js App Router, route groups, private folders, the special route files, and the `src` configuration described in the primary document.

## Code Review

### Correct implementations

- The project uses the optional `src` directory and keeps `src/app` as the App Router root, while configuration stays in the repository root (`next.config.ts:1-52`), compatible with the **src folder** section.
- `src/app/layout.tsx:40-73` provides the root layout and `src/app/page.tsx:1-5` exposes the `/` route, following the `layout` and `page` conventions.
- The `(protected)` and `(public)` directories are route groups; their layouts (`src/app/(protected)/layout.tsx:1-5`, `src/app/(public)/layout.tsx:1-11`) organize the application without entering the URL, exactly as the **Route groups** section provides.
- Private components, hooks, and utilities are placed in `_components`, `_hooks`, and `_lib` below route segments, for example `src/app/(protected)/profile/_components/`, which is compatible with the **Private folders** section and avoids accidental exposure of implementation modules.
- The special error, loading, and not-found files are at the root of `app`: `error.tsx`, `loading.tsx`, and `not-found.tsx`. `error.tsx` declares the client boundary at `src/app/error.tsx:1`, consistent with the file's function.
- `.gitignore:41-43` excludes `.env*` and allows only `.env.example`, meeting the documentation's recommendation not to version real environment files.

### Issues found

No proven issue within the scope of this document.

### Risks

- The documentation describes alternatives such as the Pages Router, parallel routes, intercepting routes, `proxy.ts`, `instrumentation.ts`, and multiple root layouts. They are not required by the current App Router; adding them unnecessarily would be scope expansion, not a fix.
- The `(protected)` and `(public)` groups do not constitute authorization by themselves. The protection observed in the layout is an implementation detail that must continue to be audited in the corresponding individual reports.

### Recommendations

- Preserve the current separation: special route files in `src/app`, route details in folders starting with `_`, and shared resources outside the segments when there is real reuse.
- When introducing new routes, confirm whether the file is one of the special Next.js names and keep the public route limited to an intentional `page` or `route`.

## Findings

There are no proven findings for this item.

## Conclusion

**Compliant.** The real structure uses the App Router under `src/app`, a root layout, special files, and the documented combination of route groups and private folders. No concrete divergence was found between this installed Next.js 16.4.2 document and the paths consulted.
