# Revisão arquitetural de `src/components/`

## Identificação

- Nome completo do subagente: `next-code-folder-src-components`
- Tipo: `CODE_FOLDER`
- Caminho principal: `src/components/`
- Documentação associada: `ARCHITECTURE.md`, `.agents/rules/components-contracts.md`, `.agents/rules/shadcn-ui-maintenance.md`, `docs/adr/0008-install-firebase-ui-registry.md`, Next.js 16.4.2 Server/Client Components reference
- Versão do Next.js: `16.4.2`
- Status: concluído

## Escopo

- Responsabilidade: organização de alto nível e limites entre os módulos imediatos de componentes; os diretórios e arquivos filhos têm relatórios individuais próprios.
- Arquivos consultados: listagem de `src/components/`; `ARCHITECTURE.md`; `.agents/rules/components-contracts.md`; `.agents/rules/shadcn-ui-maintenance.md`; `docs/adr/0008-install-firebase-ui-registry.md`; `components.json`.
- Dependências analisadas: `src/components/ui/`, `src/components/firebase/` e `src/components/ai-elements/` como áreas separadas; cada árvore tem seu próprio escopo de revisão no manifesto.

## Revisão arquitetural

`src/components/` não contém arquivos diretos: a raiz separa os três domínios principais em `ui/`, `firebase/` e `ai-elements/`. A colocalização mantém os componentes compartilhados fora das rotas, enquanto `ARCHITECTURE.md` direciona extensões próprias de interface para `ui/extensions/`. A distinção entre fonte adaptável da integração Firebase e componentes de UI evita misturar a responsabilidade de autenticação com os wrappers e primitives visuais.

Inventário estrutural observado:

- `ai-elements/`: 51 arquivos, sem subpastas.
- `firebase/`: 30 arquivos, sem subpastas.
- `ui/`: 72 arquivos e a subpasta `extensions/`.
- A ausência de arquivos diretamente em `src/components/` deixa a divisão visível e não cria uma camada extra de barrel ou lógica compartilhada na raiz.

## Findings

### COMPONENTS-OWNERSHIP-001

- Identificador: `COMPONENTS-OWNERSHIP-001`
- Severidade: Baixa
- Categoria: Documentação de arquitetura / propriedade de código
- Caminho e linha: `.agents/rules/components-contracts.md:14-18`; compare `docs/adr/0008-install-firebase-ui-registry.md:454-480` e `ARCHITECTURE.md:132-137`.
- Evidência concreta: a regra de contratos classifica `ui/`, `firebase/` e `ai-elements/` conjuntamente como “vendor-owned” e os exclui das verificações de nomenclatura da aplicação. A alteração vigente do ADR 0008, porém, define os componentes Firebase copiados como fonte do projeto que pode ser adaptada; `ARCHITECTURE.md` também os descreve como fonte shadcn de propriedade local. Assim, a regra aplica ao Firebase uma classificação mais ampla do que a decisão vigente.
- Referência à documentação: ADR 0008, seção “Amendment: Adoption of locally owned source model”; `ARCHITECTURE.md`, seção de limites de runtime/componentes.
- Impacto: mantenedores podem interpretar a exceção de nomes como imutabilidade do código, apesar de a decisão atual permitir alterações locais, ou aplicar incorretamente a política de fonte gerada às demais áreas.
- Correção recomendada: explicitar na regra que o tratamento varia por árvore: primitives de shadcn, Firebase adaptável como fonte do projeto e AI Elements conforme seu contrato/documentação próprios. Preservar o histórico do ADR e atualizar apenas a orientação operacional vigente.
- Teste sugerido: teste documental ou revisão de consistência garantindo que a regra de contratos, arquitetura e ADR vigente descrevem a mesma propriedade e os limites das verificações.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: a divisão da pasta em três áreas e a ausência de módulos na raiz são coerentes com a arquitetura. Há uma contradição de documentação sobre propriedade e tratamento da árvore Firebase, que deve ser resolvida no guia operacional. Esta revisão não substitui os relatórios de cada subpasta ou arquivo, nem estabelece que todos os componentes individuais estão corretos.
