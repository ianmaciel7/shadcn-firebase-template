# Next.js Route Special Files Logic

This rule enforces architectural separation of concerns for Next.js App Router special files (`page.tsx`, `layout.tsx`, `template.tsx`, `loading.tsx`, `not-found.tsx`, `error.tsx`).

## Core Principles

1. **Thin Glue Code / Presentation Controllers**:
   - Special files must only handle routing parameters (`params`, `searchParams`), declare metadata, wrap layout providers, and compose modular presentation components.
   - They must never contain complex domain business logic, inlined multi-step data processing, or heavy computations.

2. **No Inline Client State or Effects in Route Entry Points**:
   - Avoid defining `useState` and `useEffect` directly inside `page.tsx`, `layout.tsx`, or `template.tsx`.
   - When client interactivity or reactive state is required, extract the stateful behavior into semantic components under a colocated private `_components/` directory (e.g., `_components/register-form-client.tsx`, `_components/profile-form.tsx`) or private custom hooks under `_hooks/`.

3. **Data & Domain Logic Segregation**:
   - Domain operations, database mutations, and SDK integrations belong in dedicated domain/lib modules under `src/lib/` or server-only action files, never hardcoded inline inside route templates or pages.

4. **Automated Enforcement**:
   - An `ast-grep` structural rule (`review-route-special-files-logic`) scans all special files in `src/app/**/` to prompt reviews whenever `useState` or `useEffect` is directly invoked in them.
