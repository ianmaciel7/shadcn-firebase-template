# Review: Mutating Data

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-07-mutating-data-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- Documentação associada: [Mutating Data (Next.js 16.4.2)](../../../node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md)
- Versão do Next.js: `16.4.2`
- Status: Concluído

## Escopo

- Responsabilidade: ler integralmente o guia atribuído, identificar suas regras e exemplos, avaliar a aplicabilidade ao projeto e comparar as implementações pertinentes.
- Arquivos consultados: o documento principal; `src/app/(protected)/profile/_hooks/use-profile-submit.ts`; `src/app/(protected)/profile/_lib/data.ts`; `SECURITY.md`; `ARCHITECTURE.md`; `CODING_STANDARDS.md`; `firestore.rules`; `storage.rules`.
- Dependências analisadas: integração cliente Firebase Auth, Firestore e Storage usada para persistir perfil; não há Server Action ou Route Handler de mutação no código versionado em `src/`.

## Code Review

O guia define Server Functions como funções assíncronas invocáveis por requisição de rede e alerta que cada função precisa autenticar e autorizar a operação internamente. Também cobre invocação por formulários e handlers, estado pendente, atualização e invalidação de cache, redirecionamento e cookies.

Essas receitas são relevantes como orientação para uma futura fronteira de mutação no servidor, mas não são diretamente aplicáveis ao fluxo existente: `useProfileSubmit` chama `saveProfile` no cliente; a persistência usa os SDKs web do Firebase, com regras de propriedade do usuário. As regras locais de segurança explicitam que introduzir uma Server Function exige validar entradas e autenticar e autorizar no limite de acesso aos dados. Assim, o código não é considerado divergente por não adotar Server Actions ou APIs de cache deste guia.

O guia está compatível com Next.js 16.4.2. Recomendações de cache citadas na página devem ser lidas junto da configuração local com Cache Components e das instruções em `CODING_STANDARDS.md`, não como motivo para migrar o fluxo Firebase atual.

## Findings

Nenhum finding comprovado. A página foi avaliada quanto à aplicabilidade; a ausência de Server Functions/Actions e de Route Handlers de mutação foi confirmada na árvore `src/`. O guia reforça os controles já documentados localmente.

## Conclusão

**Conforme.** As orientações aplicáveis de segurança têm correspondência nas regras locais: Firebase Web SDK continua autorizado por Security Rules, e uma futura fronteira de servidor deverá introduzir autenticação, autorização e validação próprias. As demais receitas de mutação e revalidação são não aplicáveis ao fluxo atual, portanto sua ausência não constitui não conformidade.
