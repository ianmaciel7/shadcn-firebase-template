# Relatório individual — `next-code-file-src-components-ai-elements-controls-tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ai-elements-controls-tsx`.
- Tipo: `CODE_FILE`.
- Caminho principal: `src/components/ai-elements/controls.tsx`.
- Documentação associada: Next.js instalado, `01-app/01-getting-started/05-server-and-client-components.md` e `01-app/03-api-reference/01-directives/use-client.md`; tipos e implementação instalados do React Flow.
- Versão do Next.js: `16.4.2`, confirmada em `node_modules/next/package.json`.
- Status: Concluído.

## Escopo

- Responsabilidade: revisão individual integral das 20 linhas do adaptador Controls, incluindo composição, contrato de props, classes, acessibilidade e fronteira Server/Client.
- Arquivos consultados: arquivo principal; `AGENTS.md`; `docs/code-review/README.md`; `docs/code-review/agents-manifest.md`; relatório de `canvas.tsx` como referência de formato; `CODING_STANDARDS.md`; `.agents/rules/components-contracts.md`; `.agents/rules/shadcn-ui-maintenance.md`; `.agents/skills/shadcn/SKILL.md`; `src/lib/utils.ts`; os dois guias instalados Next.js acima; `node_modules/@xyflow/react/package.json`, `dist/esm/index.js`, `dist/esm/index.mjs`, `dist/esm/additional-components/Controls/types.d.ts` e `dist/style.css`.
- Dependências analisadas: `@xyflow/react@12.12.0`, React e `cn`. Nenhuma primitiva shadcn/Base UI é usada neste arquivo, portanto nenhuma alteração ou recomendação de API dessa família foi necessária.
- Pesquisa de consumidores: busca em `src/` por `Controls` e `ai-elements/controls`, excluindo o arquivo principal, não encontrou consumidor atual.

## Code Review

Implementações corretas:

- A diretiva `"use client"` está antes dos imports (linha 1). O componente delegado utiliza store, hooks e eventos do React Flow; a fronteira é compatível com o guia Next.js instalado. Os dois entrypoints ESM instalados do React Flow também declaram `"use client"`.
- O módulo mantém uma responsabilidade pequena: adaptar a aparência de `ControlsPrimitive`, sem reimplementar zoom, enquadramento, bloqueio, estado ou tratamento de eventos.
- `ComponentProps<typeof ControlsPrimitive>` (linha 7) herda o contrato real da dependência. O spread na linha 16 preserva opções de posição, orientação, callbacks, visibilidade, estilo, nome acessível do painel e `children`, enquanto `className` é composto com `cn` (linhas 9–15).
- A implementação instalada em `dist/esm/index.mjs:4587-4630` gera botões nativos com `type="button"`, nomes acessíveis e títulos a partir de `ariaLabelConfig`; os botões de zoom recebem `disabled` nos limites. O wrapper não substitui esses elementos nem remove suas props de acessibilidade.
- As classes das linhas 12–13 usam tokens semânticos e não aplicam `outline-none`, `tabIndex`, ocultação ou dimensões menores que as da dependência. O CSS instalado fornece botões de 26 por 26 pixels; a inspeção não prova as dimensões computadas numa página concreta.
- Não há recurso assíncrono próprio, Effect, assinatura, segredo, HTML injetado, persistência ou API server-only para analisar neste módulo. O utilitário importado apenas reexporta `cn`.
- A declaração por arrow function e a ausência de sufixo `-client` não foram tratadas como defeitos: a árvore AI Elements tem exclusão explícita no contrato local de naming. A diretiva e o grafo importado definem a fronteira, independentemente do nome do arquivo.

Riscos e recomendações:

- A dependência consulta o store React Flow. O adaptador deve ser composto dentro do contexto apropriado, normalmente como filho de `ReactFlow`, conforme o exemplo na própria implementação instalada. Não criar outro provider isolado somente para satisfazer o hook, pois isso desconectaria os controles do editor. Sem consumidor atual, não há evidência de uso fora de contexto.
- Callbacks não serializáveis precisam ser preparados numa composição cliente ao atravessar uma fronteira Server/Client. O tipo herdado permitir callbacks é normal e não demonstra violação sem um consumidor Server Component.
- O editor consumidor precisa carregar o CSS da dependência e validar foco, contraste, tamanho real, toque e orientação horizontal/vertical. A importação desse CSS existe no adaptador `canvas.tsx`, revisado separadamente; este relatório não assume que todas as composições futuras utilizarão esse adaptador.
- Localização dos botões depende do `ariaLabelConfig` do editor, além do `aria-label` encaminhado ao painel. A falta de tradução neste adaptador genérico não prova uma falha numa página localizada sem consumidor demonstrado.
- Dados, cache, metadata, rotas e mutações de servidor são não aplicáveis a este módulo de apresentação. Não foram executados build, browser, teclado, leitor de tela ou testes de integração; nenhuma consulta remota/CLI foi necessária para a API React Flow inspecionada localmente.

## Findings

Nenhum finding acionável demonstrado. Contexto, CSS e validação de acessibilidade integrada são requisitos do uso da dependência; não foram convertidos em bugs hipotéticos do wrapper.

## Conclusão

- Classificação: Conforme.
- Explicação: o adaptador preserva o contrato e a composição da dependência instalada, mantém a fronteira cliente e não introduz defeito concreto na revisão estática integral. A conclusão não certifica a acessibilidade nem a operação de um editor integrado, pois não há consumidor atual identificado e não houve execução em navegador. Somente este relatório individual foi criado.
