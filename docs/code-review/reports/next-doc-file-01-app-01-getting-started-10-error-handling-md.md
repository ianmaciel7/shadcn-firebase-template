# Relatório individual — `next-doc-file-01-app-01-getting-started-10-error-handling-md`

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-10-error-handling-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`
- Documentação associada: tratamento de erros esperado, limites `error.tsx`, `not-found.tsx` e `global-error.tsx`; API de erro instalada.
- Versão do Next.js: `16.4.2`
- Status: Concluído.

## Escopo

- Responsabilidade: ler integralmente e avaliar a aplicabilidade exclusiva do guia instalado de tratamento de erros.
- Arquivos consultados: documento principal; `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`; `src/app/error.tsx`; `src/app/not-found.tsx`; `.agents/rules/nextjs-route-files.md`; `CODING_STANDARDS.md`.
- Dependências analisadas: convenção App Router `error.tsx`, props de recuperação `retry`/`reset`, React Error Boundaries e tradução de interface.

## Code Review

O guia distingue erros esperados, que devem ser apresentados como estado explícito, de exceções inesperadas, que pertencem aos Error Boundaries. Isso é aplicável ao projeto: a persistência atual usa Firebase Web SDK, sem Server Functions ou Route Handlers próprios; os fluxos de formulário tratam falhas esperadas localmente. O guia de `error.tsx` é aplicável ao limite global de segmento em `src/app/error.tsx`.

Implementações corretas observadas:

- `src/app/error.tsx:1` declara a fronteira como Client Component, como exige o guia.
- O erro é registrado em um Effect dependente de `error` (`src/app/error.tsx:16-18`), sem expor sua mensagem ao usuário.
- O fallback usa conteúdo traduzido e mantém um controle de recuperação acessível (`src/app/error.tsx:21-28`).
- `src/app/not-found.tsx:5-17` oferece uma interface 404 própria e localizada. A ausência de `global-error.tsx` não é, por si só, uma violação: o arquivo é a opção documentada para substituir a UI quando o próprio root layout falha.
- A regra local confirma que `error.tsx` e `not-found.tsx` seguem seus contratos específicos e não estão sujeitos à política de rotas finas destinada a `page.tsx`, `layout.tsx` e `template.tsx`.

## Findings

### NEXTERR-001

- Identificador: `NEXTERR-001`
- Severidade: Baixa
- Categoria: Recuperação de erro / compatibilidade com Next.js
- Caminho e linha: `src/app/error.tsx:9-12,26-27`
- Evidência concreta: o fallback apresenta a ação traduzida `tryAgain`, mas chama a prop `reset`. A referência instalada explica que `reset()` limpa o estado de erro e renderiza novamente os filhos sem refazer o conteúdo; recomenda `retry()` na maioria dos casos. O Next.js 16.4.2 tornou `retry` estável na versão 16.3.0. Assim, uma falha transitória que depende de nova leitura pode continuar falhando quando o usuário escolhe “tentar novamente”.
- Referência à documentação: `node_modules/next/dist/docs/01-app/01-getting-started/10-error-handling.md`, seção “Nested error boundaries”, recomenda a recuperação pelo `retry()`; `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`, seções “retry”, “reset” e “Version History”, distingue refetch de rerender e registra a estabilidade do `retry` em 16.3.0.
- Impacto: o rótulo promete nova tentativa, mas a operação pode somente rerenderizar a árvore sem refazer a leitura que falhou.
- Correção recomendada: usar a prop `retry` para esta ação, ou alterar o texto e documentar uma razão específica para preferir `reset`.
- Teste sugerido: teste de integração/browser em que uma leitura falha uma vez e passa na tentativa seguinte; acionar o botão e verificar que o limite refaz a leitura e substitui o fallback pelo conteúdo.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: os limites de erro e a interface 404 seguem os contratos relevantes do guia instalado; há um descompasso localizado entre o rótulo “tentar novamente” e a semântica de `reset()` no Next.js 16.4.2. O achado é baixo e pode ser resolvido usando a prop estável `retry` ou ajustando a intenção da ação.
