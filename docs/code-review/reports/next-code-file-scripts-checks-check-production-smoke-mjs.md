# Individual review: production smoke security runner

- Identity: `next-code-file-scripts-checks-check-production-smoke-mjs`
- Primary file: `scripts/checks/check-production-smoke.mjs`
- Type: CODE_FILE
- Status: Completed static inspection

## Responsibilities

A manual CI job can validate a separately supplied HTTPS deployment origin.
The runner rejects credentials, ports, paths, queries, IP literals and local
domains. It resolves the hostname, rejects any private or special-use DNS
answer, and pins a verified public address for the HTTPS connection while
preserving the original TLS hostname. Redirects and unexpected HTML responses
fail closed. The first server HTML tag must declare each expected locale.

## Evidence limits

The source is backed by negative tests and CI, but no live production URL
or deployment credentials were supplied. This report is not a successful
production smoke result and does not claim an independent agent execution.
