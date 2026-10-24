# Review: `src/app/`

## Identificação

- **Subagente:** `next-code-folder-src-app`
- **Tipo:** `CODE_FOLDER`
- **Caminho principal:** `src/app/`
- **Documentação associada:** installed Next.js 16.4.2: `node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`, `03-layouts-and-pages.md`, and `05-server-and-client-components.md`; project owners `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.agents/rules/nextjs-route-files.md`, `.agents/rules/components-contracts.md`
- **Versão Next.js:** 16.4.2
- **Status:** Concluído

## Escopo

Responsabilidade principal: organização, responsabilidades e dependências da árvore `src/app/`, incluindo agrupamento de rotas, colocação de código privado, composição dos layouts e limites de client/server. A árvore contém 71 arquivos em 20 subpastas, além da raiz. Os arquivos foram consultados somente para compreender a estrutura e as relações; cada arquivo continua sendo responsabilidade exclusiva do agente listado para ele no manifesto.

Fontes consultadas: listagem recursiva de `src/app/`; documentação instalada citada acima; `ARCHITECTURE.md`; `CODING_STANDARDS.md`; `.agents/rules/nextjs-maintenance.md`; `.agents/rules/nextjs-route-files.md`; `.agents/rules/components-contracts.md`; `.dependency-cruiser.cjs`; consulta ao grafo existente com `graphify query`.

## Code Review

- A árvore usa o App Router em `src/app/`, mantém `page`, `layout`, `loading`, `error` e outros arquivos especiais junto às rotas, e coloca implementações internas em diretórios `_components`, `_hooks` e `_lib`. Grupos `(public)` e `(protected)` expressam áreas de navegação sem adicionar segmentos à URL, em linha com a documentação instalada de estrutura de projeto e route groups.
- As dependências observadas seguem composição de fora para dentro: páginas importam componentes privados da rota; layouts importam seus providers/gates; módulos privados consomem `src/components`, `src/lib`, `src/i18n` e hooks necessários. `src/components` e `src/lib` não precisam importar a árvore de rotas para atender esse fluxo.
- A composição dos segmentos público e protegido é localizada: cada grupo mantém seu `layout.tsx` e `loading.tsx`; os fluxos específicos têm seus próprios diretórios de rota. Isso evita concentrar autenticação de telas distintas em um único módulo de rotas.
- Os limites de runtime são distribuídos entre layouts Server Components e implementações de interação em componentes/hooks de cliente. A convenção local documenta que nome/pasta não provam o runtime; o Next.js valida o grafo completo de imports.
- Há regras executáveis que proíbem ciclos (`no-circular`) e imports de `src/components` para `src/app`, além de uma regra de limites para `src/lib`, em `.dependency-cruiser.cjs:4-25`. A inspeção de configuração confirma que esses riscos são cobertos por ferramenta, mas esta revisão não executou a análise do grafo, portanto não declara ausência efetiva de ciclos.
- A consulta Graphify encontrou nós associados às rotas, módulos privados, componentes compartilhados e configuração de dependências; a busca transversal retornou resultados truncados. Ela foi usada como mapa auxiliar, não como prova de ausência de ciclos ou dependências.

### Findings

Nenhum problema arquitetural da pasta foi comprovado. Os achados de implementação pertencentes a arquivos individuais devem permanecer nos respectivos relatórios e ser deduplicados pelo coordenador.

## Conclusão

**Conforme.** A organização observada é coerente com o App Router instalado e com as convenções documentadas do repositório: grupos para áreas de rota, pastas privadas para implementação, layouts/loading locais e direção de dependências protegida por regras executáveis. A ausência de ciclos em execução permanece **não verificada** nesta tarefa; a existência da regra não foi tratada como resultado de uma execução.
