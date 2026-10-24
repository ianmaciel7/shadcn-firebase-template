# Next.js route special files logic

Repository policy: `page.tsx`, `layout.tsx`, and `template.tsx` stay as
thin **Server Component** entrypoints. This is stricter than the Next.js API,
which permits data access in pages/layouts and Client Components in templates.

- Allow route parameter and search parameter reads, server-side data
  orchestration, Next.js generators (`generateMetadata`,
  `generateViewport`, `generateStaticParams`), static route exports, root
  document setup, and composition of providers and UI.
- Reject `"use client"`, React and third-party hooks (`useState`,
  `useTranslations`, `useRouter`, etc.), direct Firebase SDK imports,
  browser APIs, JSX event handlers, local mutation, conditional control flow,
  loops, exception handling, and inline helper/callback functions.
- Extract UI to colocated `_components/`, client behavior to `_hooks/`,
  and domain operations to dedicated `src/lib/` modules. Server-side data
  reads through those modules are allowed in route entrypoints.
- The mandatory `pnpm check:routes` command scans **all** matching files,
  including the route-group root and future `template.tsx` files. It runs
  self-tests and fails CI on violations; `ast-grep` also marks hook violations
  as errors through `review-route-special-files-logic`.
- `loading.tsx`, `error.tsx`, and `not-found.tsx` retain their individual
  Next.js conventions and are outside this three-file enforcement.

## Official references

- [Next.js layouts and pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages) (`node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`)
- [Next.js page](https://nextjs.org/docs/app/api-reference/file-conventions/page) (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md`)
- [Next.js layout](https://nextjs.org/docs/app/api-reference/file-conventions/layout) (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`)
- [Next.js template](https://nextjs.org/docs/app/api-reference/file-conventions/template) (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/template.md`)
