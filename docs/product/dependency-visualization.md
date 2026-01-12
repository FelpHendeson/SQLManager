# Visualização de dependências de objetos

## 1) Visão inicial (mapa geral por base)
- **Escopo inicial:** um grafo por base de dados selecionada.
- **Nós:** tabelas e pacotes (agrupadores de procedures/functions).
- **Arestas:** dependências diretas (ex.: `VIEW` depende de `TABLE`, `PROCEDURE` depende de `TABLE`).
- **Layout:** força (force-directed) com agrupamento por schema/owner quando disponível.
- **Legenda:** cores por tipo de objeto e ícones simples (table, package, procedure, function).

## 2) Navegação
- **Zoom:** scroll do mouse e botões +/- no canto superior direito.
- **Pan:** arraste do fundo do canvas.
- **Busca por objeto:** campo de busca com autocomplete por nome completo (`SCHEMA.OBJETO`).
  - Resultado centraliza e destaca o nó, mantendo o nível de zoom atual.
- **Filtros por tipo:** toggles para `table`, `procedure`, `function`, `package`.
  - Filtros aplicam opacidade (não remoção) para manter o contexto do grafo.

## 3) Detalhes no clique (painel lateral)
- **Ação:** clique em um nó abre painel lateral direito.
- **Metadados mínimos:**
  - Tipo, schema/owner, último DDL (quando disponível), status (válido/inválido).
- **SQL correspondente:**
  - Exibir o DDL/definition (read-only) com botão de copiar.
- **Dependências:** lista curta de “Depende de” e “É usado por”, com links para focar no nó.

## 4) Dependências internas vs externas
- **Definições:**
  - **Interna:** dependência dentro da mesma base/schema-alvo.
  - **Externa:** dependência para outro schema/base ou objeto não resolvido.
- **Estilos de aresta:**
  - **Interna:** linha contínua, cor azul.
  - **Externa:** linha tracejada, cor laranja.
- **Legenda visível** no canto inferior esquerdo.

## 5) Fluxo de atualização após novas entradas
- **Entrada nova:** usuário adiciona/atualiza objetos (DDL ou importação).
- **Pipeline:**
  1. Reprocessar metadados do objeto afetado.
  2. Recalcular dependências diretas.
  3. Atualizar o grafo incrementalmente (diff: adicionar/remover nós e arestas).
  4. Reaplicar filtros ativos e manter o zoom/pan atual.
- **Feedback:** toast “Mapa atualizado” e highlight temporário dos nós alterados.
