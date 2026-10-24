# Relatório individual — `next-code-file-src-components-ai-elements-code-block-tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ai-elements-code-block-tsx`.
- Tipo: `CODE_FILE`.
- Caminho principal: `src/components/ai-elements/code-block.tsx`.
- Documentação associada: Next.js instalado, `01-app/01-getting-started/05-server-and-client-components.md` e `01-app/03-api-reference/01-directives/use-client.md`; contratos locais de React, acessibilidade e componentes Base UI.
- Versão do Next.js: `16.4.2`, confirmada pelo pacote instalado.
- Status: Concluído.

## Escopo

- Responsabilidade: revisão integral das 582 linhas do módulo, incluindo tokenização, caches, assinaturas, renderização, cópia e seleção de linguagem.
- Arquivos consultados: arquivo principal; `AGENTS.md`; `docs/code-review/README.md`; `docs/code-review/agents-manifest.md`; relatório individual de `agent.tsx`; `CODING_STANDARDS.md`; `.agents/rules/components-contracts.md`; `.agents/rules/react-hooks-core.md`; `.agents/rules/react-quality.md`; `.agents/rules/nextjs-maintenance.md`; `.agents/rules/shadcn-ui-maintenance.md`; `.agents/skills/shadcn/SKILL.md`; `src/components/ui/button.tsx`; `src/components/ui/select.tsx`; `src/components/ai-elements/agent.tsx`; `src/components/ai-elements/tool.tsx`; os guias Next.js acima; pacote Shiki instalado; implementação Lucide em `node_modules/lucide-react/dist/cjs/lucide-react.js`.
- Dependências analisadas: React `19.3.1`, Shiki `4.5.0`, Button/Select locais com Base UI, Lucide, tipos de tokens e composição por contexto.
- Consumidores: `agent.tsx` e `tool.tsx` importam `CodeBlock`. A busca em `src/` não encontrou consumidor de `CodeBlockCopyButton` fora deste módulo. Isso demonstra uso por outros componentes de biblioteca, sem estabelecer uma rota de aplicação que os renderize.
- Método: inspeção estática e experimento isolado com as funções de cache/tokenização extraídas do próprio arquivo, transpiladas por TypeScript e executadas com Shiki instalado. Não foram executados build, navegador, Clipboard real, leitor de tela ou consulta remota de documentação.

## Code Review

Implementações corretas:

- A diretiva `"use client"` na linha 1 cobre hooks, contexto e o handler de Clipboard; não há import de API server-only ou segredo. O acesso a `window` e `navigator` ocorre no handler, não durante a renderização inicial.
- Conteúdo de código é renderizado como texto React em `TokenSpan`, sem `dangerouslySetInnerHTML`. Não há evidência de execução do código exibido ou de injeção de HTML por esse caminho.
- O fallback de tokens brutos permite apresentar texto antes de a linguagem carregar; erros de tokenização são capturados. Os estilos de tokens derivam do contrato Shiki instalado.
- O Effect de tokenização invalida callbacks obsoletos pelo flag `cancelled`; o timeout já criado pelo botão de cópia tem cleanup. Props de estruturas HTML, Button e Select são encaminhadas aos componentes correspondentes.
- `code: string` é um contrato explícito nas linhas 111-114 e 379-382. O problema de `agent.tsx` passar `undefined` de um schema lazy já pertence a `AGENT-001`; não foi duplicado como defeito de CodeBlock.
- As exceções de nomenclatura para AI Elements impedem classificar arrow functions, `memo` ou ausência de sufixo de integração como falhas do guard de componentes próprios.

Riscos e recomendações:

- `highlightCode` é chamado por `useMemo` durante render (linhas 388-390) e pode iniciar trabalho assíncrono e modificar mapas de módulo. Recomenda-se separar consulta pura de cache e início de trabalho no Effect; não foi afirmada uma falha de Compiler ou hidratação sem executar esses ambientes.
- Caches de tokens e highlighters não têm limite ou descarte, e callbacks cancelados permanecem no mapa até a operação terminar. Em uma sessão longa com muitos trechos, medir retenção antes de escolher uma política de limite/evicção. Não há medição de memória nesta revisão.
- Uma escrita de Clipboard ainda pendente pode resolver depois do cleanup e criar um timeout novo. Verificar substituição, desmontagem e Activity se esse controle for adotado; não foi reproduzida uma falha visível desse caso.
- O arquivo não usa API de dados, cache de Next.js, metadata, rota ou Server Action. Esses recursos são não aplicáveis ao módulo; seu cache local de tokens não é um cache de dados do framework.

## Findings

### CODEBLOCK-001 — Chave de cache colide e exibe código de outro trecho

- Identificador: `CODEBLOCK-001`.
- Severidade: Média.
- Categoria: correção de dados / identidade de cache.
- Caminho e linha: `src/components/ai-elements/code-block.tsx:144-147`, consulta nas linhas 190-195 e armazenamento na linha 228.
- Evidência concreta: a chave contém apenas linguagem, comprimento, primeiros 100 caracteres e últimos 100 caracteres. Dois textos com o mesmo comprimento e extremidades, mas com uma edição no meio, produzem a mesma chave. `highlightCode` retorna imediatamente os tokens anteriores; `CodeBlockBody` apresenta o conteúdo desses tokens, não o novo `code`. O mesmo identificador também compartilha o conjunto de callbacks, portanto a colisão afeta solicitações concorrentes, além de leituras posteriores.
- Verificação executada: extraí sem alterar a lógica o trecho entre `// Highlighter cache` e `const CodeBlockBody`, removi os tipos com `typescript.transpileModule` e injetei `createHighlighter` do Shiki instalado. Usei prefixo e sufixo superiores a 100 caracteres e corpos `const result = "first";` / `const result = "other";`. Após concluir a tokenização do primeiro, solicitei o segundo. Saída: `distinctInputs true`, `equalLength true`, `equalCacheKey true`, `secondResultEqualsFirstInput true`, `secondResultEqualsRequestedInput false`. O experimento confirma o retorno de texto incorreto pelas funções reais extraídas; não é teste de browser do componente completo.
- Referência à documentação: `.agents/rules/react-quality.md` exige identidade de cache por identidade dos dados. O guia Next.js instalado de Server/Client Components estabelece a fronteira cliente correta; a falha é do cache de apresentação próprio, não da API de cache de Next.js.
- Impacto: uma atualização de tamanho igual na parte central de um trecho longo, ou outro bloco com as mesmas extremidades, pode continuar exibindo código anterior. Isso prejudica a confiança na visualização de código ou saídas de ferramentas. Não foi demonstrado compartilhamento entre usuários, vazamento de dados ou exploração de segurança.
- Justificativa da severidade: a falha altera o conteúdo principal exibido para entradas válidas de uma API já importada por `agent.tsx` e `tool.tsx`, em vez de afetar somente apresentação secundária ou configuração opcional. Não foi estabelecida uma rota ativa que exponha esses consumidores; a classificação média descreve a integridade da biblioteca e deve ser reavaliada conforme sua adoção na aplicação.
- Correção recomendada: usar linguagem e conteúdo integral como identidade, por exemplo mapas aninhados por linguagem/texto; se optar por hash, adotar uma estratégia que verifique o conteúdo em colisões. Aplicar a mesma identidade ao cache e às assinaturas.
- Teste sugerido: tokenizar dois textos com comprimento e extremidades iguais, mas conteúdo central diferente; confirmar que o segundo resultado reconstrói exatamente o segundo texto. Cobrir chamadas sequenciais, concorrentes e edição do mesmo componente sem desmontagem.

### CODEBLOCK-002 — Botão de cópia padrão não tem nome acessível

- Identificador: `CODEBLOCK-002`.
- Severidade: Baixa.
- Categoria: acessibilidade / contrato padrão do componente.
- Caminho e linha: `src/components/ai-elements/code-block.tsx:501-510`.
- Evidência concreta: quando o consumidor não fornece `children` nem atributos de nomeação, o botão renderiza apenas `CheckIcon` ou `CopyIcon`. Nenhum `aria-label`, `aria-labelledby`, texto oculto ou `title` é definido pelo componente. O Button local encaminha props a Base UI e não acrescenta nome. Lucide define `aria-hidden="true"` por padrão em seu SVG. Logo, a composição padrão permite um botão sem nome programático.
- Referência à documentação: `CODING_STANDARDS.md:350-362`, contrato shadcn/ui de acessibilidade, exige nome acessível para ações com ícone. O guia Next.js instalado de Server/Client Components confirma a fronteira interativa; não substitui o requisito de nomeação do controle.
- Impacto: tecnologias assistivas não identificam a ação de copiar na configuração padrão. A severidade considera que nenhum consumidor atual desse botão foi encontrado em `src/`; não se afirma uma falha já exposta em uma página.
- Correção recomendada: fornecer um nome acessível padrão substituível e localizável, ou exigir nomeação no contrato de props. Preservar os atributos e conteúdo acessível que o consumidor fornecer.
- Teste sugerido: renderizar o botão sem filhos dentro de CodeBlock e consultá-lo por papel e nome de copiar; verificar nome após sucesso, atributos de localização e a variante com filhos/`aria-label` explícitos. Validar o fluxo real de Clipboard e teclado em navegador.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: fronteira cliente, escape de conteúdo e divisão em partes são adequados, mas a identidade parcial de cache retorna conteúdo incorreto para entradas válidas. O botão opcional de cópia também oferece uma configuração padrão sem nome acessível.
- Limites: revisão estática completa e reprodução isolada do cache com Shiki real. Sem alegação de build, acessibilidade integrada, hidratação, Clipboard ou testes de navegador aprovados. Somente este relatório foi escrito.
- Markdown: o executável correto `node node_modules/markdownlint-cli2/markdownlint-cli2-bin.mjs` analisou 93 arquivos por incluir o glob da configuração. Encontrou 48 problemas preexistentes no manifesto e no relatório de `tsconfig.json`; não apontou problema neste relatório. Isso não é uma aprovação global de Markdown do repositório.
