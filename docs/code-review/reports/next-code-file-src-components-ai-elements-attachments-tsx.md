# Relatório individual — `next-code-file-src-components-ai-elements-attachments-tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ai-elements-attachments-tsx`
- Tipo: `CODE_FILE`
- Caminho principal: `src/components/ai-elements/attachments.tsx`
- Documentação associada: Next.js instalado, `01-app/01-getting-started/05-server-and-client-components.md`, `01-app/03-api-reference/01-directives/use-client.md` e `03-architecture/accessibility.md`; contratos locais de componentes e tipos instalados Base UI.
- Versão do Next.js: `16.4.2`, confirmada em `node_modules/next/package.json`.
- Status: Concluído.

## Escopo

- Responsabilidade: revisão integral e individual das 449 linhas do módulo de anexos, incluindo classificação de mídia, contextos, composição, prévias e remoção.
- Arquivos consultados: arquivo principal, `src/components/ui/button.tsx`, `src/components/ui/hover-card.tsx`, `package.json`, `AGENTS.md`, `CODING_STANDARDS.md`, `TESTING.md`, manifesto e relatório existente de `agent.tsx`; regras locais `components-contracts.md`, `react-hooks-core.md`, `shadcn-ui-maintenance.md` e skill instalada shadcn; documentação Next.js indicada acima; tipos e implementação de `@base-ui/react/preview-card/trigger/PreviewCardTrigger` e constantes da mesma dependência.
- Dependências analisadas: React Context e hooks, tipos `FileUIPart`/`SourceDocumentUIPart` do AI SDK, Lucide, Button Base UI e Preview Card Base UI por meio dos wrappers locais.
- Busca de uso: `rg` em `src/` não encontrou consumidores dos exports de anexos fora do próprio módulo. Os achados descrevem falhas da API exportada quando utilizada, sem afirmar impacto observado nas rotas atuais.

## Code Review

Implementações corretas:

- A diretiva na linha 1 estabelece corretamente a fronteira Client Component para Context, hooks, eventos e primitivas interativas. Não há importação de APIs server-only; callbacks de remoção devem ser fornecidos dentro do grafo cliente, respeitando a serialização na fronteira Server/Client.
- A união discriminada de dados distingue arquivo de documento-fonte antes de acessar URL; renderizações de imagem fornecem dimensões e texto alternativo.
- Contextos separam variante da coleção e dados de cada item. O hook individual produz erro explícito quando a composição não contém o Provider. Dependências dos valores memoizados e do callback de remoção estão declaradas.
- A remoção padrão usa botão nativo com `type="button"`, nome acessível e interrupção de propagação. Não há gerenciamento de autenticação, persistência, fetch, efeitos ou recursos que exijam limpeza.
- O arquivo reúne partes relacionadas de um componente composto. As exclusões locais de naming para AI Elements impedem classificar seus múltiplos exports ou ausência de sufixo de integração como violação do Next.js.

Riscos e recomendações:

- Os textos padrão são ingleses e podem ser substituídos por props/composição; consumidores localizados devem fornecer rótulos traduzidos. Não há consumidor atual para demonstrar regressão de tradução.
- Imagens usam HTML `img`, inclusive para possíveis URLs locais de anexos. Isso não constitui por si só falha de fronteira ou obrigação universal de usar `next/image`.
- Não foram executados testes de navegador, renderização ou temporizadores; as evidências abaixo resultam de inspeção integral de código e comparação com os tipos e a implementação instalados. Não se afirma conformidade completa de acessibilidade.

## Findings

### ATTACHMENTS-001 — Remoção permanece invisível ao receber foco de teclado

- Identificador: `ATTACHMENTS-001`
- Severidade: Baixa
- Categoria: acessibilidade / foco visível
- Caminho e linha: `src/components/ai-elements/attachments.tsx:340-350`.
- Evidência concreta: variantes `grid` e `inline` aplicam `opacity-0` ao próprio Button e só restauram opacidade com `group-hover:opacity-100`. Não há alternativa `focus-visible` ou `focus-within` no módulo. O Button local fornece ring de foco, mas a opacidade zero do elemento também oculta esse ring. O botão continua no percurso de Tab quando existe `onRemove`.
- Referência à documentação: `CODING_STANDARDS.md`, seção shadcn/ui API and accessibility, exige preservar comportamento de teclado e foco; `TESTING.md` distingue validação de foco manual/browser de scans automáticos. `node_modules/next/dist/docs/03-architecture/accessibility.md` é a referência geral de acessibilidade instalada, sem fornecer uma regra específica de opacidade nem comprovar esta interação.
- Impacto: ao navegar sem hover, o usuário pode focar um controle de remoção invisível, sem identificar a posição ou ação disponível. Não há evidência de exposição nas rotas atuais.
- Correção recomendada: revelar o controle em foco visível ou foco dentro do grupo, mantendo indicação perceptível; considerar visibilidade permanente em dispositivos sem hover.
- Teste sugerido: renderizar uma coleção nas variantes grid e inline com `onRemove`, manter o ponteiro fora e navegar por Tab. Verificar opacidade computada visível, foco perceptível e remoção por teclado.

### ATTACHMENTS-002 — Props de atraso da prévia são descartadas

- Identificador: `ATTACHMENTS-002`
- Severidade: Baixa
- Categoria: compatibilidade de API / props sem efeito
- Caminho e linha: `src/components/ai-elements/attachments.tsx:370-379`.
- Evidência concreta: `AttachmentHoverCardProps` anuncia `openDelay` e `closeDelay`; o componente desestrutura ambos e passa somente `...props` para HoverCard. Nenhum valor chega ao trigger. O wrapper local HoverCard usa `PreviewCard.Root`; os tipos instalados de `PreviewCardTrigger.d.ts:28-38` definem `delay` e `closeDelay` no Trigger. A implementação `PreviewCardTrigger.js:50-65` utiliza esses valores ou os defaults de 600/300 ms de `utils/constants.js`. Portanto alterar apenas os atrasos expostos por AttachmentHoverCard não muda a prévia.
- Referência à documentação: os tipos e implementação instalados do Base UI acima estabelecem o contrato real; `CODING_STANDARDS.md` exige usar props da primitive correta e preservar a API ao adaptá-la. O guia Next.js `use-client.md` confirma a fronteira interativa, mas não define os atrasos de bibliotecas de UI.
- Impacto: consumidores recebem uma API configurável que ignora os valores fornecidos, inclusive os defaults zero declarados pelo wrapper. A configuração ainda pode ser feita diretamente nas props corretas do trigger; não há consumidor atual demonstrando impacto em rota.
- Correção recomendada: transmitir configuração ao trigger por composição/contexto e mapear `openDelay` para `delay`, ou remover as props sem efeito e documentar a configuração no trigger Base UI.
- Teste sugerido: renderizar HoverCard com trigger/conteúdo e atrasos não padrão; usar eventos de ponteiro e temporizadores controlados para verificar abertura e fechamento nos intervalos solicitados.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: composição, fronteira cliente, discriminação dos dados e responsabilidades estão adequadas. Duas falhas locais verificáveis afetam a remoção por teclado e a configuração de atraso da prévia. São achados de componente ainda sem consumidor identificado; nenhuma correção de código foi feita e a auditoria global permanece pendente.
