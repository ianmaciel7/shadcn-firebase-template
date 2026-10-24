# Individual report — `next-doc-file-01-app-01-getting-started-16-proxy-md`

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-16-proxy-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- Associated documentation: Proxy file convention, `next.config.ts` redirects/rewrites, authorization boundaries.
- Next.js version: `16.4.2`
- Status: completed.

## Scope

- Responsibility: full reading of the installed Proxy guide and verification of applicability to the project.
- Files consulted: primary document; `package.json`; `next.config.ts`; `.agents/rules/nextjs-maintenance.md`; search for `proxy.*`, `middleware.*`, `NextRequest`, `NextResponse`, `middleware`, and `proxy` in `src/` and `next.config.ts`.
- Dependencies analyzed: `next@16.4.2`, the App Router in `src/app/`, and the conditional Firebase emulator rewrites.

## Code Review

The guide states that since Next.js 16 Middleware was renamed Proxy, keeping the functionality. The `proxy.ts` or `proxy.js` file must live at the project root or in `src/`, at the same level as `app`/`pages`, and the project accepts only one Proxy file; the logic can be delegated to imported modules. It describes `NextRequest`, `NextResponse`, and `config.matcher` as implementation APIs.

The guide also limits its use: Proxy can adjust headers, rewrite or redirect requests, but it is not suitable for slow data fetching or for full session or authorization management. For simple redirects, the document directs evaluating `redirects` in `next.config.ts` first; fetch cache options have no effect in Proxy.

Correct implementations / applicability:

- The project contains no versioned `proxy.ts`, `proxy.js`, `middleware.ts`, or `middleware.js`. A search of the sources also found no use of `NextRequest`/`NextResponse` or a Proxy implementation.
- The local rules in `.agents/rules/nextjs-maintenance.md` preserve the Firebase authorization boundary and warn that Proxy/client guards do not replace data-layer authorization. This is consistent with the explicit limit of the installed guide.
- `next.config.ts` declares rewrites to Firebase Emulator endpoints only in development and returns an empty list otherwise. They are configuration rewrites to known destinations and there is no evidence that the project needs a Proxy to implement them.
- Since no Proxy surface currently exists, the matcher, runtime, and response behavior are not applicable to the present implementation.

## Findings

No findings. The guide is an applicable reference for a future implementation, but it does not define an obligation to create `proxy.ts`; creating a Proxy in this project without a concrete need would widen the request surface with no observed requirement.

## Conclusion

- Classification: Not applicable.
- Explanation: the project uses the App Router and the 16.4.2 documentation was read in full, but it has no Proxy/Middleware. The existing development rewrites are configured in `next.config.ts`; no divergence requiring a Proxy was identified. If this functionality is introduced in the future, it must follow the `proxy.ts` name, the single-file convention, the installed matcher semantics, and the explicit separation between optimistic redirect and real authorization.
