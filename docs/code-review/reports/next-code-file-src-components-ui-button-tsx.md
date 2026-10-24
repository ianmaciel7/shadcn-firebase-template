# Code review: `src/components/ui/button.tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ui-button-tsx`
- Tipo: `CODE_FILE`
- Caminho principal: `src/components/ui/button.tsx`
- Documentação associada: `.agents/rules/shadcn-ui-maintenance.md`; `.agents/rules/components-composition.md`; `.agents/rules/components-contracts.md`; `CODING_STANDARDS.md`; `docs/agents/shadcn.md`; installed Base UI button types at `node_modules/@base-ui/react/button/Button.d.ts` and `node_modules/@base-ui/react/internals/types.d.ts`.
- Versão do Next.js: `16.4.2`
- Status: concluído

## Escopo

- Responsabilidade: revisão individual do wrapper compartilhado `Button`, de suas variantes e do contrato de props encaminhado à primitiva Base UI.
- Arquivos consultados: `src/components/ui/button.tsx`, `src/components/ui/button.browser.test.tsx`, `components.json`, `package.json`, os guias/regras listados acima e as declarações instaladas de `@base-ui/react/button`.
- Dependências analisadas: `@base-ui/react` (`^1.9.0`), `class-variance-authority`, `cn` e as classes Tailwind v4 definidas pelo projeto.

## Code Review

Implementações corretas:

- `Button` é uma função nomeada seguida de export nomeado, e o arquivo simples exporta apenas o componente raiz e seu helper de variantes, em conformidade com a convenção local para uma primitiva simples.
- O wrapper herda `ButtonPrimitive.Props` e `VariantProps`, encaminha as props restantes e mescla `className` com `cn` (linhas 42–53). Isso preserva o contrato Base UI em vez de criar um conjunto paralelo de atributos.
- A primitiva e as tipagens instaladas suportam `render` para composição Base UI; o wrapper encaminha essa prop sem assumir a API `asChild` de Radix. O tipo base deriva de `ComponentPropsWithRef`, mantendo o contrato de `ref` no React instalado.
- As variantes e tamanhos são declarados por `cva`, incluindo variantes semânticas, estados inválidos/expandidos e tamanhos de ícone. As classes usam os tokens e os estados documentados pelo projeto; o seletor de ícones preserva dimensionamento padrão sem impedir dimensões explícitas por `size-*`.
- A acessibilidade fica compatível com o papel nativo da primitiva, foco visível, estado disabled e uso de `aria-label` para botão de ícone. O helper `buttonVariants` também permite que navegação verdadeira mantenha um `<a>`/`Link`, conforme a orientação local em `docs/agents/shadcn.md`.
- O teste de navegador colocalizado cobre clique e foco por teclado, disabled sem disparo do evento, reflow responsivo e alvo mínimo de toque de 24×24 px (`button.browser.test.tsx:7-111`). O teste de ícone fornece um nome acessível via `aria-label`.

Problemas encontrados:

- Nenhum problema comprovado neste arquivo.

Riscos e limites da verificação:

- A primitiva de ícone não consegue exigir estaticamente um nome acessível, pois seu conteúdo pode vir de SVG, texto ou composição; os chamadores precisam fornecer nome acessível quando o botão não possui texto visível. O teste atual exemplifica esse contrato com `aria-label`.
- O wrapper não define `type="button"`; portanto, preserva o comportamento HTML nativo (`submit` dentro de formulário). Isso é uma decisão de API comum para wrappers de botão e não foi tratado como defeito sem evidência de incompatibilidade com o uso existente.
- Não executei testes nem build nesta tarefa. A análise foi estática, com leitura do teste existente e dos tipos instalados.

## Findings

Nenhum finding.

## Conclusão

- Classificação: **Conforme**.
- Explicação: o wrapper mantém o contrato Base UI instalado, encaminha props e `className`, oferece variantes coerentes com o design system e possui cobertura de navegador para interação, foco, disabled, layout e dimensão mínima. Nenhuma divergência comprovada foi encontrada no escopo deste arquivo.
