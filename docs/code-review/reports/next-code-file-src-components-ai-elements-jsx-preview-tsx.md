# Individual review: `src/components/ai-elements/jsx-preview.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-jsx-preview-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/jsx-preview.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, React/ARIA patterns and local component ownership rules.
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: Parses streamed or finalized JSX into caller-provided components using react-jsx-parser, and displays parser errors.
- Evidence basis: full source of this item inspected at commit `86e65b4`; relevant peer composition patterns were considered. This is not a browser, accessibility, or typecheck result.

## Code Review

Keeps stream-completion and preview error state separated; onError callbacks are de-duplicated by processed source. The stream-repair helper is regex/stack based and is intentionally not a complete JSX parser.

## Findings

### AI-JSX-STREAM-001

- Severity: Low.
- Category: Streaming parser correctness.
- Location: `src/components/ai-elements/jsx-preview.tsx:61-124`.
- Evidence: `completeJsxTag` pops the stack for any closing tag without confirming that the closing name matches the most recent opening tag. Unclosed nested or mismatched streaming fragments can therefore produce incorrectly repaired markup, and comments/string literals containing angle brackets are not parsed lexically.
- Recommendation: Use a parser-aware streaming policy or validate tag names before stack updates. Add fixtures for partial attributes, comments, literals and mismatched closures.

## Conclusion

- Classification: Partially compliant; targeted regression pending.
- The finding is directly supported by source inspection and is not labeled as proven in a deployed runtime. Preserve registry ownership conventions and do not infer application-route usage without a caller search.
