# Individual review: `src/components/ai-elements/file-tree.tsx`

> **Completion record:** This individual source inspection is complete. The real project validation workflow passed the inventory guard, Biome, TypeScript, regression tests, English, spelling and Markdown checks in [run 40134059605](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40134059605). Findings and runtime verification requests elsewhere in this historical draft remain open unless explicitly remediated. This record supersedes the earlier Pending/draft status wording below.

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-file-tree-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/file-tree.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, React/ARIA patterns and local component ownership rules.
- Next.js version: `16.4.2`
- Status: Completed source review; remaining runtime checks are listed below.

## Scope

- Responsibility: A controlled/uncontrolled file-tree composite with collapsible folders, selection handlers and Set-based expanded paths.
- Evidence basis: full source of this item inspected at commit `86e65b4`; relevant peer composition patterns were considered. This is not a browser, accessibility, or typecheck result.

## Code Review

Toggle operations clone the Set instead of mutating it; the controlled component exposes onExpandedChange. File rows handle Enter and Space, while folder rows are focusable treeitems with separate buttons.

## Findings

### AI-FILETREE-KEYBOARD-001

- Severity: Low.
- Category: Keyboard interaction / ARIA tree.
- Location: `src/components/ai-elements/file-tree.tsx:161-197,256-272`.
- Evidence: The focusable folder treeitem has no onKeyDown support of its own; file treeitems handle Space without preventDefault, which can scroll the document. Arrow-key navigation of the tree is not implemented. Child buttons make focus order unlike the conventional ARIA tree pattern.
- Recommendation: Choose and implement a consistent accessible tree interaction model, then test arrows, Home/End, Enter/Space, expansion, and focus.

## Conclusion

- Classification: Partially compliant; targeted regression pending.
- The finding is directly supported by source inspection and is not labeled as proven in a deployed runtime. Preserve registry ownership conventions and do not infer application-route usage without a caller search.
