# Revisão individual — `next-doc-file-01-app-03-api-reference-03-file-conventions-layout-md`

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-03-api-reference-03-file-conventions-layout-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`
- Documentação associada: convenção `layout.tsx` do App Router, props `children`/`params`, helper `LayoutProps`, root layouts, metadata, APIs de request, navegação, dados e `Suspense` com Cache Components.
- Versão do Next.js: `16.4.2` (instalada)
- Status: Concluído

## Escopo

- Responsabilidade: ler integralmente este documento instalado e confrontar os contratos de layout aplicáveis com as implementações do projeto.
- Arquivos consultados: documento principal; `src/app/layout.tsx`; `src/app/(public)/layout.tsx`; `src/app/(protected)/layout.tsx`; `src/components/ui/extensions/intl-provider-server.tsx`; `src/i18n/request.ts`; `.agents/rules/nextjs-route-files.md`; `CODING_STANDARDS.md`; `ARCHITECTURE.md`.
- Dependências analisadas: Next.js 16.4.2 App Router, `LayoutProps`, `Metadata`/`Viewport`, `next-intl`, APIs assíncronas de cookies, React `Suspense` e Cache Components.

## Code Review

### Implementações compatíveis

- O documento exige que o root layout declare `<html>` e `<body>` (linhas 112–141). `src/app/layout.tsx:40-71` define ambos e encaminha `children`; os layouts de grupos público e protegido recebem e encaminham `children` (`src/app/(public)/layout.tsx:3-11`, `src/app/(protected)/layout.tsx:3-5`).
- O root layout usa o helper gerado `LayoutProps<"/">` (`src/app/layout.tsx:40`), oferecido pelo guia nas linhas 91–110. Não lê `params`, portanto a exigência de aguardar `params` assíncrono (linhas 60–89) não é acionada nesta rota.
- O guia proíbe criar `<head>`, `<title>` ou `<meta>` manualmente no root layout e direciona para a Metadata API (linhas 140–141). O projeto exporta `generateMetadata` e `viewport` tipados em `src/app/layout.tsx:22-38`, sem `<head>` manual.
- As leituras de request precisam de uma fronteira de streaming quando Cache Components está habilitado (linhas 316–328). A leitura de `cookies()` ocorre indiretamente na configuração de `next-intl` (`src/i18n/request.ts:6-12`), sob `IntlProviderServer` (`src/components/ui/extensions/intl-provider-server.tsx:6-16`), que é composto dentro de `Suspense` no root layout (`src/app/layout.tsx:48-69`). A leitura não foi movida para antes dessa fronteira.
- O guia explica que layouts não devem depender de `searchParams` ou pathname porque podem ser reutilizados; os hooks de navegação pertencem a Client Components (linhas 178–182 e 238–246 no documento). As implementações de layout examinadas não leem esses valores diretamente; o gate cliente encapsula a navegação.
- Não há layout dinâmico com `params`, nem uso de dados que o layout tente passar como props arbitrárias aos segmentos filhos; esses exemplos do guia não exigem mudanças neste projeto.

## Findings

### DOCLAYOUT-001

- Identificador: `DOCLAYOUT-001`
- Severidade: Média
- Categoria: Acessibilidade / internacionalização
- Caminho e linha: `src/app/layout.tsx:43`
- Evidência concreta: o root layout declara `lang="en"`, enquanto `IntlProviderServer` resolve o locale da request em `src/components/ui/extensions/intl-provider-server.tsx:10-11` e `src/i18n/request.ts:7-12` seleciona o idioma via cookie/configuração. Para conteúdo em português ou espanhol, o idioma declarado no elemento `<html>` permanece inglês. A própria arquitetura registra esse descompasso em `ARCHITECTURE.md:114-123` e documenta que a solução deve preservar o streaming.
- Referência à documentação: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md:112-141` define o root layout como proprietário de `<html>` e apresenta o idioma no elemento raiz; a seção de internacionalização por segmento raiz está nas linhas 142–147. A página não obriga leitura de cookie em todos os layouts e deve ser aplicada junto ao modelo de locale existente no projeto.
- Impacto: tecnologias assistivas e ferramentas que usam o atributo de idioma podem tratar texto localizado como inglês.
- Correção recomendada: manter como dívida arquitetural conhecida até que a estratégia de locale no root preserve o boundary de `Suspense`; então emitir o `lang` do locale efetivo e validar os idiomas suportados no navegador. Não colocar a leitura dinâmica do cookie acima da fronteira atual sem avaliar o impacto de prerenderização.
- Teste sugerido: teste browser que selecione `en`, `pt-BR` e `es`, valide o texto localizado e confira `document.documentElement.lang` na resposta inicial.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: os contratos de composição, root layout, Metadata API e streaming examinados são compatíveis com o documento instalado. O único descompasso comprovado é o idioma estático do elemento raiz diante da internacionalização por cookie, já registrado pela arquitetura do projeto. As recomendações para layouts dinâmicos, `params`, query/pathname e dados de páginas são condicionais e não se aplicam às implementações examinadas.
