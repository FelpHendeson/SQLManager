# Artefato inicial do catálogo

Este artefato exemplifica como o catálogo pode ser persistido após as definições iniciais.
Ele representa uma base Oracle, com schema, tabelas, pacotes, procedures, functions,
colunas inferidas e dependências internas/externas.

## Snapshot (JSON)

```json
{
  "databases": [
    {
      "id": "db-erp-orcl",
      "qualified_name": "oracle://erp-host:1521/ERPORCL",
      "name": "ERPORCL",
      "vendor": "oracle",
      "version": "19c",
      "schemas": [
        {
          "id": "schema-fin",
          "qualified_name": "ERPORCL.FIN",
          "name": "FIN",
          "tables": [
            {
              "id": "table-nota-fiscal",
              "qualified_name": "ERPORCL.FIN.NOTA_FISCAL",
              "name": "NOTA_FISCAL",
              "columns": [
                {
                  "id": "col-nf-id",
                  "qualified_name": "ERPORCL.FIN.NOTA_FISCAL.ID",
                  "name": "ID",
                  "data_type": "NUMBER(10)",
                  "nullable": false,
                  "ordinal_position": 1
                },
                {
                  "id": "col-nf-data-emissao",
                  "qualified_name": "ERPORCL.FIN.NOTA_FISCAL.DATA_EMISSAO",
                  "name": "DATA_EMISSAO",
                  "data_type": "DATE",
                  "nullable": false,
                  "ordinal_position": 2
                },
                {
                  "id": "col-nf-valor-total",
                  "qualified_name": "ERPORCL.FIN.NOTA_FISCAL.VALOR_TOTAL",
                  "name": "VALOR_TOTAL",
                  "data_type": null,
                  "nullable": true,
                  "ordinal_position": 3,
                  "inferred_type": "NUMBER(12,2)",
                  "confidence": 0.62,
                  "source_hint": "heuristic",
                  "inference_notes": "Detectado uso com SUM/ROUND em queries de faturamento."
                }
              ]
            }
          ],
          "packages": [
            {
              "id": "pkg-faturamento",
              "qualified_name": "ERPORCL.FIN.PKG_FATURAMENTO",
              "name": "PKG_FATURAMENTO",
              "procedures": [
                {
                  "id": "proc-fechar-mes",
                  "qualified_name": "ERPORCL.FIN.PKG_FATURAMENTO.FECHAR_MES",
                  "name": "FECHAR_MES",
                  "language": "PLSQL",
                  "definition": "PROCEDURE FECHAR_MES(p_data_base IN DATE);"
                }
              ],
              "functions": [
                {
                  "id": "fn-calcular-imposto",
                  "qualified_name": "ERPORCL.FIN.PKG_FATURAMENTO.CALCULAR_IMPOSTO",
                  "name": "CALCULAR_IMPOSTO",
                  "language": "PLSQL",
                  "definition": "FUNCTION CALCULAR_IMPOSTO(p_id_nf IN NUMBER) RETURN NUMBER;",
                  "return_type": "NUMBER"
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "dependencies": [
    {
      "id": "dep-001",
      "qualified_name": "ERPORCL.FIN.DEPENDENCY.001",
      "source_object_ref": {
        "object_type": "PROCEDURE",
        "object_identifier": "ERPORCL.FIN.PKG_FATURAMENTO.FECHAR_MES"
      },
      "target_object_ref": {
        "object_type": "TABLE",
        "object_identifier": "ERPORCL.FIN.NOTA_FISCAL"
      },
      "type": "writes",
      "scope": "internal",
      "confidence": 0.9,
      "source_hint": "parser"
    },
    {
      "id": "dep-002",
      "qualified_name": "ERPORCL.FIN.DEPENDENCY.002",
      "source_object_ref": {
        "object_type": "FUNCTION",
        "object_identifier": "ERPORCL.FIN.PKG_FATURAMENTO.CALCULAR_IMPOSTO"
      },
      "target_object_ref": {
        "object_type": "TABLE",
        "object_identifier": "LEGACY.FISCAL.TABELA_ALIQUOTAS"
      },
      "type": "reads",
      "scope": "external",
      "target_location": "oracle://legacy-host:1521/LEGACY",
      "confidence": 0.58,
      "source_hint": "heuristic",
      "inference_notes": "Dependência externa detectada por referência cruzada em SQL legado."
    }
  ]
}
```
