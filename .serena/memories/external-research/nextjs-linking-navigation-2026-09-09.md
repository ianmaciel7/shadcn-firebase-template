# Next.js linking and navigation reference

- Sources: user-supplied official Next.js documentation, https://nextjs.org/docs/app/getting-started/linking-and-navigating (page metadata date 2026-09-09); locally installed Next.js 16.4.2 guide; Context7 official-source query retrieved 2026-10-24.
- Freshness boundary: the supplied documentation is newer than the installed Next.js 16.4.2. Confirm installed docs, types, and next.config.ts before adopting APIs or behavior.
- Related project memory: mem:external-research/nextjs-layouts-pages-2026-08-25.

## Durable findings

- In the App Router, routes render on the server by default. Link prefetching, streaming, and client-side transitions reduce the wait for subsequent navigations while preserving shared layouts and UI state.
- Use next/link for in-app navigation. In production, the default Link prefetch occurs when a link enters the viewport. With Cache Components and Partial Prefetching, the default auto behavior prefetches the route App Shell; prefetch=true opts into a fuller per-link prefetch, including URL-dependent cached content. prefetch=false disables both viewport and hover prefetching.
- For a dynamic route that may wait on server work, provide a route-level loading.tsx fallback. It enables streaming and gives immediate, interruptible visual feedback; use nested Suspense boundaries for finer-grained loading states.
- If a dynamic segment has a finite, build-known set of paths, generateStaticParams can prerender them. Do not add it for unbounded or request-specific paths without an explicit product and cache decision.
- On slow networks, use the client-only useLinkStatus hook from next/link for an accessible local pending cue; debounce its visual treatment to avoid flicker on fast transitions.
- window.history.pushState and replaceState integrate with the Next.js router, so usePathname and useSearchParams observe updates. Use pushState for navigable state changes and replaceState for a non-back-navigable replacement.
- Large client bundles delay Link hydration and therefore prefetching. Prefer moving suitable work to Server Components and inspect bundles before adding client-side loading mechanisms.

## Project applicability

This project uses Next.js 16.4.2 App Router with Cache Components and Partial Prefetching. Its local implementation owners remain .agents/rules/nextjs-maintenance.md, docs/agents/nextjs.md, CODING_STANDARDS.md, ARCHITECTURE.md, DESIGN.md, and TESTING.md. This memory records verified upstream guidance only; it does not authorize a navigation, caching, routing, dependency, or UI change.