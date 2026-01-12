# MVP do SQLManager

## Objetivo
Entregar um conjunto mínimo de recursos para auxiliar a escrita e leitura de SQL, focando em validação sintática básica, formatação leve e produtividade com snippets.

## Escopo do MVP

### 1) Validação sintática básica
**Meta:** identificar erros simples e orientar o usuário antes da execução.

**Regras mínimas**
- **Parênteses balanceados:** detectar abertura/fechamento faltante ou extra.
- **Cláusulas obrigatórias por tipo de query:**
  - `SELECT` deve conter `FROM`.
  - `INSERT` deve conter `INTO`.
  - `UPDATE` deve conter `SET`.
  - `DELETE` deve conter `FROM`.
- **Ordem básica de cláusulas (SELECT):** `SELECT` → `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `ORDER BY`.
- **Tokens proibidos óbvios:** duas cláusulas iguais consecutivas (ex.: `WHERE WHERE`).

**Saídas esperadas**
- Mensagens diretas com o erro detectado e a posição aproximada (linha/coluna, quando possível).
- Severidade: `erro` (bloqueia) e `aviso` (não bloqueia).

### 2) Formatador SQL (reflow + indentação mínima)
**Meta:** melhorar legibilidade com formatação previsível sem exigir um parser completo.

**Comportamentos mínimos**
- **Quebra de linhas por cláusula:** iniciar nova linha para `SELECT`, `FROM`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`.
- **Indentação simples:**
  - Itens do `SELECT` em linhas separadas com indentação de 2 espaços.
  - Condições do `WHERE` separadas em linhas, preservando `AND`/`OR` no início da linha.
- **Reflow leve:** reduzir múltiplos espaços para 1, manter `()` e vírgulas consistentes.
- **Preservar caixa original**, sem forçar `UPPER`/`lower` no MVP.

**Exemplo (antes/depois)**
```
SELECT a,b,c FROM tabela WHERE a = 1 AND b = 2 ORDER BY c;

SELECT
  a,
  b,
  c
FROM tabela
WHERE
  a = 1
  AND b = 2
ORDER BY c;
```

### 3) Snippets e sugestões
**Meta:** acelerar a escrita com templates básicos e funções comuns.

**Snippets iniciais**
- `select` → `SELECT ... FROM ... WHERE ...`
- `insert` → `INSERT INTO ... (...) VALUES (...);`
- `update` → `UPDATE ... SET ... WHERE ...;`
- `delete` → `DELETE FROM ... WHERE ...;`

**Sugestões de funções (Oracle)**
- `NVL(expr1, expr2)`
- `DECODE(expr, search, result, ..., default)`

**Comportamento das sugestões**
- Lista curta com atalhos (ex.: `nvl` → `NVL`), aplicada conforme o contexto de edição.
- Inserção com placeholders (ex.: `NVL(${expr1}, ${expr2})`).

## Fora de escopo (MVP)
- Parser completo de SQL com AST.
- Validação semântica (ex.: colunas inexistentes).
- Dialetos avançados e múltiplos bancos (além de exemplos Oracle).
- Regras de lint extensivas.

## Critérios de aceite
- Validação identifica **parênteses não balanceados** e **cláusulas obrigatórias ausentes** em exemplos simples.
- Formatador aplica **quebras por cláusula** e **indentação mínima** conforme descrito.
- Snippets iniciais e sugestões de `NVL/DECODE` disponíveis.
- Documento do MVP publicado neste arquivo.
