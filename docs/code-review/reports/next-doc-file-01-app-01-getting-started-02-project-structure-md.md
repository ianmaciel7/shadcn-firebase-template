# Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-02-project-structure-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- Documentação associada: Project structure and organization (documentação instalada)
- Versão do Next.js: `16.4.2`
- Status: concluído

## Escopo

Responsabilidade: interpretar exclusivamente a convenção de organização de projeto e compará-la com a estrutura do repositório. Foram consultados, apenas como evidência de aplicabilidade, `src/app/layout.tsx`, `src/app/page.tsx`, os layouts e páginas dos grupos `(protected)` e `(public)`, `next.config.ts`, `.gitignore` e a árvore de `src/app`.

Dependências analisadas: App Router do Next.js, grupos de rota, pastas privadas, os arquivos especiais de rota e a configuração de `src` descritos no documento principal.

## Code Review

### Implementações corretas

- O projeto usa o diretório opcional `src` e mantém `src/app` como raiz do App Router, enquanto configuração permanece no repositório raiz (`next.config.ts:1-52`), compatível com a seção **src folder**.
- `src/app/layout.tsx:40-73` fornece o layout raiz e `src/app/page.tsx:1-5` expõe a rota `/`, obedecendo às convenções de `layout` e `page`.
- Os diretórios `(protected)` e `(public)` são grupos de rota; seus layouts (`src/app/(protected)/layout.tsx:1-5`, `src/app/(public)/layout.tsx:1-11`) organizam a aplicação sem entrar na URL, exatamente como a seção **Route groups** prevê.
- Componentes, hooks e utilitários privados são colocados em `_components`, `_hooks` e `_lib` abaixo de segmentos de rota, por exemplo `src/app/(protected)/profile/_components/`, o que é compatível com a seção **Private folders** e evita a exposição acidental de módulos de implementação.
- Arquivos especiais de erro, carregamento e não encontrado estão na raiz de `app`: `error.tsx`, `loading.tsx` e `not-found.tsx`. O `error.tsx` declara a fronteira de cliente em `src/app/error.tsx:1`, coerente com a função do arquivo.
- `.gitignore:41-43` exclui `.env*` e permite somente `.env.example`, atendendo a recomendação documental de não versionar arquivos de ambiente reais.

### Problemas encontrados

Nenhum problema comprovado no escopo deste documento.

### Riscos

- A documentação descreve alternativas como Pages Router, rotas paralelas, interceptadas, `proxy.ts`, `instrumentation.ts` e múltiplos layouts raiz. Elas não são exigidas pelo App Router atual; adicioná-las sem necessidade seria expansão de escopo, não uma correção.
- Os grupos `(protected)` e `(public)` não constituem autorização por si próprios. A proteção observada no layout é um detalhe de implementação que deve continuar a ser auditado nos relatórios individuais correspondentes.

### Recomendações

- Preservar a separação atual: arquivos especiais de rota em `src/app`, detalhes da rota em pastas iniciadas por `_`, e recursos compartilhados fora dos segmentos quando houver reutilização real.
- Ao introduzir novas rotas, confirmar se o arquivo é um dos nomes especiais do Next.js e manter a rota pública limitada a um `page` ou `route` intencional.

## Findings

Não há findings comprovados para este item.

## Conclusão

**Conforme.** A estrutura real emprega o App Router sob `src/app`, layout raiz, arquivos especiais e a combinação documentada de route groups e private folders. Não foi encontrada divergência concreta entre este documento instalado do Next.js 16.4.2 e os caminhos consultados.
