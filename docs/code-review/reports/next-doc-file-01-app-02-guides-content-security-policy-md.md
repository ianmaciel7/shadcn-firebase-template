# Individual installed Next.js documentation review — `content-security-policy.md`

## Identification

- Reviewer identity: `next-doc-file-01-app-02-guides-content-security-policy-md`
- Type: `DOC_FILE`
- Primary installed documentation path: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`
- Upstream documentation: [Next.js 16.4.2 source](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/content-security-policy.mdx)
- Framework source revision: `2864b1772c37242a9b40ab4d366eb7d368c2a070`
- Application checkpoint: `1b220868d1eb53dd06bbfe797bdfa656517b513d`
- Status: Completed direct source and applicability inspection; CI pending

## Document scope and observed contracts

The Next.js source guide covers **content security policy with next.js**.
- Covers nonce-based CSP setup, rendering consequences and configuration for third-party resources.
- Explains that request-specific nonces require dynamic rendering, with performance implications for static content.
- Describes a non-nonce CSP alternative and experimental integrity options.

## Applicability to the current application

`next.config.ts` does not configure a CSP header in its own exported options. It does configure Cache Components and emulator-only rewrites.

## Findings, cautions and test boundaries

Deployed CSP status depends on hosting and HTTP response headers; no live header assessment or policy rollout was performed.
No independent named subagent process was launched; this inspection used
the immutable upstream MDX content corresponding to the installed-version
documentation source. No test suite, browser or deployment was executed
solely for this item, and other documentation items remain independently
Pending until inspected.

## Disposition

Source and project applicability inspected as one primary item.
Documented examples were classified by relevance rather than assumed
to be production requirements.
