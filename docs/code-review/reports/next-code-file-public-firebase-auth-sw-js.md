# Individual review: `public/firebase-auth-sw.js`

## Identification

- Full subagent name: `next-code-file-public-firebase-auth-sw-js`
- Type: `CODE_FILE`
- Primary path: `public/firebase-auth-sw.js`
- Associated documentation: Next.js 16.4.2 `public` folder static-file convention and `ARCHITECTURE.md`
- Next.js version: `16.4.2`
- Status: Reviewed draft; repository tracking remains Pending until required validation.

## Scope

- Responsibility: firebase id-token bridge for next.js navigations as a distinct inventory item.
- Files consulted: `public/firebase-auth-sw.js`, with contextual reference to protected navigation and server authentication.
- Boundaries: source and related test inspection; no local runtime, emulator, browser, or package-specific checks were executed for this draft.

## Code Review

The Service Worker intercepts same-origin navigation/RSC requests and attaches a Firebase bearer token when authentication is available, otherwise deferring to the client guard. Its token helper forces refresh for every intercepted request.

## Findings

### FIREBASE-SW-001 — Unhandled forced token-refresh failures can interrupt navigation

- Identifier: `FIREBASE-SW-001`
- Severity: Medium
- Category: Navigation resilience / authentication bridge
- Location: `public/firebase-auth-sw.js:31-41,52-71`.
- Evidence: all same-origin navigations and requests bearing `RSC` call `getFreshIdToken`, which invokes `getIdToken(user, true)` on every intercepted request. The promise passed to `event.respondWith` has no rejection handler. A token refresh failure therefore rejects the response promise instead of completing the original fetch or providing a controlled response.
- Impact: transient Firebase Auth/network problems can fail page navigation or RSC streaming regardless of whether the requested route is public.
- Recommendation: define an explicit fail-closed vs. public-navigation fallback policy, handle token-refresh and initialization failures, avoid unnecessary forced refreshes, and preserve protected-route authorization server-side. Do not silently treat token-fetch failure as a successful authorization result.
- Suggested regression: under a Service Worker test harness, make `getIdToken` reject and assert deterministic public/protected navigation behavior without unhandled response rejection; verify repeated same-session navigations do not force redundant refresh.
- Verification boundary: static analysis only; browser/Service Worker behavior was not executed.

## Conclusion

- Classification: Partially compliant.
- Reason: Finding `FIREBASE-SW-001`: forced token refresh failure rejects the `respondWith` chain without a fallback response, potentially breaking navigations during transient Auth/network errors.
- Next step: run the prescribed repository validation commands before changing this manifest row from Pending to Completed.
