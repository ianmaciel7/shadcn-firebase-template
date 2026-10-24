# Relatório individual — next-doc-file-01-app-01-getting-started-09-revalidating-md

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-09-revalidating-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`
- Documentação associada: APIs instaladas `cacheLife`, `cacheTag`, `revalidateTag`, `updateTag` e `revalidatePath`; arquitetura e padrões locais para Cache Components, Firebase e mutações.
- Versão do Next.js: `16.4.2`
- Status: Concluído

## Escopo

- Responsabilidade: ler integralmente o guia de revalidação e verificar sua aplicabilidade às configurações e implementações do projeto.
- Arquivos consultados: guia principal; `next.config.ts`; `src/` (busca por APIs de cache/revalidação); `ARCHITECTURE.md`; `CODING_STANDARDS.md`; `SECURITY.md`; `TESTING.md`.
- Dependências analisadas: Next.js 16.4.2 com Cache Components e Partial Prefetching; persistência de perfil via Firebase Web SDK.

## Code Review

### Implementações corretas

- O guia declara que trata do modelo Cache Components. O projeto habilita `cacheComponents: true` e `partialPrefetching: true` em `next.config.ts:16-17`, portanto o modelo documental corresponde à configuração instalada.
- O guia separa o uso de `cacheLife` para duração, `cacheTag` para rotular dados e `revalidateTag`/`updateTag`/`revalidatePath` para invalidação. Os padrões locais reforçam essa distinção em `CODING_STANDARDS.md:455-479`.
- O guia limita `updateTag` a Server Actions, enquanto `revalidateTag` também pode ser usado em Route Handlers. `CODING_STANDARDS.md:470-479` e `SECURITY.md:108-116` mantêm explícitos os requisitos da fronteira server-side e de autorização.
- O guia recomenda cachear dados independentes de dados de runtime. A arquitetura documenta a separação entre os caches de navegador Firebase, memoização React, cache Next.js e navegação, e registra que não há cache de perfil no servidor (`ARCHITECTURE.md:230-234`).

### Aplicabilidade e problemas

- A busca de APIs no código de `src/` não encontrou `cacheLife`, `cacheTag`, `revalidateTag`, `updateTag`, `revalidatePath`, `unstable_cache` ou a diretiva `use cache`.
- O projeto não possui atualmente camada server-side de persistência de perfil ou fluxo de mutação com Server Actions/Route Handlers. As escritas Firebase existentes continuam sob Firebase Web SDK e Security Rules, conforme `ARCHITECTURE.md:149-178` e `SECURITY.md:110-116`.
- Portanto, os exemplos de invalidação não são uma obrigação de implementar no fluxo atual e não foi comprovada divergência de código contra este guia. A página é referência aplicável a futuras superfícies de cache no servidor.

### Riscos e recomendações

- Se um cache server-side for introduzido, escolher explicitamente uma política de duração (`cacheLife`) e, apenas quando necessário, tags (`cacheTag`) e invalidação. A invalidação não substitui validação de entrada, autenticação ou autorização.
- Para testes futuros, exercitar o comportamento de leitura após mutação para cada política escolhida: stale-while-revalidate com `revalidateTag(tag, 'max')` ou leitura imediata após `updateTag` dentro de uma Server Action. Testes devem cobrir também autorização e isolamento entre usuários antes de cachear dados privados.

## Findings

Nenhum finding. O documento é compatível com a configuração instalada e os padrões locais; as APIs descritas não são usadas atualmente em `src/`.

## Conclusão

- Classificação: Não aplicável.
- Explicação: Cache Components está habilitado, mas o projeto não implementa cache server-side ou APIs de invalidação. O modelo e os limites descritos estão registrados nos padrões locais, e não há implementação existente a comparar. Os exemplos só passam a ser diretamente aplicáveis quando esse tipo de cache for adicionado.
