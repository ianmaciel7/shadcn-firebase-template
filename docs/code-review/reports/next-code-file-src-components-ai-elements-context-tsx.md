# Relatório individual — `next-code-file-src-components-ai-elements-context-tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ai-elements-context-tsx`.
- Tipo: `CODE_FILE`.
- Caminho principal: `src/components/ai-elements/context.tsx`.
- Documentação associada: Next.js instalado, `01-app/01-getting-started/05-server-and-client-components.md`; contratos instalados do AI SDK, Tokenlens e Base UI Progress/Preview Card.
- Versão do Next.js: `16.4.2`, confirmada em `node_modules/next/package.json`.
- Status: Concluído.

## Escopo

- Responsabilidade: revisão integral das 429 linhas do módulo, incluindo contexto compartilhado, percentual, custo, partes de apresentação, props e acessibilidade.
- Arquivos consultados: arquivo principal; `AGENTS.md`; `docs/code-review/README.md`; `docs/code-review/agents-manifest.md`; relatório existente de `agent.tsx`; `CODING_STANDARDS.md`; `.agents/rules/components-contracts.md`; `.agents/rules/react-hooks-core.md`; `.agents/rules/shadcn-ui-maintenance.md`; `.agents/skills/shadcn/SKILL.md`; `.agents/skills/shadcn/rules/base-vs-radix.md`; `components.json`; `src/components/ui/{button,hover-card,progress}.tsx`; o guia Next.js acima; `node_modules/ai/dist/index.d.ts`; `node_modules/tokenlens/{package.json,dist/context.js,dist/context.d.ts}`; `node_modules/.pnpm/@tokenlens+helpers@1.3.1/node_modules/@tokenlens/helpers/dist/context.js`; e implementações/tipos instalados de Base UI Preview Card Trigger e Progress Root/Label.
- Dependências analisadas: React Context e `useMemo`, AI SDK `LanguageModelUsage`, `tokenlens@1.3.1`, Base UI e componentes locais.
- Consumidores: busca por `ai-elements/context` e `ContextTrigger` em `src/`, fora do próprio arquivo, não encontrou uso atual.
- Método: leitura estática integral, execução isolada de `getUsage` instalado e renderização SSR isolada de Progress Base UI. Não foram executados browser, leitor de tela, testes da aplicação ou build. Não houve consulta remota ou CLI shadcn; contratos foram verificados nas dependências instaladas, sem alegação de validação remota.

## Code Review

Implementações corretas:

- `"use client"` na linha 1 estabelece a fronteira adequada para Context, hooks e primitivas interativas. Não há imports server-only, credenciais, chamadas remotas ou persistência. A documentação Next.js instalada permite contexto em Client Components e não exige os sufixos locais de componentes próprios neste código de registro.
- O provider compartilha um valor derivado com dependências completas de `useMemo` (linhas 52–55); o hook lança uma mensagem clara fora do provider (linhas 33–40). Não há estado espelhado, Effects ou recursos próprios que exijam cleanup.
- As partes de conteúdo encaminham props HTML e combinam `className`. `children` permite substituir apresentações padrão. As verificações de `usage` ausente e os detalhes de tokens correspondem à forma instalada de `LanguageModelUsage`, cujos objetos de detalhes são obrigatórios mesmo quando valores individuais são indefinidos.
- A divisão por `maxTokens` é reutilizada de forma consistente nas três apresentações. O cálculo de custos é delegado ao pacote instalado; o problema confirmado é a adaptação incompleta dos detalhes de cache, descrita abaixo.
- `HoverCardTrigger` local usa Preview Card Trigger, cujo elemento padrão instalado é uma âncora, não um botão. Portanto, não se atribuiu automaticamente a este arquivo o finding de dois botões nativos aninhados encontrado em outro componente. A escolha de um único elemento composto com `render` ainda merece verificação de integração.

Riscos e recomendações:

- `maxTokens` aceita qualquer número e não há normalização de zero, negativos ou valores não finitos (linhas 67, 109 e 146). Com zero, o texto pode mostrar `NaN%`/infinito e o SVG recebe valor não finito; o Progress instalado trata valores não finitos como indeterminados. Sem contrato explícito de limite desconhecido nem consumidor demonstrado, isso fica registrado como requisito de validação da entrada, sem finding de falha atual.
- Valores desconhecidos de custo são formatados como `$0.00`, por `?? 0`; convém distinguir estimativa indisponível de custo gratuito. Preços e precisão de centavos são estimativas do catálogo instalado, não comprovação de cobrança real.
- Textos e formatação padrão usam inglês/`en-US`. A integração localizada precisa fornecer conteúdo adequado; ausência de uso atual impede apontar uma tela traduzida incorretamente. `space-y-*` é divergência estilística, não erro funcional ou exigência Next.js.
- As props de Button de `ContextTrigger` só alcançam o botão padrão quando `children` não é fornecido. Consumidores que substituírem o trigger precisam preservar foco, nome, semântica e handlers na composição escolhida.
- Navegação, cache de dados Next.js, Server Actions, Route Handlers e metadata não se aplicam a este módulo de apresentação.

## Findings

### CONTEXT-001 — Custo total ignora a precificação dos tokens em cache

- Identificador: `CONTEXT-001`.
- Severidade: Baixa.
- Categoria: correção de dados / adaptação de contrato de uso.
- Caminho e linha: `src/components/ai-elements/context.tsx:197-204`, `:255-270` e `:375-390`.
- Evidência concreta: Footer e Input passam `usage.inputTokens` inteiro como `input`, sem mapear `inputTokenDetails.cacheReadTokens` ou `cacheWriteTokens`. O SDK instalado define `inputTokens` como total de entrada e distingue entrada sem cache, leituras e escritas nas linhas 343–368 de `ai/dist/index.d.ts`. O Tokenlens calcula entrada e cache separadamente (`@tokenlens/helpers/dist/context.js:278-324`). A própria parte Cache já calcula leituras à parte. Executando `getUsage` instalado para `gpt-4o`, `{input:1000000,output:0}` retorna `totalUSD:2.5`, enquanto `{input:0,output:0,cacheReads:1000000}` retorna `totalUSD:1.25`. Portanto, um uso válido de um milhão de tokens totalmente em cache mostra total/entrada de `$2.50` e cache de `$1.25`, embora a estimativa compatível com essa distribuição seja `$1.25`.
- Referência à documentação: contratos instalados acima e `tokenlens/dist/context.js:127-135`, que encaminha o uso ao helper. Next.js `05-server-and-client-components.md` confirma o contexto cliente apropriado; o finding pertence à adaptação AI SDK/Tokenlens, não a uma regra de cache Next.js.
- Impacto: estimativa de custo incorreta quando há tokens de cache, com inconsistência entre total e detalhamento. Não foi encontrado consumidor atual nem demonstrado efeito em cobrança real.
- Correção recomendada: construir uma única adaptação da distribuição de tokens para os campos suportados de Tokenlens; usar entrada sem cache e passar leituras/escritas de cache explicitamente, preservando a semântica do provedor. Derivar total e linhas do mesmo resultado para evitar dupla contagem. Não somar tokens de raciocínio novamente quando já integram saída faturável.
- Teste sugerido: cobrir entrada sem cache, totalmente em cache, mista e com escrita de cache, usando catálogo fixo e expectativas de total/detalhes; confirmar que total não cobra uma leitura à tarifa de entrada comum.

### CONTEXT-002 — Progress padrão não recebe nome acessível

- Identificador: `CONTEXT-002`.
- Severidade: Baixa.
- Categoria: acessibilidade / nome de controle.
- Caminho e linha: `src/components/ai-elements/context.tsx:162-169`.
- Evidência concreta: a parte padrão renderiza `<Progress ... value={...} />` sem `aria-label`, `aria-labelledby` ou `ProgressLabel`. Os parágrafos vizinhos não são associados à barra. O Progress local encaminha essas props, mas não cria um nome; Base UI Root inicia `labelId` indefinido e emite `role="progressbar"`, enquanto sua parte Label registra o ID. Renderização SSR isolada da mesma topologia com a primitiva instalada produziu `role="progressbar" aria-valuenow="25" aria-valuetext="25%"`, sem atributo de nome. A primitiva não corrige automaticamente essa omissão após montagem porque nenhuma parte Label existe na composição.
- Referência à documentação: contrato instalado de `@base-ui/react/progress/label/ProgressLabel.js`, que descreve Label como rótulo acessível e registra seu ID, e `progress/root/ProgressRoot.js`, que usa esse ID em `aria-labelledby`. O guia Next.js de Server/Client Components não dispensa semântica acessível no HTML pré-renderizado ou interativo.
- Impacto: tecnologias assistivas recebem um valor percentual sem nome que identifique o uso de contexto. O `aria-label` do SVG de outra parte não rotula esta barra. Nenhum consumidor atual foi encontrado.
- Correção recomendada: fornecer um nome acessível à barra padrão, por Label/ID associado ou `aria-label`, com opção de localização; preservar o nome em composições personalizadas.
- Teste sugerido: renderizar `ContextContentHeader` padrão e consultar a barra por papel e nome de uso de contexto; validar valor e associação de ID após montagem, incluindo múltiplas instâncias.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: fronteira cliente, responsabilidades e contexto são adequados. Há adaptação incompleta da precificação de cache e uma barra padrão sem nome acessível.
- Limites: os experimentos usam dependências reais, mas são isolados; não equivalem a renderizar o componente TSX completo em browser ou validar acessibilidade integrada. Apenas este relatório individual foi escrito; nenhum código-fonte foi alterado.
