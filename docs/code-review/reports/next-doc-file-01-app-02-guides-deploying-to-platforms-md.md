# Individual installed Next.js documentation review — `deploying-to-platforms.md`

## Identification

- Review identity: `next-doc-file-01-app-02-guides-deploying-to-platforms-md`
- Item type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/02-guides/deploying-to-platforms.md`
- Official source: [Next.js version 16.4.2](https://github.com/vercel/next.js/blob/2864b1772c37242a9b40ab4d366eb7d368c2a070/docs/01-app/02-guides/deploying-to-platforms.mdx)
- Application source checkpoint: `4c68c612b63ed4e28a1a90aa9840c0e22f9021e7`
- Status: Completed direct source inspection; CI pending

## Observed source guidance

The official guide covers **next.js deployment portability**.

- Defines minimum platform requirements and distinguishes functional from performance parity.
- Provides an adapter feature matrix and infrastructure caveats.

## Repository applicability

The repository has Firebase and GCP-related dependencies, but production deployment verification is separate.

## Findings and verification limits

A platform claiming basic support does not establish Cache Components or streaming performance fidelity.
No independent reviewer subagent was invoked. This source-focused
review does not replace browser, emulator, build or deployed
verification, and it does not count descendant paths as inspected.

## Disposition

One distinct documentation source was inspected at a pinned
framework revision; its relevance and limits are recorded.
