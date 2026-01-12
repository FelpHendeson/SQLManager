# Modelo de dados

## Entidades principais

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
* `data_type_id` (FK -> DataType)
* `nullable`
* `default_value`
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

### Function
* `id` (PK)
* `qualified_name` (ex.: `database.schema.package.function` ou `database.schema.function`)
* `name`
* `schema_id` (FK -> Schema)
* `package_id` (FK -> Package, opcional)
* `return_type_id` (FK -> DataType)

### Dependency
* `id` (PK)
* `qualified_name` (ex.: `database.schema.dependency.<hash>`)
* `source_object_type` (enum)
* `source_object_id` (FK polimórfica)
* `target_object_type` (enum)
* `target_object_id` (FK polimórfica)
* `dependency_type` (ex.: `CALLS`, `READS`, `WRITES`)

## Entidades auxiliares

### Parameter
* `id` (PK)
* `qualified_name` (ex.: `database.schema.procedure.parameter`)
* `name`
* `position`
* `direction` (ex.: `IN`, `OUT`, `INOUT`)
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

## Regras de identificação
* Todas as entidades possuem `id` interno e `qualified_name` único e estável.
* `qualified_name` deve ser consistente para garantir comparações e merge de metadados.
