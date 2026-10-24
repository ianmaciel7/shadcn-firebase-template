# Review: Mutating Data

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-07-mutating-data-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- Associated documentation: [Mutating Data (Next.js 16.4.2)](../../../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md)
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: read the assigned guide in full, identify its rules and examples, assess applicability to the project, and compare the pertinent implementations.
- Files consulted: the primary document; `src/app/(protected)/profile/_hooks/use-profile-submit.ts`; `src/app/(protected)/profile/_lib/data.ts`; `SECURITY.md`; `ARCHITECTURE.md`; `CODING_STANDARDS.md`; `firestore.rules`; `storage.rules`.
- Dependencies analyzed: the Firebase Auth, Firestore, and Storage client integration used to persist the profile; there is no mutation Server Action or Route Handler in the versioned code in `src/`.

## Code Review

The guide defines Server Functions as asynchronous functions invocable through a network request and warns that each function must authenticate and authorize the operation internally. It also covers invocation through forms and handlers, pending state, cache updating and invalidation, redirects, and cookies.

These recipes are relevant as guidance for a future server mutation boundary, but they are not directly applicable to the existing flow: `useProfileSubmit` calls `saveProfile` on the client; persistence uses the Firebase web SDKs, with user-ownership rules. The local security rules state explicitly that introducing a Server Function requires validating inputs and authenticating and authorizing at the data-access boundary. So the code is not considered divergent for not adopting this guide's Server Actions or cache APIs.

The guide is compatible with Next.js 16.4.2. The cache recommendations cited on the page must be read together with the local Cache Components configuration and the instructions in `CODING_STANDARDS.md`, not as a reason to migrate the current Firebase flow.

## Findings

No proven finding. The page was assessed for applicability; the absence of Server Functions/Actions and mutation Route Handlers was confirmed in the `src/` tree. The guide reinforces the controls already documented locally.

## Conclusion

**Compliant.** The applicable security guidance has a counterpart in the local rules: the Firebase Web SDK remains authorized by Security Rules, and a future server boundary must introduce its own authentication, authorization, and validation. The remaining mutation and revalidation recipes are not applicable to the current flow, so their absence is not non-compliance.
