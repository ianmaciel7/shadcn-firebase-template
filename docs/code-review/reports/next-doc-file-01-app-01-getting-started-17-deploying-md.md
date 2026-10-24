# Individual report — `next-doc-file-01-app-01-getting-started-17-deploying-md`

## Identification

- Full subagent name: `next-doc-file-01-app-01-getting-started-17-deploying-md`
- Type: `DOC_FILE`
- Primary path: `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`
- Associated documentation: Next.js install/build/start; self-hosting and static export only to assess applicability; architecture and local hosting policy.
- Next.js version: `16.4.2`
- Status: completed.

## Scope

- Responsibility: read the whole deployment guide, extract the hosting modes described, and verify which are applicable to the project and the installed configuration.
- Files consulted: primary document; `package.json`; `next.config.ts`; `firebase.json`; `src/i18n/request.ts`; `README.md`; `ARCHITECTURE.md`; `.github/workflows/ci.yml`; `docs/agents/nextjs.md`.
- Dependencies analyzed: Next.js `16.4.2`, the `next build`/`next start` scripts, request cookies via `next/headers`, Cache Components/Partial Prefetching configuration, and the Firebase Hosting configuration.

## Code Review

The guide describes four options with distinct support: a Node.js server and Docker support all Next.js features; static export is limited; adapters vary. The concrete instruction for Node deployment is to provide `build` and `start` scripts.

Pertinent and correct implementations:

- `package.json:10-12` defines `dev`, `build: next build`, and `start: next start`, satisfying the generic Node server contract described by the guide. The project's manager is pnpm, so the corresponding operational commands are `pnpm build` and `pnpm start`.
- `next.config.ts:16-17` enables Cache Components and Partial Prefetching. The future choice of hosting must support the features used, per the capability matrices in the guide itself and in the self-hosting/adapters topics.
- The guide does not require adopting Docker or a specific adapter. The repository contains no runtime Dockerfile for the application; the Dockerfile present in `.github/dependabot-mirror/playwright/` belongs to the test image update flow, not to deploying Next.js.
- `firebase.json:12-16` configures Firebase Hosting to serve `public/`, without a rewrite/proxy to `next start` or a Next.js adaptation. This is not a hosting integration of the Next.js application. The architecture confirms that no deployment integration has been selected (`ARCHITECTURE.md:178-179`).
- Static export was not configured. Besides not being a requirement of the guide, it must not be presumed compatible with the current application: `src/i18n/request.ts:1-8` awaits `cookies()` to choose the locale per request, and `next.config.ts` enables server/cache features. A migration to static export would require a separate analysis of the unsupported features.
- The template policy keeps CI provider-independent and only adds hosting/credentials after the derived project chooses the platform (`README.md:51-52`). This decision is consistent with the optional nature of the deployment options listed in the guide.

Issues found: no proven deviation. The absence of a platform and deployment workflow is intentional, not a failure against this guide. Guidance for Firebase App Hosting, Vercel, Bun, Cloudflare, or other platforms are alternatives of varying capability, not cumulative requirements.

## Findings

No findings. The project has the scripts required for a generic Node deployment, and does not incorrectly select a platform, Docker, or static export.

## Conclusion

- Classification: compliant.
- Explanation: the requirements applicable to a Node deployment are present. The other modalities are optional choices and the local configuration explicitly records that no platform has been chosen. Production compatibility with a specific provider remains unverified because there is no integration or selected deployment.
