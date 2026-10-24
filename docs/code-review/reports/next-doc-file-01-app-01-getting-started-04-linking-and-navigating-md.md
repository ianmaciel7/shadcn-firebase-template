# Review: Linking and Navigating

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-04-linking-and-navigating-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- Documentação associada: `next/link`, `loading.tsx`, prefetching, streaming, App Router navigation hooks
- Versão do Next.js: `16.4.2`
- Status: Concluído

## Escopo

- Responsabilidade: leitura integral desta página instalada, avaliação da aplicabilidade ao projeto e comparação das orientações pertinentes com a navegação atual.
- Arquivos consultados: esta página; `src/app/_components/home-section-client.tsx`; `src/app/not-found.tsx`; `src/app/(protected)/profile/_components/profile-back-to-home-button.tsx`; `src/app/(protected)/_hooks/use-protected-gate-client.ts`; `src/app/(public)/_hooks/use-auth-navigation.ts`; `src/app/_hooks/use-auth-provider-client.ts`; `src/app/(protected)/profile/_hooks/use-profile-submit.ts`; os `loading.tsx` de `src/app/`, `src/app/(public)/` e `src/app/(protected)/`; `CODING_STANDARDS.md`; `docs/agents/nextjs.md`.
- Dependências analisadas: uso de `next/link`, `next/navigation`, `next-intl` navigation wrapper e comportamento de atualização do router. O projeto usa App Router, Cache Components e Partial Prefetching conforme seu registro de arquitetura.

## Code Review

- Implementações corretas: navegação declarativa interna usa `next/link` para home, perfil, autenticação e página not-found. A navegação programática usa `next/navigation` ou o wrapper `@/i18n/navigation`; `router.refresh()` é usado após atualizar o cookie de locale, para solicitar nova renderização que observe o cookie. Existem boundaries `loading.tsx` no root e nos grupos público e protegido, cobrindo o carregamento das respectivas árvores.
- Problemas encontrados: nenhum desvio comprovado em relação às orientações aplicáveis desta página.
- Riscos: a página documenta opções de otimização (`useLinkStatus`, controle de prefetch e History API) como ferramentas contextuais, não requisitos. Não há evidência nesta revisão de que a aplicação precise dessas opções; também não foram executados testes de navegação em navegador.
- Recomendações: preservar a distinção entre `router.refresh()` e invalidação de cache do servidor. Se rotas ou listas de links crescerem, medir prefetch e feedback de navegação antes de adotar as opções da página. Não copiar o exemplo de `replaceState` para troca de locale sem adaptar ao modelo local de cookie e internacionalização.

## Findings

Nenhum finding comprovado.

## Conclusão

**Conforme.** Os padrões de navegação usados no projeto correspondem à orientação instalada: `Link` para links internos, router do App Router para navegação programática e boundaries de carregamento presentes nos segmentos relevantes. Recursos opcionais citados no documento não são lacunas por si só. A análise foi estática; a resposta visual e o comportamento de prefetch sob rede lenta permanecem não verificados em navegador.
