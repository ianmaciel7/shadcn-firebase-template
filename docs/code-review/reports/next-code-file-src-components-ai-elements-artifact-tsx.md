# Relatório individual — `next-code-file-src-components-ai-elements-artifact-tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ai-elements-artifact-tsx`.
- Tipo: `CODE_FILE`.
- Caminho principal: `src/components/ai-elements/artifact.tsx`.
- Documentação associada: Next.js instalado, `01-app/01-getting-started/05-server-and-client-components.md` e `01-app/03-api-reference/01-directives/use-client.md`; contrato Base UI instalado e regra local de composição de triggers.
- Versão do Next.js: `16.4.2`, confirmada pelo `next/package.json` instalado.
- Status: Concluído.

## Escopo

- Responsabilidade: revisão integral das 158 linhas do arquivo principal, incluindo os oito componentes e seus tipos exportados.
- Arquivos consultados: `AGENTS.md`, `docs/code-review/README.md`, `docs/code-review/agents-manifest.md`, `docs/code-review/reports/next-code-file-src-components-ai-elements-agent-tsx.md`, `components.json`, `package.json`, `CODING_STANDARDS.md`, `.agents/rules/components-contracts.md`, `.agents/rules/shadcn-ui-maintenance.md`, `.agents/rules/react-hooks-core.md`, `.agents/skills/shadcn/rules/base-vs-radix.md`, `src/components/ui/button.tsx`, `src/components/ui/tooltip.tsx`, `src/lib/utils.ts`, os dois guias Next.js acima e os módulos instalados `@base-ui/react/tooltip/trigger/TooltipTrigger.{js,d.ts}` e `@base-ui/react/button/Button.js`.
- Dependências analisadas: React, tipos HTML, Lucide, Button e Tooltip locais, primitivas Base UI e o utilitário `cn`.
- Método: leitura estática integral e rastreamento das primitivas importadas. A busca por `artifact` e `Artifact` em `src/`, excluindo o arquivo principal, não encontrou consumidor atual. Não foram executados build, testes de componente, browser, teclado, leitor de tela ou consulta remota ao CLI shadcn. Não se afirma cobertura comportamental dessas verificações.

## Code Review

Implementações corretas:

- A diretiva `"use client"` precede os imports (linha 1) e acomoda as primitivas interativas, sem importar APIs server-only ou ler segredos. O guia instalado explica que a fronteira se aplica ao grafo importado; ausência de hooks próprios não torna a diretiva incorreta.
- Os componentes de estrutura encaminham props HTML, `children` pelo spread e `className` com `cn`. A família mantém responsabilidades de apresentação e oferece partes explícitas para cabeçalho, descrição, ações e conteúdo; não mistura persistência, autenticação ou dados de aplicação.
- As ações fornecem `type="button"` por padrão (linhas 54 e 110), evitando submissão acidental no uso padrão. Props explícitas do consumidor podem sobrescrever esse padrão pelo spread posterior, de acordo com o contrato nativo herdado.
- `ArtifactClose` oferece nome acessível por texto visualmente oculto (linha 59). `ArtifactAction` oferece texto oculto a partir de `label` ou `tooltip` (linha 115), preservando também `aria-label` nativo por meio de props.
- Não há Effects, subscriptions, recursos persistentes, estado derivado duplicado ou acesso direto ao DOM que exijam análise de cleanup.
- A pasta AI Elements está explicitamente fora do guard de nomes de componentes de aplicação. Arrow functions e a ausência de sufixo `-client` não são findings de Next.js ou desse guard.

Riscos e recomendações:

- Quando `icon` é usado sem `label`, `tooltip`, conteúdo textual ou `aria-label`, o consumidor pode criar uma ação sem nome acessível. Isso é uma responsabilidade do contrato de uso; não foi encontrado consumidor atual que demonstre tal falha. Documentar a exigência de nome acessível e considerar um tipo mais restritivo.
- O texto `Close` é fixo em inglês (linha 59), mas `aria-label` pode ser fornecido pelo consumidor. Verificar localização no adaptador que adotar o componente, sem exigir traduções de aplicação dentro da biblioteca genérica.
- Título e descrição são parágrafos, sem associação automática a uma região. Isso não é, por si só, um erro: a estrutura semântica depende da composição do consumidor.
- A apresentação repete estilos de botão nas duas ações. Isso é pequeno e não justifica uma abstração ou refatoração isolada durante esta auditoria.
- `icon` aceita uma função de componente. Essa prop é válida entre Client Components; um Server Component deve compor conteúdo serializável ou estabelecer um adaptador cliente. Não foi encontrado uso que viole a serialização da fronteira.

## Findings

### ARTIFACT-001 — Tooltip da ação cria botões aninhados

- Identificador: `ARTIFACT-001`.
- Severidade: Baixa.
- Categoria: composição Base UI / acessibilidade / HTML inválido.
- Caminho e linha: `src/components/ai-elements/artifact.tsx:119-127`, especialmente linha 123; botão interno construído nas linhas 103-116.
- Evidência concreta: com `tooltip` preenchido, o código renderiza `<TooltipTrigger>{button}</TooltipTrigger>`, sem `render`. O wrapper local em `src/components/ui/tooltip.tsx:23-24` encaminha as props diretamente a `TooltipPrimitive.Trigger`. A implementação instalada `node_modules/@base-ui/react/tooltip/trigger/TooltipTrigger.js:187` chama `useRenderElement('button', ...)`. O filho `button` é o `Button` local, que renderiza `ButtonPrimitive`; `node_modules/@base-ui/react/button/Button.js:39` também chama `useRenderElement('button', ...)`. Portanto, o caso padrão com tooltip produz um botão dentro de outro botão.
- Referência à documentação: `.agents/skills/shadcn/rules/base-vs-radix.md`, seção “Composition: asChild vs render”, exige substituir o elemento do trigger usando `render` na família Base UI, e cita explicitamente `TooltipTrigger`. As declarações instaladas `TooltipTrigger.d.ts` confirmam que o elemento padrão é `button`. O guia Next.js instalado `01-app/01-getting-started/05-server-and-client-components.md`, seção “On the server”, explica o pré-render de HTML de Client Components; a diretiva cliente não elimina a necessidade de HTML válido. A falha é de composição da primitiva, não uma exigência de nomenclatura Next.js.
- Impacto: controles interativos aninhados produzem semântica inválida, podem introduzir focos/ativações ambíguos e, quando pré-renderizados, permitem correções do parser HTML incompatíveis com a árvore esperada na hidratação. Não foi observado erro de hidratação em execução. A severidade considera a ausência de consumidor atual encontrado em `src/`.
- Correção recomendada: compor um único botão por meio de `TooltipTrigger render={button}` (ou a forma equivalente com `render={<Button ... />}`), preservando conteúdo, handlers, props de acessibilidade e estado disabled no elemento composto. Não adicionar `asChild`, que pertence a outra família de primitivas.
- Teste sugerido: renderizar `ArtifactAction` com ícone, tooltip e handler; verificar que existe exatamente um botão, com nome acessível, que Tab o alcança uma única vez, que foco/hover abrem o tooltip e que Enter/Espaço acionam o handler uma única vez. Cobrir a variante sem tooltip e disabled. Para adoção em Next.js, verificar também pré-render/hidratação sem avisos de nesting.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: fronteira Client Component, encaminhamento de props e divisão em partes estão adequados. O caminho opcional com tooltip usa composição incompatível com a primitiva Base UI instalada e cria controles aninhados. Não houve alteração em código de aplicação nem alegação de testes executados.
