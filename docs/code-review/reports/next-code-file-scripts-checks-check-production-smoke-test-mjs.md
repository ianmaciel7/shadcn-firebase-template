# Individual review: production smoke regression tests

- Identity: `next-code-file-scripts-checks-check-production-smoke-test-mjs`
- Primary file: `scripts/checks/check-production-smoke.test.mjs`
- Type: CODE_FILE
- Status: Completed static inspection

## Coverage

Node test cases reject loopback, private IPv4, IPv6 local, link-local,
mixed-address DNS answers, malformed HTTPS origins, credentials and ports.
Positive fixtures verify the pinned public address and all three server
HTML language declarations. Redirect, content type and incorrect language
responses are explicit negative regressions.

## Limits

Network and response fixtures are injected and do not contact production.
These tests verify the guard's behavior, not the identity or health of an
external deployment.
