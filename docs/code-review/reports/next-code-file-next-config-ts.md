# Code review: `next.config.ts`

## Identification

- Full subagent name: `next-code-file-next-config-ts`
- Type: `CODE_FILE`
- Primary path: `next.config.ts`
- Associated documentation: installed Next.js docs `cacheComponents.md`, `partialPrefetching.md`, `reactCompiler.md`, `rewrites.md`, `typescript.md`, and `turbopack.md` under `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/`.
- Next.js version: `16.4.2`
- Status: Completed

## Scope

- Responsibility: individual review of the Next.js configuration, including cache/rendering, prefetch, compiler, development rewrites, TypeScript, and the Turbopack CSS loader.
- Files consulted: `next.config.ts`, `package.json`, `tsconfig.build.json`, `src/app/globals.css`, `.agents/rules/nextjs-maintenance.md`, `ARCHITECTURE.md`, and `SECURITY.md`.
- Dependencies analyzed: Next.js 16.4.2, `next-intl`, `babel-plugin-react-compiler`, `@tailwindcss/turbopack`, and TypeScript.

## Code Review

### Correct implementations

- `cacheComponents: true` and `partialPrefetching: true` are both set (`next.config.ts:16-17`). The installed documentation requires Partial Prefetching to be explicit with Cache Components and says it must be enabled with that option.
- `reactCompiler: true` uses the stable top-level Next.js option (`next.config.ts:18`); the matching `babel-plugin-react-compiler` is present in `package.json` devDependencies.
- The emulator rewrites are returned only in development and only when the emulator host is configured (`next.config.ts:19-22`). They map three specific Firebase Auth endpoints to the configured emulator (`next.config.ts:24-37`); this is narrower than a catch-all rewrite. The host is read from process environment and is not supplied by a request parameter.
- `typescript.tsconfigPath` selects `tsconfig.build.json` (`next.config.ts:39-41`), which exists, extends the project `tsconfig.json`, and excludes dependencies and the Semgrep fixture directory. The config does not set `ignoreBuildErrors`.
- Turbopack's `*.css` rule is explicit and targets CSS output (`next.config.ts:42-48`). The project has `@tailwindcss/turbopack` installed and its global stylesheet imports Tailwind (`src/app/globals.css:1`).
- The typed config is wrapped with the `next-intl` plugin (`next.config.ts:1-4,52`), consistent with the project's documented internationalization architecture.

### Issues found

- No incompatibility with the installed documentation was established in this file.

### Risks and verification limits

- The review confirmed the configuration and declared dependencies; it did not run `next dev`, `next build`, nor runtime checks for the rewrites or Tailwind loader.
- `FIREBASE_AUTH_EMULATOR_HOST` is trusted developer configuration. If future code exposes it to user-controlled input, the development-only condition alone would not be an adequate validation boundary; no such request-controlled path exists in this file.

## Findings

No findings.

## Conclusion

- Classification: Compliant.
- Explanation: the configuration matches the installed 16.4.2 contracts for Cache Components with Partial Prefetching, React Compiler, rewrites, custom TypeScript config, and Turbopack rules. The emulator proxy is gated to development and a configured host. Runtime behavior was not verified, so this conclusion is limited to static configuration compatibility.
