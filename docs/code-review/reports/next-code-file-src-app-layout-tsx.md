# Review: `src/app/layout.tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-app-layout-tsx`
- Tipo: `CODE_FILE`
- Caminho principal: `src/app/layout.tsx`
- Documentação associada: Next.js 16.4.2, `01-app/03-api-reference/03-file-conventions/layout.md`, `01-app/01-getting-started/05-server-and-client-components.md`, `01-app/01-getting-started/14-metadata-and-og-images.md`; React server/client and project architecture rules.
- Versão do Next.js: `16.4.2`
- Status: Concluído

## Escopo

- Responsabilidade: revisão individual do root layout, suas exportações de metadata/viewport, renderização e composição de providers.
- Arquivos consultados: `src/app/layout.tsx`, `src/components/ui/extensions/intl-provider-server.tsx`, `src/i18n/request.ts`, `ARCHITECTURE.md`, `CODING_STANDARDS.md`, `.agents/rules/nextjs-maintenance.md`, `.agents/rules/react-dom-server.md`, `.agents/rules/react-quality.md`, `.agents/rules/react-hooks-core.md`.
- Dependências analisadas: `next/font/google`, `next-intl/server`, React `Suspense`, provider client de tema, provider server de locale, tooltip provider e toaster.

## Code Review

Implementações corretas:

- O root layout mantém o formato de Server Component, declara `<html>` e `<body>` e usa o tipo global `LayoutProps<"/">`, conforme o contrato instalado do Next.js.
- `generateMetadata` e `viewport` são exports server-side adequados; o código não adiciona tags `<head>` manualmente.
- O provider assíncrono de internacionalização está dentro de `Suspense`, e o provider de tema/clientes é composto abaixo da fronteira server/client.
- As fontes são configuradas com `next/font/google`, e os providers compartilhados ficam no layout raiz.

## Findings

### NXLAYOUT-001

- Identificador: `NXLAYOUT-001`
- Severidade: Média
- Categoria: Acessibilidade / internacionalização
- Caminho e linha: `src/app/layout.tsx:43`
- Evidência concreta: o documento HTML declara `lang="en"`, enquanto `IntlProviderServer` resolve o locale pela configuração de request/cookie em `src/components/ui/extensions/intl-provider-server.tsx:7-8` e `src/i18n/request.ts:5-16`. Assim, quando a interface está em português ou espanhol, o idioma declarado ao navegador e às tecnologias assistivas continua inglês.
- Referência à documentação: a documentação oficial instalada exige o root layout e apresenta o idioma no elemento `<html>` (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`, seção “Root Layout”). A arquitetura do projeto registra explicitamente esse descompasso e observa que a leitura dinâmica de cookie acima das fronteiras `Suspense` pode bloquear prerenderização (`ARCHITECTURE.md:115-123`).
- Impacto: leitores de tela e ferramentas de idioma podem pronunciar o conteúdo localizado com regras de inglês; indexadores também recebem um idioma de documento impreciso.
- Correção recomendada: manter o comportamento atual conforme a decisão arquitetural registrada, mas tratar como dívida conhecida. Ao definir a estratégia de locale no root, emitir um atributo `lang` correspondente ao locale efetivo sem mover uma leitura dinâmica de cookie para fora da fronteira de streaming; adicionar cobertura de acessibilidade para `en`, `pt-BR` e `es` antes de alterar a implementação.
- Teste sugerido: teste de navegador que selecione cada locale pelo mecanismo suportado, confirme o texto localizado e verifique o atributo `document.documentElement.lang` correspondente, incluindo a renderização inicial.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: o layout segue os contratos do Next.js 16.4.2 e respeita a composição Server/Client e o modelo de streaming documentados. Há um descompasso conhecido entre o locale do conteúdo e `html lang`; a própria arquitetura registra o impacto e determina que uma correção depende de uma estratégia de renderização e testes de acessibilidade. Nenhum outro problema comprovado foi identificado neste arquivo.
