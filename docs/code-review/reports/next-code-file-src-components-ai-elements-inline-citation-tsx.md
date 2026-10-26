# Individual review: `src/components/ai-elements/inline-citation.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-inline-citation-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/inline-citation.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, applicable React/ARIA conventions, and local component ownership rules. Library-specific runtime contracts have not been independently exercised.
- Next.js version: `16.4.2`
- Status: Completed after focused source correction and tests in GitHub Actions run 40133019315.

## Scope

- Responsibility: Citation hover-card trigger, source labels and navigation of a carousel of referenced sources.
- Evidence basis: individual source inspected at commit `86e65b4` on `fix/react-review-findings`; this is not a production build, browser test, or Next.js documentation item review.

## Code Review

The previous/next controls are native buttons with a default `type="button"` and explicit accessible names. Carousel API subscription is coordinated with an effect and unsubscription.

## Findings

## AI-CITATION-URL-001

- Identifier: `AI-CITATION-URL-001`.
- Severity: Low.
- Category: Input robustness.
- Path and line: `src/components/ai-elements/inline-citation.tsx:62-85`.
- Evidence: `InlineCitationCardTrigger` calls `new URL(sources[0]).hostname` directly during render. A non-empty relative, malformed, or otherwise invalid source string throws `TypeError` and fails the render instead of displaying a fallback. `sources[0]` is a caller-provided string; a valid absolute URL is not guaranteed by the component type.
- Recommended change and regression: Render a safe parsed host with try/catch and a controlled fallback, or narrow and validate the input contract. Test valid HTTPS, relative, malformed and blank source strings.
- Boundary: A render failure is possible for malformed caller input. No current route was proven to pass such a value.

## Conclusion

- Classification: Partially compliant.
- Context and limits: The optional `openDelay` and `closeDelay` props are discarded; verify whether these are intentionally unsupported before treating that as an additional defect.
- Remediation is not claimed; track any finding separately from the review count and validate with the installed dependency versions.

## Verified remediation

The citation hostname is parsed with a guarded URL constructor and falls back to a safe label for malformed, relative or empty source strings. Four regression cases cover valid absolute, relative, malformed and empty URLs. TypeScript, Biome, unit tests, the inventory guard, English, spelling and Markdown all passed in [validation run 40133019315](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40133019315). A full application browser test was not run for this component.
