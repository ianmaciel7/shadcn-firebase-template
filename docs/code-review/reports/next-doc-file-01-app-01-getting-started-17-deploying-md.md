# Relatório individual — `next-doc-file-01-app-01-getting-started-17-deploying-md`

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-17-deploying-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`
- Documentação associada: instalação/build/start do Next.js; self-hosting e static export apenas para avaliar aplicabilidade; arquitetura e política local de hospedagem.
- Versão do Next.js: `16.4.2`
- Status: concluído.

## Escopo

- Responsabilidade: ler o guia de implantação inteiro, extrair os modos de hospedagem descritos e verificar quais são aplicáveis ao projeto e à configuração instalada.
- Arquivos consultados: documento principal; `package.json`; `next.config.ts`; `firebase.json`; `src/i18n/request.ts`; `README.md`; `ARCHITECTURE.md`; `.github/workflows/ci.yml`; `docs/agents/nextjs.md`.
- Dependências analisadas: Next.js `16.4.2`, scripts `next build`/`next start`, request cookies via `next/headers`, configuração de Cache Components/Partial Prefetching e configuração Firebase Hosting.

## Code Review

O guia descreve quatro opções com suporte distinto: servidor Node.js e Docker suportam todos os recursos do Next.js; static export é limitado; adapters variam. A instrução concreta para implantação Node é fornecer scripts `build` e `start`.

Implementações pertinentes e corretas:

- `package.json:10-12` define `dev`, `build: next build` e `start: next start`, satisfazendo o contrato genérico de servidor Node descrito pelo guia. O gerenciador do projeto é pnpm, portanto os comandos operacionais correspondentes são `pnpm build` e `pnpm start`.
- `next.config.ts:16-17` ativa Cache Components e Partial Prefetching. A escolha futura de hospedagem precisa suportar os recursos usados, conforme as matrizes de capacidade do próprio guia e dos tópicos de self-hosting/adapters.
- O guia não exige adotar Docker nem um adapter específico. O repositório não contém um Dockerfile de runtime para a aplicação; o Dockerfile presente em `.github/dependabot-mirror/playwright/` pertence ao fluxo de atualização da imagem de teste, não à implantação do Next.js.
- `firebase.json:12-16` configura o Firebase Hosting para servir `public/`, sem rewrite/proxy para `next start` ou adaptação Next.js. Isso não constitui uma integração de hospedagem da aplicação Next.js. A arquitetura confirma que nenhuma integração de deployment foi selecionada (`ARCHITECTURE.md:178-179`).
- Static export não foi configurado. Além de não ser uma exigência do guia, não deve ser presumido compatível com a aplicação atual: `src/i18n/request.ts:1-8` aguarda `cookies()` para escolher o locale por request, e `next.config.ts` ativa recursos de servidor/cache. Uma migração para static export exigiria uma análise separada das funcionalidades não suportadas.
- A política do template mantém o CI independente de provedor e só adiciona hospedagem/credenciais após o projeto derivado escolher a plataforma (`README.md:51-52`). Essa decisão é coerente com o caráter opcional das opções de implantação listadas no guia.

Problemas encontrados: nenhum desvio comprovado. A ausência de plataforma e workflow de deployment é intencional, não uma falha perante este guia. Orientações para Firebase App Hosting, Vercel, Bun, Cloudflare ou outras plataformas são alternativas de capacidade variável, não requisitos cumulativos.

## Findings

Nenhum finding. O projeto tem os scripts exigidos para uma implantação Node genérica, e não seleciona incorretamente uma plataforma, Docker ou static export.

## Conclusão

- Classificação: conforme.
- Explicação: os requisitos aplicáveis a uma implantação Node estão presentes. As outras modalidades são escolhas opcionais e a configuração local registra explicitamente que nenhuma plataforma foi escolhida. A compatibilidade de produção com um provedor específico permanece não verificada porque não há integração nem deployment selecionado.
