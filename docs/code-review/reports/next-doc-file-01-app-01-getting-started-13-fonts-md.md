# Relatório individual — `next-doc-file-01-app-01-getting-started-13-fonts-md`

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-13-fonts-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md`
- Documentação associada: Next.js App Router font optimization, Google fonts, local fonts, and root layout.
- Versão do Next.js: `16.4.2`
- Status: Concluído.

## Escopo

- Responsabilidade: leitura integral do guia de fontes e avaliação da sua aplicabilidade ao projeto.
- Arquivos consultados: `13-fonts.md`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/typeset.css`, `next.config.ts`, `package.json`, `DESIGN.md`.
- Dependências analisadas: `next/font/google`, Geist and Geist Mono, Tailwind CSS font tokens, global stylesheet.

## Code Review

Implementações corretas:

- O root layout importa `Geist` e `Geist_Mono` de `next/font/google` (`src/app/layout.tsx:2`), declara cada fonte no escopo do módulo e seleciona o subconjunto `latin` (`src/app/layout.tsx:12-20`). O guia recomenda usar `next/font` e prefere fontes variáveis, para as quais não é necessário declarar um peso estático.
- O layout aplica as classes de variáveis geradas pelas duas fontes ao elemento `<html>` (`src/app/layout.tsx:39-44`). O guia demonstra `className` no mesmo root element; a API de variável CSS é uma forma válida de integrar a fonte com os tokens do design system sem limitar a fonte a um componente isolado.
- Os tokens CSS apontam para essas variáveis: `--font-sans`, `--font-heading`, `--typeset-font-body` e `--typeset-font-heading` usam `--font-geist`, enquanto os tokens monospace usam `--font-geist-mono` (`src/app/globals.css:7-9,20-22`). O corpo aplica `font-sans` globalmente (`src/app/globals.css:142`), e as regras de composição tipográfica usam os tokens definidos (`src/app/typeset.css:19,60,280,292`). Isso respeita o escopo da fonte do guia e faz a configuração chegar à interface.
- O uso de Google Fonts via `next/font` self-hosts os arquivos no build, conforme a descrição do documento. O runtime do navegador não precisa buscar a fonte diretamente de Google.
- O idioma da documentação relacionado a `lang` no exemplo é separado do funcionamento da fonte. O atributo fixo `lang="en"` é analisado como achado de acessibilidade/localização no relatório próprio de `src/app/layout.tsx`, não como violação do guia de fontes.

Problemas encontrados:

- Nenhuma divergência aplicável ao guia de fontes foi comprovada.

Riscos:

- `subsets: ["latin"]` cobre os alfabetos latinos usados pelos locales atuais (`en`, `pt-BR` e `es`). Se o produto adicionar idiomas que precisem de outros glifos, os subconjuntos precisam ser revistos para evitar cobertura incompleta.
- A geração dos assets de `next/font/google` acontece durante o build. O pipeline de build deve poder resolver as fontes quando precisar baixá-las; isso é uma condição operacional, não uma incompatibilidade de implementação demonstrada neste item.

## Findings

Nenhum finding. O padrão de integração do guia está implementado e conectado aos tokens globais do projeto.

## Conclusão

- Classificação: Conforme.
- Explicação: o projeto usa `next/font/google` no root layout, compartilha classes de variáveis no `<html>` e liga os tokens de fonte do design system a essas variáveis. A escolha de subconjunto é compatível com os idiomas atualmente configurados. Uma eventual adição de outros alfabetos exige reavaliar os subconjuntos, mas não constitui não conformidade atual.
