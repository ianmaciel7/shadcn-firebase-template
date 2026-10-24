# Review: Caching

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-08-caching-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md`
- Documentação associada: [Next.js Caching (installed)](../../../node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md); [Next.js request and cache standards](../../../CODING_STANDARDS.md#nextjs-request-data-and-caching); [architecture rendering and cache model](../../../ARCHITECTURE.md#nextjs-rendering-and-cache-model)
- Versão do Next.js: `16.4.2`
- Status: Concluído

## Escopo

- Responsabilidade: ler integralmente o documento Caching instalado e avaliar a aplicabilidade das suas orientações de Cache Components ao projeto.
- Arquivos consultados: o documento principal; `next.config.ts`; `src/app/layout.tsx`; `src/i18n/request.ts`; `CODING_STANDARDS.md`; `ARCHITECTURE.md`; `package.json` para confirmar a versão.
- Dependências analisadas: `cacheComponents`, `partialPrefetching`, `cookies()`, `Suspense`, `generateMetadata`, cache APIs e a fronteira de acesso a dados Firebase descrita pela arquitetura.

## Code Review

- Implementações corretas: `next.config.ts:16-17` ativa explicitamente `cacheComponents` e `partialPrefetching`, conforme os requisitos do documento (`08-caching.md:18-45`). A configuração coincide com o modelo documentado para a versão instalada.
- A única leitura de request API encontrada na busca do escopo (`cookies()`) está em `src/i18n/request.ts:6-12`; o `IntlProviderServer` que consome essa configuração é composto dentro da fronteira `<Suspense>` de `src/app/layout.tsx:48-69`. Isso está alinhado com a orientação de colocar dados de request e trabalho assíncrono não cacheado sob uma fronteira de streaming (`08-caching.md:103-205`).
- A busca por `use cache`, `cacheLife` e `cacheTag` em `src/` não encontrou uso de cache compartilhado no código da aplicação. Isso é coerente com `ARCHITECTURE.md:230-236`, que registra não haver cache de perfil no servidor, Server Action de persistência, Route Handler de dados nem cache handler customizado. Portanto, as recomendações sobre duração, tags, invalidação, armazenamento remoto e isolamento de dados permanecem orientação para trabalho futuro, não uma lacuna de implementação atual.
- Riscos: o documento descreve também cache privado/remoto, ISR e prefetch URL-específico; o projeto não configura essas opções. Sua adoção exigiria decisões próprias de autorização, frescor e armazenamento, conforme `CODING_STANDARDS.md:443-466` e `ARCHITECTURE.md:230-243`.
- Recomendações: ao introduzir dados compartilhados no servidor, definir `cacheLife` conforme a necessidade de frescor e `cacheTag` apenas quando houver invalidação deliberada. Manter cookies/headers fora de escopos compartilhados e passar somente valores mínimos resolvidos após autorização. Validar streaming e prerenderização em build/produção antes de alterar o layout.
- Observação de compatibilidade: o documento está dentro da documentação instalada `16.4.2` e descreve precisamente as duas flags ativas. Orientações de “Previous Model” não devem substituir o modelo Cache Components deste projeto.

## Findings

Nenhum finding comprovado contra as orientações de cache deste documento.

## Conclusão

**Conforme.** A configuração habilita o modelo exigido pela documentação instalada, e a leitura identificada de cookie fica na árvore assíncrona sob `Suspense`. O projeto não possui escopos próprios de cache compartilhado cuja duração ou invalidação possa ser revisada neste item; os tópicos não aplicáveis foram registrados como referências futuras, sem tratá-los como falhas.
