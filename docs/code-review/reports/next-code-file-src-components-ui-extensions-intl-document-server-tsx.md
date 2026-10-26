# Source inspection: IntlDocumentServer

- Review identity: `next-code-file-src-components-ui-extensions-intl-document-server-tsx`
- Source path: `src/components/ui/extensions/intl-document-server.tsx`
- Classification: CODE_FILE
- Inspection status: Completed static review

## Ownership

This Server Component reads the request-selected locale from the installed
`next-intl/server` configuration and uses it for the root HTML language.
It retains the existing body classes and suppresses hydration warnings only
at the root HTML boundary. It does not change route segments, cookies, Proxy,
or Next.js Cache Components configuration.

## Risk and validation

A streamed root wrapped in Suspense may produce a default-language shell before
request-specific output. A passing build is not proof of correct initial HTML.
The browser and raw server-response tests in `tests/home.spec.ts` must prove
the selected language and lack of hydration defects in production mode.
If the initial HTML still declares the wrong locale, the issue remains open
and the approach must be revised rather than recorded as resolved.

## Source ownership limit

No independent delegated agent execution or deployment is claimed.
