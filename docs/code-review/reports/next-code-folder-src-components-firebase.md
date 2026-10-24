# Folder review: `src/components/firebase/`

## Identificação

- Nome completo do subagente: `next-code-folder-src-components-firebase`
- Tipo: `CODE_FOLDER`
- Caminho principal: `src/components/firebase/`
- Documentação associada: [Architecture](../../../ARCHITECTURE.md), [component contracts](../../../.agents/rules/components-contracts.md), [ADR 0008](../../../docs/adr/0008-install-firebase-ui-registry.md), [ADR 0009](../../../docs/adr/0009-integrate-firebase-authentication.md), and the installed Next.js 16.4.2 Server/Client Component and project-structure guides.
- Versão do Next.js: `16.4.2`
- Status: Concluído.

## Escopo

- Responsabilidade: avaliar exclusivamente a organização, responsabilidades, dependências e runtime boundaries da pasta como unidade arquitetural; não substitui a revisão individual dos arquivos.
- Arquivos consultados: all 30 `.tsx` files under `src/components/firebase/` for names, directives, imports, and relationships; `src/app/(public)/sign-in/_components/sign-in-auth-flow-client.tsx`; `src/app/(public)/register/_components/register-auth-flow-client.tsx`; `src/app/(public)/forgot-password/_components/forgot-password-auth-flow-client.tsx`; `src/app/(public)/routes.test.tsx`; `package.json`; `tsconfig.build.json`; `ARCHITECTURE.md`; `.agents/rules/components-contracts.md`; `docs/adr/0008-install-firebase-ui-registry.md`; and `docs/adr/0009-integrate-firebase-authentication.md`.
- Dependências analisadas: `@firebase-oss/ui-core`, `@firebase-oss/ui-react`, Firebase Web Auth SDK, local `src/components/ui/` primitives, and route-private auth flow components.

## Code Review

### Organização e responsabilidades

The directory contains 30 registry-derived Firebase UI components. Its flat placement matches the explicit Firebase registry grouping decision in ADR 0008. Within that group, the modules are organized by auth responsibility: provider-specific buttons share `oauth-button.tsx`; sign-in, sign-up, email-link, phone, and password recovery each separate forms and screens; multi-factor assertion and enrollment separate their screen/form layers and SMS/TOTP implementations. Shared policy links and redirect error presentation are isolated in their own modules.

The application imports Firebase screens and the Google provider button from the public auth route flows. Those route-owned flow components keep navigation composition outside this registry folder. This gives the folder a coherent presentation/integration scope and avoids making its primitives depend on `src/app/`.

### Boundaries and dependencies

All 30 modules declare a client boundary except `policies.tsx`. That helper uses React context and Firebase UI hooks and is imported by client-side Firebase forms; its directive-free module can participate in the importing Client Component graph and is not evidence of a server-safe module. The reviewed imports flow from Firebase UI components to the shared `ui/` primitives and Firebase UI/Web SDK packages. No import from the Firebase directory back into `src/app/` was found in the inspected application references.

ADR 0008's current amendment treats copied registry modules as project source and includes the directory in application typechecking, while explicitly excluding the registry tree from broad formatting, lint, spelling, and coverage jobs. The route and auth-emulator suites provide workflow-level coverage, but the directory has no colocated per-component tests; unused or optional provider flows therefore receive less direct behavioral coverage. This is a known tradeoff in the accepted registry policy, not a demonstrated folder-contract violation.

The folder-level graph was not independently executed through the dependency-cruiser check in this review. The repository documents a cycle rule in `.dependency-cruiser.cjs`; this report does not claim a runtime validation of that rule or prove the absence of all cycles.

### Findings

#### FIREBASE-FOLDER-001

- Identificador: `FIREBASE-FOLDER-001`
- Severidade: Baixa
- Categoria: Documentação / propriedade da fonte
- Caminho e linha: `.agents/rules/components-contracts.md:14-18`; compared with `docs/adr/0008-install-firebase-ui-registry.md:477-485` and `ARCHITECTURE.md:135-137`.
- Evidência concreta: the component-contract rule describes the Firebase registry directory as “vendor-owned”. The accepted ADR amendment explicitly supersedes the immutable upstream model and says the copied registry files are project source that may be adapted; Architecture likewise calls them locally owned shadcn source. The rule's wording can be read as ownership by the upstream vendor, despite its intended exception being about registry origin and excluded naming checks.
- Impacto: contributors may mistakenly treat the copied source as immutable, or misread the convention exclusion as conflicting with the current local source-ownership decision.
- Correção recomendada: describe the directory as “registry-originated source” and state separately that generated registry trees are excluded from the owned-component naming checks, while remaining locally owned and reviewable as source.
- Teste sugerido: run the repository Markdown/link check after aligning the wording; verify that the rule and ADR continue to express the same ownership model.

No other folder-level architecture finding was proven in this scoped review.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: the folder's placement, internal grouping, reuse of shared primitives, and direction of composition align with the current architecture and Firebase UI decisions. A low-severity documentation wording conflict remains about ownership of registry-originated files. Cycle absence and per-component behavior are not established by this folder review; each source file still requires its own report.
