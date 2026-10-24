# Revisão da pasta src/components/ai-elements/

## Identificação

- Nome completo do subagente: next-code-folder-src-components-ai-elements
- Tipo: CODE_FOLDER
- Caminho principal: src/components/ai-elements/
- Documentação associada: Next.js 16.4.2; ARCHITECTURE.md (UI distribution boundary e owned component placement); .agents/rules/components-contracts.md; docs/agents/shadcn.md.
- Versão do Next.js: 16.4.2
- Status: Concluído.

## Escopo

- Responsabilidade: organização, coesão, dependências, limites de execução, colocation e convenções da pasta como unidade arquitetural.
- Arquivos consultados: entradas imediatas de src/components/ai-elements/ (51 arquivos), components.json, package.json, ARCHITECTURE.md, CODING_STANDARDS.md, .agents/rules/components-contracts.md, scripts/check-component-conventions.mjs e docs/agents/shadcn.md.
- Dependências analisadas: componentes Base UI em src/components/ui/, @xyflow/react, React, AI SDK/Streamdown; verificadas as dependências declaradas em package.json.
- Subpastas imediatas: nenhuma.
- Limite: esta é uma revisão arquitetural da pasta. Nenhum arquivo filho foi assumido como escopo principal nem declarado individualmente revisado por este relatório. Ciclos não foram verificados por execução de grafo.

## Code Review

### Implementações corretas

- A pasta mantém os AI Elements sob uma raiz única, distinguindo-os das primitivas Base UI (src/components/ui/) e dos componentes Firebase (src/components/firebase/). A separação corresponde à organização documentada em ARCHITECTURE.md.
- A coleção é coesa em torno de interfaces para conversas e recursos de IA: mensagens, entrada de prompt/voz, anexos, raciocínio, ferramentas, citações, código e elementos de visualização. A organização plana também deixa cada componente acessível por um caminho previsível, compatível com o estilo de distribuição/colocação usado pelo projeto.
- A maioria dos módulos examinados declara "use client" no ponto de entrada, coerente com controles interativos e dependência de estado, eventos e APIs de navegador. A presença da diretiva não foi tratada como classificação de toda a pasta.
- As dependências diretas para src/components/ui/ apontam no sentido esperado: os AI Elements compõem primitivas compartilhadas; não foi encontrada importação direta para src/app/ nesta inspeção textual.
- As dependências especializadas de grafo/fluxo usam @xyflow/react, que está declarada no package.json. components.json fornece o alias @/components/ui usado pelos wrappers.
- Os testes prompt-input.test.tsx e speech-input.test.tsx ficam colocalizados com os módulos correspondentes. A ausência de teste para outros componentes foi registrada como cobertura a avaliar, não como violação automática: as regras locais não exigem um teste individual para cada componente de registro.

### Risco e finding

#### AIELEMENTS-FOLDER-001

- Identificador: AIELEMENTS-FOLDER-001
- Severidade: Baixa
- Categoria: Documentação de ownership / manutenção
- Caminho e linha: .agents/rules/components-contracts.md:14-18; comparar ARCHITECTURE.md:133-138 e docs/agents/shadcn.md.
- Evidência concreta: a regra de contratos chama src/components/ai-elements/ de árvore "vendor-owned" e a exclui das verificações de nomes. A arquitetura declara src/components/ai-elements como fonte localmente owned e orienta a revisar diffs ao atualizar componentes copiados. Assim, a palavra "vendor-owned" é ambígua quanto à propriedade e à obrigação de manutenção desta pasta.
- Referência à documentação: os limites Next.js Server/Client e o contrato de use client são documentados no corpus instalado; a distinção de ownership é uma convenção do repositório em ARCHITECTURE.md e .agents/rules/components-contracts.md, não uma regra do Next.js.
- Impacto: quem mantiver os AI Elements pode interpretar a exclusão das guardas como sinal de que o código é externo e não deve ser adaptado, apesar de o guia de arquitetura dizer que a fonte copiada é localmente owned.
- Correção recomendada: esclarecer que se trata de código derivado/registrado, mas mantido localmente; especificar quais guardas o excluem e que atualizações ainda precisam de revisão de fonte. Coordenar a terminologia com os demais diretórios de registro.
- Teste sugerido: revisão de consistência textual entre a regra, arquitetura e guia shadcn; não é necessário teste de runtime.

### Riscos adicionais

- A pasta contém 49 módulos de componente e apenas dois testes colocalizados. Isso reduz a evidência de comportamento para a coleção, embora as regras vigentes não imponham um teste por arquivo. Priorizar testes nos componentes com APIs de mídia, entrada, teclado, ferramentas ou estado de conversa quando forem alterados.
- scripts/check-component-conventions.mjs exclui explicitamente a pasta AI Elements dos contratos de nomenclatura/composição aplicados às extensões próprias. Isso é uma exceção de política do repositório, não uma prova de conformidade de cada módulo; os relatórios individuais ainda são necessários.

## Findings

AIELEMENTS-FOLDER-001 está detalhado acima. O finding é documental e arquitetural; não implica que a organização atual da pasta seja incorreta nem que o código deva ser movido.

## Conclusão

- Classificação: Parcialmente conforme.
- Explicação: a divisão e a coesão da pasta correspondem à fronteira de distribuição de UI documentada, e as relações examinadas com UI compartilhada e dependências estão alinhadas. Há uma inconsistência de terminologia sobre propriedade/manutenção entre a regra de contratos e a arquitetura, além de cobertura de testes limitada que permanece como risco contextual. Não foi realizada análise automatizada de ciclos nem revisão individual dos módulos filhos.
