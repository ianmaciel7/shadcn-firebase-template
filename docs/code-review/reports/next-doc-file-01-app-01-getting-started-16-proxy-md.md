# Relatório individual — `next-doc-file-01-app-01-getting-started-16-proxy-md`

## Identificação

- Nome completo do subagente: `next-doc-file-01-app-01-getting-started-16-proxy-md`
- Tipo: `DOC_FILE`
- Caminho principal: `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`
- Documentação associada: convenção de arquivo Proxy, `next.config.ts` redirects/rewrites, limites de autorização.
- Versão do Next.js: `16.4.2`
- Status: concluído.

## Escopo

- Responsabilidade: leitura integral do guia Proxy instalado e verificação de aplicabilidade ao projeto.
- Arquivos consultados: documento principal; `package.json`; `next.config.ts`; `.agents/rules/nextjs-maintenance.md`; busca por `proxy.*`, `middleware.*`, `NextRequest`, `NextResponse`, `middleware` e `proxy` em `src/` e `next.config.ts`.
- Dependências analisadas: `next@16.4.2`, App Router em `src/app/` e rewrites condicionais do emulador Firebase.

## Code Review

O guia informa que desde Next.js 16 Middleware passou a se chamar Proxy, mantendo a funcionalidade. O arquivo `proxy.ts` ou `proxy.js` deve ficar na raiz do projeto ou em `src/`, no mesmo nível de `app`/`pages`, e o projeto aceita apenas um arquivo Proxy; a lógica pode ser delegada a módulos importados. Ele descreve `NextRequest`, `NextResponse` e `config.matcher` como APIs de implementação.

O guia também limita o uso: Proxy pode ajustar headers, reescrever ou redirecionar requisições, mas não é indicado para busca de dados lenta nem para gerenciamento completo de sessão ou autorização. Para redirecionamentos simples, o documento orienta avaliar `redirects` no `next.config.ts` primeiro; fetch cache options não têm efeito no Proxy.

Implementações corretas / aplicabilidade:

- O projeto não contém `proxy.ts`, `proxy.js`, `middleware.ts` nem `middleware.js` versionados. Busca nos fontes também não encontrou uso de `NextRequest`/`NextResponse` ou implementação Proxy.
- As regras locais em `.agents/rules/nextjs-maintenance.md` preservam a fronteira de autorização do Firebase e alertam que Proxy/client guards não substituem autorização da camada de dados. Isso é coerente com o limite explícito do guia instalado.
- `next.config.ts` declara rewrites para endpoints do Firebase Emulator apenas em desenvolvimento e retorna uma lista vazia nos demais casos. São rewrites de configuração para destinos conhecidos e não há evidência de que o projeto precise de um Proxy para implementá-las.
- Como não existe uma superfície Proxy atual, matcher, runtime e comportamento de resposta não são aplicáveis à implementação presente.

## Findings

Nenhum finding. O guia é uma referência aplicável a uma implementação futura, mas não define uma obrigação de criar `proxy.ts`; criar Proxy neste projeto sem uma necessidade concreta ampliaria a superfície de requisições sem requisito observado.

## Conclusão

- Classificação: Não aplicável.
- Explicação: o projeto usa o App Router e a documentação 16.4.2 foi lida integralmente, mas não possui Proxy/Middleware. As rewrites de desenvolvimento existentes são configuradas em `next.config.ts`; não foi identificada divergência que exija Proxy. Se essa funcionalidade for introduzida no futuro, deve seguir o nome `proxy.ts`, a convenção de arquivo único, a semântica instalada de matcher e a separação explícita entre redirecionamento otimista e autorização real.
