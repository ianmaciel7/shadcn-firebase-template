# Relatório individual — `next-doc-folder-root`

## Identificação

- **Nome completo:** `next-doc-folder-root`
- **Tipo:** DOC_FOLDER
- **Caminho principal:** `node_modules/next/dist/docs/`
- **Documentação associada:** índice da documentação oficial do Next.js
- **Versão do Next.js:** 16.4.2
- **Status:** concluído

## Escopo

- **Responsabilidade:** auditar somente a organização, cobertura e referências cruzadas da raiz documental.
- **Arquivos consultados:** `node_modules/next/dist/docs/index.md`, listagem imediata de `node_modules/next/dist/docs/`, `node_modules/next/package.json`.
- **Dependências analisadas:** as quatro árvores documentais oficiais imediatamente abaixo da raiz: `01-app/`, `02-pages/`, `03-architecture/` e `04-community/`.

## Code Review

### Implementações corretas

- `index.md` fornece ponto de entrada, diferencia App Router e Pages Router e direciona para Getting Started, Guides e API Reference.
- As quatro áreas oficiais de primeiro nível estão presentes e correspondem à estrutura esperada pela instalação 16.4.2.
- A separação entre a documentação de App Router e Pages Router é explícita, evitando que a orientação do roteador legado seja apresentada como regra do App Router.

### Problemas encontrados

- A raiz também contém `graphify-out/`, que não pertence à taxonomia documental oficial (`01-app` a `04-community`). Sua presença altera a descoberta recursiva e pode fazer uma auditoria tratar artefatos de análise como orientação do framework.

### Riscos

- Sem uma exclusão explícita do artefato, agentes de pasta/arquivo podem produzir falsos findings contra conteúdo gerado e inflar métricas de cobertura da documentação oficial.

### Recomendações

- Mantenha `graphify-out/` explicitamente classificado como artefato gerado, fora da interpretação normativa da documentação do Next.js, mas preserve-o no manifesto de descoberta enquanto ele existir, conforme o escopo solicitado.
- Use `01-app/` como referência primária para este projeto App Router; trate `02-pages/` como fonte comparativa/migração, em linha com a própria distinção do índice.

## Findings

### NEXT-DOC-FOLDER-ROOT-001

- **Severidade:** baixa
- **Categoria:** organização / artefato gerado
- **Caminho e linha:** `node_modules/next/dist/docs/graphify-out/` (entrada de diretório; não aplicável a linha)
- **Evidência concreta:** a listagem imediata da raiz contém `01-app`, `02-pages`, `03-architecture`, `04-community` e `graphify-out`; o índice em `index.md` descreve a documentação por suas seções, não por esse diretório adicional.
- **Referência à documentação:** `node_modules/next/dist/docs/index.md`, seções “How to use the docs” e “App Router and Pages Router”.
- **Impacto:** mistura material de auditoria/gerado com a fonte normativa pode produzir cobertura e recomendações incorretas.
- **Correção recomendada:** registrar a exclusão semântica de `graphify-out/` nos relatórios consolidados; não o usar como base para recomendações de Next.js.
- **Teste sugerido:** validar que as métricas de “documentação oficial aplicável” contam somente os quatro ramos oficiais e seus documentos, mantendo o artefato apenas no inventário físico quando exigido.

## Conclusão

**Parcialmente conforme.** A raiz oficial está corretamente organizada, possui o índice esperado e apresenta os ramos App Router/Pages Router de modo claro. A presença de um diretório gerado adicional exige delimitação explícita na consolidação para que o escopo oficial não seja contaminado.
