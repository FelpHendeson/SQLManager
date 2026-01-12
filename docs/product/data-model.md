# Modelo de dados

## Entidades principais

## Campos obrigatórios de identificação (comuns)
* `name`
* `qualified_name`
* `owner`

## Campos opcionais (comuns)
* `comment`
* `row_count`
* `created_at`

### Database
* `id` (PK)
* `qualified_name` (ex.: `oracle://host:port/service`)
* `name`
* `vendor`
* `version`

### Schema
* `id` (PK)
* `qualified_name` (ex.: `database.schema`)
* `name`
* `database_id` (FK -> Database)

### Table
* `id` (PK)
* `qualified_name` (ex.: `database.schema.table`)
* `name`
* `schema_id` (FK -> Schema)

### Column
* `id` (PK)
* `qualified_name` (ex.: `database.schema.table.column`)
* `name`
* `table_id` (FK -> Table)
* `data_type`
* `nullable`
* `default`
* `ordinal_position`

### Package
* `id` (PK)
* `qualified_name` (ex.: `database.schema.package`)
* `name`
* `schema_id` (FK -> Schema)

### Procedure
* `id` (PK)
* `qualified_name` (ex.: `database.schema.package.procedure` ou `database.schema.procedure`)
* `name`
* `schema_id` (FK -> Schema)
* `package_id` (FK -> Package, opcional)
* `language`
* `definition`
* `return_type`

### Function
* `id` (PK)
* `qualified_name` (ex.: `database.schema.package.function` ou `database.schema.function`)
* `name`
* `schema_id` (FK -> Schema)
* `package_id` (FK -> Package, opcional)
* `language`
* `definition`
* `return_type`

### Dependency
* `id` (PK)
* `qualified_name` (ex.: `database.schema.dependency.<hash>`)
* `source_object_ref` (tipo + identificador do objeto de origem)
  * `object_type` (ex.: `TABLE`, `FUNCTION`, `PROCEDURE`)
  * `object_identifier` (ex.: `database.schema.table`)
* `target_object_ref` (tipo + identificador do objeto de destino)
  * `object_type` (ex.: `TABLE`, `FUNCTION`, `PROCEDURE`)
  * `object_identifier` (ex.: `database.schema.table`)
* `type` (ex.: `calls`, `reads`, `writes`, `uses_type`)
* `scope` (ex.: `internal`, `external`)
* `target_location` (ex.: `host/db`, opcional para dependências externas)

## Entidades auxiliares

### ObjectRef
* `id` (PK)
* `object_type` (enum)
* `object_id` (FK polimórfica)

### Parameter
* `id` (PK)
* `qualified_name` (ex.: `database.schema.procedure.parameter`)
* `name`
* `ordinal_position`
* `mode` (ex.: `IN`, `OUT`, `INOUT`)
* `procedure_id` (FK -> Procedure, opcional)
* `function_id` (FK -> Function, opcional)
* `data_type_id` (FK -> DataType)

### DataType
* `id` (PK)
* `qualified_name` (ex.: `oracle.number(10,2)` ou `postgres.varchar(255)`)
* `name`
* `vendor`
* `length`
* `precision`
* `scale`

## Relações 1—N
* `Database` 1—N `Schema`
* `Schema` 1—N `Table`
* `Table` 1—N `Column`
* `Schema` 1—N `Package`
* `Package` 1—N `Procedure`
* `Package` 1—N `Function`
* `Procedure` 1—N `Parameter`
* `Function` 1—N `Parameter`
* `ObjectRef` 1—N `Dependency` (como `source_object_ref` e `target_object_ref`)

## Regras de identificação
* Todas as entidades possuem `id` interno e `qualified_name` único e estável.
* `qualified_name` deve ser consistente para garantir comparações e merge de metadados.
