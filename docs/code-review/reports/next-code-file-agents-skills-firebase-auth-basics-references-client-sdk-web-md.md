# Individual Firebase skill review — `next-code-file-agents-skills-firebase-auth-basics-references-client-sdk-web-md`

## Identification

- **Assigned reviewer identity:** `next-code-file-agents-skills-firebase-auth-basics-references-client-sdk-web-md`
- **Primary source:** `.agents/skills/firebase-auth-basics/references/client_sdk_web.md`
- **Item type:** CODE_FILE
- **Source revision:** `203d55d4752758ade11d7105ef6fe19f1dadf914`
- **Framework baseline:** Next.js 16.4.2
- **Status:** Completed following verified report CI.

## Source evidence

Covers Firebase Auth Web SDK initialization, local emulator attachment, credential and provider flows, auth state subscriptions and sign-out.

## Findings and scope

Examples are generic and include browser globals; the Next.js app must preserve its existing browser-only Firebase initialization boundary rather than copying browser access into server code.

This document is an upstream skill or reference. It cannot be used as proof that a separate operating system, Firebase project or identity provider was tested.

## Verification

The source and reference relationships were inspected in the current tracked tree. The branch checks passed in [GitHub Actions run 40235002079](https://github.com/ianmaciel7/shadcn-firebase-template/actions/runs/40235002079), including inventory, Biome, TypeScript, regressions, English, spelling and Markdown.

## Disposition

Individual source review is recorded; unrelated skill references keep their own pending identities.
