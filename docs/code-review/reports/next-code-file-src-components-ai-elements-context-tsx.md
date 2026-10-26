# Individual report — `next-code-file-src-components-ai-elements-context-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-context-tsx`.
- Type: `CODE_FILE`.
- Primary path: `src/components/ai-elements/context.tsx`.
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md`; installed contracts of the AI SDK, Tokenlens, and Base UI Progress/Preview Card.
- Next.js version: `16.4.2`, confirmed in `node_modules/next/package.json`.
- Status: Completed.

## Scope

- Responsibility: full review of the 429 lines of the module, including shared context, percentage, cost, presentation parts, props, and accessibility.
- Files consulted: primary file; `AGENTS.md`; `docs/code-review/README.md`; `docs/code-review/agents-manifest.md`; existing report for `agent.tsx`; `CODING_STANDARDS.md`; `.agents/rules/components-contracts.md`; `.agents/rules/react-hooks-core.md`; `.agents/rules/shadcn-ui-maintenance.md`; `.agents/skills/shadcn/SKILL.md`; `.agents/skills/shadcn/rules/base-vs-radix.md`; `components.json`; `src/components/ui/{button,hover-card,progress}.tsx`; the Next.js guide above; `node_modules/ai/dist/index.d.ts`; `node_modules/tokenlens/{package.json,dist/context.js,dist/context.d.ts}`; `node_modules/.pnpm/@tokenlens+helpers@1.3.1/node_modules/@tokenlens/helpers/dist/context.js`; and installed implementations/types of Base UI Preview Card Trigger and Progress Root/Label.
- Dependencies analyzed: React Context and `useMemo`, AI SDK `LanguageModelUsage`, `tokenlens@1.3.1`, Base UI, and local components.
- Consumers: a search for `ai-elements/context` and `ContextTrigger` in `src/`, outside the file itself, found no current use.
- Method: full static reading, isolated execution of the installed `getUsage`, and isolated SSR rendering of Base UI Progress. No browser, screen reader, application tests, or build were run. There was no remote query or shadcn CLI; contracts were verified in the installed dependencies, with no claim of remote validation.

## Code Review

Correct implementations:

- `"use client"` on line 1 establishes the appropriate boundary for Context, hooks, and interactive primitives. There are no server-only imports, credentials, remote calls, or persistence. The installed Next.js documentation allows context in Client Components and does not require the local owned-component suffixes in this registry code.
- The provider shares a derived value with complete `useMemo` dependencies (lines 52–55); the hook throws a clear message outside the provider (lines 33–40). There is no mirrored state, Effects, or own resources that require cleanup.
- The content parts forward HTML props and combine `className`. `children` allows replacing default presentations. The checks for missing `usage` and the token details match the installed shape of `LanguageModelUsage`, whose detail objects are required even when individual values are undefined.
- The division by `maxTokens` is reused consistently in the three presentations. Cost calculation is delegated to the installed package; the confirmed problem is the incomplete adaptation of the cache details, described below.
- The local `HoverCardTrigger` uses Preview Card Trigger, whose installed default element is an anchor, not a button. Therefore the nested-native-buttons finding found in another component was not automatically attributed to this file. The choice of a single composed element with `render` still deserves integration verification.

Risks and recommendations:

- `maxTokens` accepts any number and there is no normalization of zero, negatives, or non-finite values (lines 67, 109, and 146). With zero, the text may show `NaN%`/infinity and the SVG receives a non-finite value; the installed Progress treats non-finite values as indeterminate. With no explicit unknown-limit contract or demonstrated consumer, this is recorded as an input validation requirement, without a finding of current failure.
- Unknown cost values are formatted as `$0.00`, through `?? 0`; it is advisable to distinguish an unavailable estimate from a free cost. Prices and cent precision are estimates from the installed catalog, not proof of real billing.
- Default texts and formatting use English/`en-US`. A localized integration must provide appropriate content; the absence of current use prevents pointing to an incorrectly translated screen. `space-y-*` is a stylistic divergence, not a functional error or a Next.js requirement.
- The Button props of `ContextTrigger` only reach the default button when `children` is not provided. Consumers who replace the trigger must preserve focus, name, semantics, and handlers in the chosen composition.
- Navigation, Next.js data cache, Server Actions, Route Handlers, and metadata do not apply to this presentation module.

## Findings

### CONTEXT-001 — Total cost ignores the pricing of cached tokens

- Identifier: `CONTEXT-001`.
- Severity: Low.
- Category: data correctness / usage contract adaptation.
- Path and line: `src/components/ai-elements/context.tsx:197-204`, `:255-270`, and `:375-390`.
- Concrete evidence: Footer and Input pass the whole `usage.inputTokens` as `input`, without mapping `inputTokenDetails.cacheReadTokens` or `cacheWriteTokens`. The installed SDK defines `inputTokens` as the input total and distinguishes uncached input, reads, and writes on lines 343–368 of `ai/dist/index.d.ts`. Tokenlens computes input and cache separately (`@tokenlens/helpers/dist/context.js:278-324`). The Cache part itself already computes reads separately. Running the installed `getUsage` for `gpt-4o`, `{input:1000000,output:0}` returns `totalUSD:2.5`, while `{input:0,output:0,cacheReads:1000000}` returns `totalUSD:1.25`. Therefore a valid usage of one million fully cached tokens shows a total/input of `$2.50` and cache of `$1.25`, although the estimate compatible with that distribution is `$1.25`.
- Documentation reference: installed contracts above and `tokenlens/dist/context.js:127-135`, which forwards the usage to the helper. Next.js `05-server-and-client-components.md` confirms the appropriate client context; the finding belongs to the AI SDK/Tokenlens adaptation, not to a Next.js cache rule.
- Impact: incorrect cost estimate when cache tokens are present, with inconsistency between the total and the breakdown. No current consumer was found and no effect on real billing was demonstrated.
- Recommended fix: build a single adaptation of the token distribution to the fields Tokenlens supports; use uncached input and pass cache reads/writes explicitly, preserving the provider's semantics. Derive the total and the rows from the same result to avoid double counting. Do not add reasoning tokens again when they already form part of billable output.
- Suggested test: cover uncached input, fully cached, mixed, and with a cache write, using a fixed catalog and expectations for total/details; confirm that the total does not charge a read at the ordinary input rate.

### CONTEXT-002 — Default Progress receives no accessible name

- Identifier: `CONTEXT-002`.
- Severity: Low.
- Category: accessibility / control name.
- Path and line: `src/components/ai-elements/context.tsx:162-169`.
- Concrete evidence: the default part renders `<Progress ... value={...} />` without `aria-label`, `aria-labelledby`, or `ProgressLabel`. The neighboring paragraphs are not associated with the bar. The local Progress forwards those props but does not create a name; the Base UI Root starts `labelId` undefined and emits `role="progressbar"`, while its Label part registers the ID. Isolated SSR rendering of the same topology with the installed primitive produced `role="progressbar" aria-valuenow="25" aria-valuetext="25%"`, with no name attribute. The primitive does not automatically fix this omission after mounting because no Label part exists in the composition.
- Documentation reference: installed contract of `@base-ui/react/progress/label/ProgressLabel.js`, which describes Label as the accessible label and registers its ID, and `progress/root/ProgressRoot.js`, which uses that ID in `aria-labelledby`. The Next.js Server/Client Components guide does not waive accessible semantics in pre-rendered or interactive HTML.
- Impact: assistive technologies receive a percentage value without a name identifying the context usage. The `aria-label` of another part's SVG does not label this bar. No current consumer was found.
- Recommended fix: provide an accessible name for the default bar, through an associated Label/ID or `aria-label`, with a localization option; preserve the name in custom compositions.
- Suggested test: render the default `ContextContentHeader` and query the bar by role and context-usage name; validate the value and the ID association after mounting, including multiple instances.

## Conclusion

- Classification: Partially compliant.
- Explanation: client boundary, responsibilities, and context are appropriate. There is an incomplete adaptation of cache pricing and a default bar without an accessible name.
- Limits: the experiments use real dependencies, but are isolated; they are not equivalent to rendering the full TSX component in a browser or validating integrated accessibility. Only this individual report was written; no source code was changed.
