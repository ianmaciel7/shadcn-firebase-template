# Review: `src/components/ui/extensions/intl-provider-server.tsx`

## Identificação

- Nome completo do subagente: `next-code-file-src-components-ui-extensions-intl-provider-server-tsx`
- Tipo: `CODE_FILE`
- Caminho principal: `src/components/ui/extensions/intl-provider-server.tsx`
- Documentação associada: `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`; `CODING_STANDARDS.md` (Server/Client boundaries and owned component placement); `.agents/rules/nextjs-maintenance.md`.
- Versão do Next.js: `16.4.2`
- Status: Concluído.

## Escopo

- Responsabilidade: revisão individual do provider de internacionalização do servidor e de seus limites de runtime.
- Arquivos consultados: `src/components/ui/extensions/intl-provider-server.tsx`, `src/app/layout.tsx`, `src/i18n/request.ts`, `node_modules/next-intl/dist/types/shared/NextIntlClientProvider.d.ts`, `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`, `CODING_STANDARDS.md`, `.agents/rules/react-dom-server.md`, `.agents/rules/react-quality.md`.
- Dependências analisadas: `server-only`, `next-intl`, `next-intl/server`, React `Suspense` e Next.js App Router.

## Code Review

Implementações corretas:

- `import "server-only"` impede que o módulo com leitura de dados de request seja importado acidentalmente pelo grafo Client.
- O componente é assíncrono e usa `getLocale()` e `getMessages()` no servidor, sem hooks, estado ou APIs de navegador.
- O provider client recebe o conteúdo renderizado por servidor através de `children`. O Next.js documenta este padrão de composição de providers Server/Client e a passagem de conteúdo do servidor como children.
- O chamador atual em `src/app/layout.tsx:58-68` não fornece overrides de locale ou mensagens e envolve o provider com um limite `Suspense`; as leituras de locale/cookie podem suspender abaixo desse limite.
- A leitura de locale e mensagens é consistente com `src/i18n/request.ts`, que valida o locale do cookie contra `routing.locales` e usa o locale padrão quando o valor não é suportado.

Não existe teste colocalizado para este arquivo. A revisão foi estática; não foram executados build, testes ou inspeção de runtime.

## Findings

### INTLPROVIDER-001

- Identificador: `INTLPROVIDER-001`
- Severidade: Baixa
- Categoria: Contrato de componente / internacionalização
- Caminho e linha: `src/components/ui/extensions/intl-provider-server.tsx:9,14`
- Evidência concreta: a assinatura reutiliza `React.ComponentProps<typeof NextIntlClientProvider>`, cujo tipo permite `locale` opcional e herda as demais opções do provider, incluindo `messages`. O componente primeiro calcula locale e mensagens a partir do request, mas `{...props}` vem depois em `<NextIntlClientProvider locale={locale} messages={messages} {...props}>`; um chamador pode, portanto, substituir os valores derivados do request e renderizar contexto de mensagens incompatível com o locale selecionado. O uso atual em `src/app/layout.tsx` passa somente `children`, então o risco não é exercido por esse chamador.
- Referência à documentação: o Next.js define o limite Server/Client como uma fronteira de grafo e serialização de props em `05-server-and-client-components.md`; a regra local de [componentes compostos e limites Server/Client](../../CODING_STANDARDS.md#compound-components-and-serverclient-boundaries) exige que os contratos e fronteiras sejam explícitos. A semântica exata das props foi confirmada no tipo instalado de `next-intl` citado acima.
- Impacto: uma futura composição pode inadvertidamente exibir mensagens de outro locale ou contornar a configuração de request que valida o cookie.
- Correção recomendada: excluir `locale` e `messages` do tipo de props aceito pelo wrapper, preservando o encaminhamento das demais opções suportadas; alternativamente, encaminhar as demais props antes dos valores calculados para que o request continue sendo a fonte de verdade.
- Teste sugerido: teste unitário que forneça `locale`/`messages` conflitantes e confirme que o provider recebe os valores calculados pelo request; complementar com uma verificação de tipo que impeça esses overrides.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: o módulo mantém corretamente as leituras de internacionalização no servidor, protege seu grafo com `server-only` e compõe o provider client sob o limite `Suspense` existente. O wrapper, porém, expõe props que podem substituir os valores que ele próprio resolve do request. O chamador atual não ativa esse caso, então o finding é de baixa severidade e preventivo.
