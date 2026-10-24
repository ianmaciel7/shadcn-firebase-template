# Individual report — `next-code-file-src-components-ai-elements-code-block-tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-code-block-tsx`.
- Type: `CODE_FILE`.
- Primary path: `src/components/ai-elements/code-block.tsx`.
- Associated documentation: installed Next.js, `01-app/01-getting-started/05-server-and-client-components.md` and `01-app/03-api-reference/01-directives/use-client.md`; local React, accessibility, and Base UI component contracts.
- Next.js version: `16.4.2`, confirmed by the installed package.
- Status: Completed.

## Scope

- Responsibility: full review of the 582 lines of the module, including tokenization, caches, subscriptions, rendering, copying, and language selection.
- Files consulted: primary file; `AGENTS.md`; `docs/code-review/README.md`; `docs/code-review/agents-manifest.md`; individual report for `agent.tsx`; `CODING_STANDARDS.md`; `.agents/rules/components-contracts.md`; `.agents/rules/react-hooks-core.md`; `.agents/rules/react-quality.md`; `.agents/rules/nextjs-maintenance.md`; `.agents/rules/shadcn-ui-maintenance.md`; `.agents/skills/shadcn/SKILL.md`; `src/components/ui/button.tsx`; `src/components/ui/select.tsx`; `src/components/ai-elements/agent.tsx`; `src/components/ai-elements/tool.tsx`; the Next.js guides above; installed Shiki package; Lucide implementation in `node_modules/lucide-react/dist/cjs/lucide-react.js`.
- Dependencies analyzed: React `19.3.1`, Shiki `4.5.0`, local Button/Select with Base UI, Lucide, token types, and context-based composition.
- Consumers: `agent.tsx` and `tool.tsx` import `CodeBlock`. A search in `src/` found no consumer of `CodeBlockCopyButton` outside this module. This shows use by other library components, without establishing an application route that renders them.
- Method: static inspection and an isolated experiment with the cache/tokenization functions extracted from the file itself, transpiled by TypeScript and run with the installed Shiki. No build, browser, real Clipboard, screen reader, or remote documentation query was run.

## Code Review

Correct implementations:

- The `"use client"` directive on line 1 covers hooks, context, and the Clipboard handler; there is no import of a server-only API or secret. Access to `window` and `navigator` happens in the handler, not during the initial render.
- Code content is rendered as React text in `TokenSpan`, without `dangerouslySetInnerHTML`. There is no evidence of executing the displayed code or of HTML injection through this path.
- The raw-token fallback allows presenting text before the language loads; tokenization errors are caught. Token styles derive from the installed Shiki contract.
- The tokenization Effect invalidates stale callbacks through the `cancelled` flag; the timeout already created by the copy button has cleanup. Props for HTML structures, Button, and Select are forwarded to the corresponding components.
- `code: string` is an explicit contract on lines 111-114 and 379-382. The problem of `agent.tsx` passing `undefined` from a lazy schema already belongs to `AGENT-001`; it was not duplicated as a CodeBlock defect.
- The naming exceptions for AI Elements prevent classifying arrow functions, `memo`, or the absence of an integration suffix as failures of the owned-component guard.

Risks and recommendations:

- `highlightCode` is called by `useMemo` during render (lines 388-390) and can start asynchronous work and modify module maps. It is recommended to separate the pure cache lookup from starting work in the Effect; a Compiler or hydration failure was not asserted without running those environments.
- Token and highlighter caches have no limit or disposal, and cancelled callbacks remain in the map until the operation finishes. In a long session with many snippets, measure retention before choosing a limit/eviction policy. There is no memory measurement in this review.
- A still-pending Clipboard write can resolve after cleanup and create a new timeout. Verify replacement, unmounting, and Activity if this control is adopted; no visible failure of this case was reproduced.
- The file does not use a data API, Next.js cache, metadata, route, or Server Action. Those features are not applicable to the module; its local token cache is not a framework data cache.

## Findings

### CODEBLOCK-001 — Cache key collides and shows code from another snippet

- Identifier: `CODEBLOCK-001`.
- Severity: Medium.
- Category: data correctness / cache identity.
- Path and line: `src/components/ai-elements/code-block.tsx:144-147`, lookup on lines 190-195 and storage on line 228.
- Concrete evidence: the key contains only the language, the length, the first 100 characters, and the last 100 characters. Two texts with the same length and ends, but with an edit in the middle, produce the same key. `highlightCode` immediately returns the earlier tokens; `CodeBlockBody` presents the content of those tokens, not the new `code`. The same identifier also shares the set of callbacks, so the collision affects concurrent requests, in addition to later reads.
- Verification run: I extracted, without altering the logic, the section between `// Highlighter cache` and `const CodeBlockBody`, removed the types with `typescript.transpileModule`, and injected `createHighlighter` from the installed Shiki. I used a prefix and suffix longer than 100 characters and bodies `const result = "first";` / `const result = "other";`. After the first tokenization finished, I requested the second. Output: `distinctInputs true`, `equalLength true`, `equalCacheKey true`, `secondResultEqualsFirstInput true`, `secondResultEqualsRequestedInput false`. The experiment confirms the return of incorrect text by the real extracted functions; it is not a browser test of the full component.
- Documentation reference: `.agents/rules/react-quality.md` requires cache identity by data identity. The installed Next.js Server/Client Components guide establishes the correct client boundary; the failure is in the presentation's own cache, not in the Next.js cache API.
- Impact: an equal-size update in the middle of a long snippet, or another block with the same ends, can keep showing earlier code. This undermines trust in the display of code or tool outputs. No sharing between users, data leak, or security exploitation was demonstrated.
- Severity rationale: the failure changes the main content displayed for valid inputs of an API already imported by `agent.tsx` and `tool.tsx`, rather than affecting only secondary presentation or optional configuration. No active route exposing those consumers was established; the medium classification describes the library's integrity and should be reassessed as it is adopted in the application.
- Recommended fix: use the language and the full content as identity, for example maps nested by language/text; if opting for a hash, adopt a strategy that verifies the content on collisions. Apply the same identity to the cache and to the subscriptions.
- Suggested test: tokenize two texts with equal length and ends but different middle content; confirm that the second result reconstructs exactly the second text. Cover sequential and concurrent calls and editing the same component without unmounting.

### CODEBLOCK-002 — Default copy button has no accessible name

- Identifier: `CODEBLOCK-002`.
- Severity: Low.
- Category: accessibility / component default contract.
- Path and line: `src/components/ai-elements/code-block.tsx:501-510`.
- Concrete evidence: when the consumer provides neither `children` nor naming attributes, the button renders only `CheckIcon` or `CopyIcon`. No `aria-label`, `aria-labelledby`, hidden text, or `title` is defined by the component. The local Button forwards props to Base UI and adds no name. Lucide sets `aria-hidden="true"` by default on its SVG. Therefore, the default composition allows a button without a programmatic name.
- Documentation reference: `CODING_STANDARDS.md:350-362`, the shadcn/ui accessibility contract, requires an accessible name for icon actions. The installed Next.js Server/Client Components guide confirms the interactive boundary; it does not replace the control's naming requirement.
- Impact: assistive technologies do not identify the copy action in the default configuration. The severity takes into account that no current consumer of this button was found in `src/`; no failure already exposed on a page is asserted.
- Recommended fix: provide a replaceable, localizable default accessible name, or require naming in the props contract. Preserve the accessible attributes and content the consumer provides.
- Suggested test: render the button without children inside CodeBlock and query it by role and copy name; verify the name after success, localization attributes, and the variant with explicit children/`aria-label`. Validate the real Clipboard and keyboard flow in a browser.

## Conclusion

- Classification: Partially compliant.
- Explanation: client boundary, content escaping, and division into parts are appropriate, but the partial cache identity returns incorrect content for valid inputs. The optional copy button also offers a default configuration without an accessible name.
- Limits: full static review and isolated reproduction of the cache with the real Shiki. No claim of passing build, integrated accessibility, hydration, Clipboard, or browser tests. Only this report was written.
- Markdown: the correct executable `node node_modules/markdownlint-cli2/markdownlint-cli2-bin.mjs` analyzed 93 files because it includes the configuration glob. It found 48 pre-existing problems in the manifest and in the `tsconfig.json` report; it flagged no problem in this report. This is not a global Markdown approval of the repository.
