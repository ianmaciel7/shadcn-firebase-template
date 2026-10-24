# Review: `src/components/ui/extensions/intl-provider-server.tsx`

## Identification

- Full subagent name: `next-code-file-src-components-ui-extensions-intl-provider-server-tsx`
- Type: `CODE_FILE`
- Primary path: `src/components/ui/extensions/intl-provider-server.tsx`
- Associated documentation: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`; `CODING_STANDARDS.md` (Server/Client boundaries and owned component placement); `.agents/rules/nextjs-maintenance.md`.
- Next.js version: `16.4.2`
- Status: Completed.

## Scope

- Responsibility: individual review of the server internationalization provider and its runtime boundaries.
- Files consulted: `src/components/ui/extensions/intl-provider-server.tsx`, `src/app/layout.tsx`, `src/i18n/request.ts`, `node_modules/next-intl/dist/types/shared/NextIntlClientProvider.d.ts`, `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `CODING_STANDARDS.md`, `.agents/rules/react-dom-server.md`, `.agents/rules/react-quality.md`.
- Dependencies analyzed: `server-only`, `next-intl`, `next-intl/server`, React `Suspense`, and the Next.js App Router.

## Code Review

Correct implementations:

- `import "server-only"` prevents the module that reads request data from being accidentally imported by the Client graph.
- The component is asynchronous and uses `getLocale()` and `getMessages()` on the server, without hooks, state, or browser APIs.
- The client provider receives the server-rendered content through `children`. Next.js documents this Server/Client provider composition pattern and the passing of server content as children.
- The current caller in `src/app/layout.tsx:58-68` provides no locale or message overrides and wraps the provider in a `Suspense` boundary; the locale/cookie reads can suspend below that boundary.
- The locale and message reads are consistent with `src/i18n/request.ts`, which validates the cookie locale against `routing.locales` and uses the default locale when the value is unsupported.

There is no colocated test for this file. The review was static; no build, tests, or runtime inspection were run.

## Findings

### INTLPROVIDER-001

- Identifier: `INTLPROVIDER-001`
- Severity: Low
- Category: Component contract / internationalization
- Path and line: `src/components/ui/extensions/intl-provider-server.tsx:9,14`
- Concrete evidence: the signature reuses `React.ComponentProps<typeof NextIntlClientProvider>`, whose type allows an optional `locale` and inherits the provider's other options, including `messages`. The component first computes the locale and messages from the request, but `{...props}` comes after in `<NextIntlClientProvider locale={locale} messages={messages} {...props}>`; a caller can therefore replace the request-derived values and render a message context incompatible with the selected locale. The current use in `src/app/layout.tsx` passes only `children`, so the risk is not exercised by that caller.
- Documentation reference: Next.js defines the Server/Client boundary as a graph boundary and prop serialization in `05-server-and-client-components.md`; the local rule on [compound components and Server/Client boundaries](../../CODING_STANDARDS.md#compound-components-and-serverclient-boundaries) requires contracts and boundaries to be explicit. The exact semantics of the props were confirmed in the installed `next-intl` type cited above.
- Impact: a future composition may inadvertently display messages for another locale or bypass the request configuration that validates the cookie.
- Recommended fix: exclude `locale` and `messages` from the props type the wrapper accepts, preserving the forwarding of the other supported options; alternatively, forward the other props before the computed values so that the request remains the source of truth.
- Suggested test: a unit test that supplies conflicting `locale`/`messages` and confirms that the provider receives the values computed from the request; complement it with a type check that prevents those overrides.

## Conclusion

- Classification: Partially compliant.
- Explanation: the module correctly keeps the internationalization reads on the server, protects its graph with `server-only`, and composes the client provider under the existing `Suspense` boundary. The wrapper, however, exposes props that can replace the values it resolves from the request itself. The current caller does not trigger this case, so the finding is low severity and preventive.
