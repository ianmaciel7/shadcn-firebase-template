# Individual review: `src/components/ai-elements/web-preview.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ai-elements-web-preview-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ai-elements/web-preview.tsx`
- Associated documentation: installed Next.js 16.4.2 Client Component guidance, applicable React and ARIA patterns, and repository component composition rules.
- Next.js version: `16.4.2`
- Status: Completed after focused regression validation in GitHub Actions run 40131931671.

## Scope

- Responsibility: URL-entry and sandboxed iframe preview with controlled navigation, embedded toolbars and log display.
- Evidence basis: file-level source inspection at commit `86e65b4`; runtime tests, deployment reachability and the full dependency source were not established.

## Code Review

Explicit scheme filtering rejects non-HTTP(S) sources in `WebPreviewBody`. The iframe has a fixed preview title and default sandbox flags; the navigation control exposes tooltips via Base UI composition.

## Findings

### AI-WEBPREVIEW-SANDBOX-001

- Severity: Medium.
- Location: `src/components/ai-elements/web-preview.tsx:204-223`.
- Evidence: `WebPreviewBody` accepts all `ComponentProps<"iframe">`; it sets a restrictive `sandbox` and then spreads caller `...props` after the sandbox attribute. The caller can override the restriction with a permissive value such as `allow-same-origin allow-scripts`, or with an explicitly undefined sandbox attribute. The component therefore cannot guarantee its own declared isolation boundary.
- Recommendation and test: Omit `sandbox`, `src` and other security-sensitive attributes from caller-provided props or explicitly reapply invariant sandbox settings last. Add DOM-level checks with attempted sandbox overrides.

### AI-WEBPREVIEW-INPUT-001

- Severity: Low.
- Location: `src/components/ai-elements/web-preview.tsx:154-205`.
- Evidence: `WebPreviewUrl` wires the input `onChange` to `onChange ?? handleChange`. Providing a custom onChange handler without controlling `value` bypasses the internal `setInputValue`, leaving the input `value={inputValue}` unchanged and making typing appear nonfunctional.
- Recommendation and test: Always synchronize internal state before invoking the external handler, or document and type a strictly controlled pair. Test onChange-only and value/onChange usages.

## Conclusion

- Classification: Partially compliant.
- Boundaries: The sandbox issue is a source-level opt-out of defense-in-depth, not evidence of external attacker control of iframe props on an active route.
- No remediation or completed production validation is claimed. Use the exact item report and regression for follow-up.

## Verified remediation

The preview now locks its `sandbox` and ignores `srcDoc` overrides even when runtime callers provide them, and rejects non-HTTP(S) navigation. The URL input continues to update internal text when `onChange` is supplied. Dedicated unit regressions, TypeScript, the inventory check, English, spelling and Markdown passed in [run 40131931671](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40131931671). Cross-route and deployment validation remain outside this item.
