# ADR 0010: Use redirect OAuth in Electron

- **Status**: Accepted
- **Date**: 2026-10-22
- **Deciders**: ianmaciel7

## Context

FirebaseUI v7 uses its popup provider strategy by default. Its Auth Emulator
popup callback relays its result to the opener window. Embedded Electron
browsers can fail to preserve that opener relationship, leaving the callback
without a matching frame even though Firebase Auth, the emulator endpoint, and
the application's shared auth-state listener are configured correctly.

The existing browser suite verifies the popup flow in Chromium. The application
must preserve that standard-browser behavior while allowing the same Google
button and shared FirebaseUI store to complete an OAuth flow in Electron.

## Decision

Configure the existing FirebaseUI initialization with `providerPopupStrategy()`
by default and `providerRedirectStrategy()` only when the browser user agent
contains `Electron/`. Both are supported FirebaseUI v7 behaviors and apply to
all enabled external providers. Redirect completion remains in FirebaseUI's
existing `getRedirectResult` lifecycle, then the existing `onAuthStateChanged`
listeners recover authenticated UI state and perform their fixed safe-route
redirect.

Do not add a custom OAuth callback, popup bridge, provider-specific client, or
second Firebase Auth instance. Keep each explicitly configured emulator endpoint
and port unchanged. Matching loopback hostnames alone is insufficient because the
app and emulator normally use different ports. For Electron in development, route
the Auth Emulator handler and required Auth REST endpoints through the app origin,
while preserving the configured emulator endpoint as the proxy target.

## Consequences

Ordinary browsers retain popup OAuth. Electron browsers use a full-page
redirect, so they do not rely on an opener relay or cross-origin iframe storage.
The redirect strategy can be verified with a Chromium context that presents an
Electron user agent, but a real embedded Electron runtime remains a manual
compatibility check.

This supersedes only ADR 0009's Google popup-sign-in behavior for Electron;
all other Firebase Auth initialization, emulator, route, and authorization
boundaries remain unchanged.
