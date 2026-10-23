# React maintenance

Use installed React and React DOM 19.3.1 and React Compiler 1.0.0 as the runtime
and tooling baseline. Read [the official-source review](../../docs/agents/react.md)
and the relevant current API before implementation; live docs also include
experimental features and historical release material.

- Keep purity, state, hooks, Effects, refs, Actions, identity, and Compiler
  conventions in [CODING_STANDARDS.md](../../CODING_STANDARDS.md#react-rendering-hooks-and-identity).
  Verify the concrete local pattern before recording a blanket rule.
- Apply the [component orchestration policy](component-naming.md),
  [route policy](route-special-files.md), and form contracts as local
  conventions, not React requirements. Presentation-only hooks may be
  composed directly; extra single-line wrappers and redundant state flags
  should not be added to satisfy a naming heuristic.
- Model mutually exclusive phases with one discriminated `status` and let
  TypeScript narrow its branch data. Do not restore `isLoading`/`isError`
  when `status` already represents them. Independent flags remain valid.
- `Suspense` requires a supported source that suspends while rendering;
  a Firebase Auth `useEffect` subscription does not suspend automatically.
  Prefer a tested loading branch rather than inventing a Promise wrapper.
- Inject service dependencies at operation boundaries (as in
  `src/lib/profile.ts`) when it makes integration tests independent of
  Firebase; do not pass dependency containers through presentational fields.
- Use [native diagnostic ownership](../../TOOLING.md#react-documentation-and-diagnostic-workflow)
  before adding custom syntax guards. Never infer complete Compiler/ESLint
  coverage from the Biome React domain.
- Match [lifecycle tests](../../TESTING.md#react-rules-and-lifecycle-verification)
  to actual subscriptions, resources, hydration, and hidden/revealed state.
  Configuration tests do not establish application behavior or profiling results.
- Follow [security guidance](../../SECURITY.md#react-rendering-and-input-boundaries)
  at HTML/URL/data boundaries. UI state, context, and optimistic feedback do not
  authorize access.
- Persist verified knowledge through the [save skill](../skills/save/SKILL.md)
  in its canonical owner. Do not install recommended skills, change lint stacks,
  upgrade dependencies, replace form libraries, or rewrite accepted ADRs as a
  side effect of reviewing documentation. Preserve unrelated working-tree edits.
