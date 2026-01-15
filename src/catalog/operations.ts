import { Catalog, Column, Database, Dependency, FunctionDefinition, Package, Procedure, Schema, Table } from "./models.js";

const findByQualifiedName = <T extends { qualifiedName: string }>(items: T[], qualifiedName: string): T | undefined =>
  items.find((item) => item.qualifiedName === qualifiedName);

export const createEmptyCatalog = (): Catalog => ({ databases: [], dependencies: [] });

export const addDatabase = (catalog: Catalog, database: Database): Catalog => {
  if (findByQualifiedName(catalog.databases, database.qualifiedName)) {
    throw new Error(`Database already exists: ${database.qualifiedName}`);
  }
  return { ...catalog, databases: [...catalog.databases, database] };
};

export const addSchema = (catalog: Catalog, databaseQualifiedName: string, schema: Schema): Catalog => {
  const database = findByQualifiedName(catalog.databases, databaseQualifiedName);
  if (!database) {
    throw new Error(`Database not found: ${databaseQualifiedName}`);
  }
  if (findByQualifiedName(database.schemas, schema.qualifiedName)) {
    throw new Error(`Schema already exists: ${schema.qualifiedName}`);
  }
  const updatedDatabase: Database = { ...database, schemas: [...database.schemas, schema] };
  return replaceDatabase(catalog, updatedDatabase);
};

export const addTable = (catalog: Catalog, schemaQualifiedName: string, table: Table): Catalog => {
  const { database, schema } = locateSchema(catalog, schemaQualifiedName);
  if (findByQualifiedName(schema.tables, table.qualifiedName)) {
    throw new Error(`Table already exists: ${table.qualifiedName}`);
  }
  const updatedSchema: Schema = { ...schema, tables: [...schema.tables, table] };
  return replaceSchema(catalog, database, updatedSchema);
};

export const addColumn = (catalog: Catalog, tableQualifiedName: string, column: Column): Catalog => {
  const { database, schema, table } = locateTable(catalog, tableQualifiedName);
  if (findByQualifiedName(table.columns, column.qualifiedName)) {
    throw new Error(`Column already exists: ${column.qualifiedName}`);
  }
  const updatedTable: Table = { ...table, columns: [...table.columns, column] };
  const updatedSchema = replaceTable(schema, updatedTable);
  return replaceSchema(catalog, database, updatedSchema);
};

export const addPackage = (catalog: Catalog, schemaQualifiedName: string, packageItem: Package): Catalog => {
  const { database, schema } = locateSchema(catalog, schemaQualifiedName);
  if (findByQualifiedName(schema.packages, packageItem.qualifiedName)) {
    throw new Error(`Package already exists: ${packageItem.qualifiedName}`);
  }
  const updatedSchema: Schema = { ...schema, packages: [...schema.packages, packageItem] };
  return replaceSchema(catalog, database, updatedSchema);
};

export const addProcedure = (catalog: Catalog, packageQualifiedName: string, procedure: Procedure): Catalog => {
  const { database, schema, packageItem } = locatePackage(catalog, packageQualifiedName);
  if (findByQualifiedName(packageItem.procedures, procedure.qualifiedName)) {
    throw new Error(`Procedure already exists: ${procedure.qualifiedName}`);
  }
  const updatedPackage: Package = { ...packageItem, procedures: [...packageItem.procedures, procedure] };
  const updatedSchema = replacePackage(schema, updatedPackage);
  return replaceSchema(catalog, database, updatedSchema);
};

export const addFunction = (catalog: Catalog, packageQualifiedName: string, fn: FunctionDefinition): Catalog => {
  const { database, schema, packageItem } = locatePackage(catalog, packageQualifiedName);
  if (findByQualifiedName(packageItem.functions, fn.qualifiedName)) {
    throw new Error(`Function already exists: ${fn.qualifiedName}`);
  }
  const updatedPackage: Package = { ...packageItem, functions: [...packageItem.functions, fn] };
  const updatedSchema = replacePackage(schema, updatedPackage);
  return replaceSchema(catalog, database, updatedSchema);
};

export const addDependency = (catalog: Catalog, dependency: Dependency): Catalog => {
  if (findByQualifiedName(catalog.dependencies, dependency.qualifiedName)) {
    throw new Error(`Dependency already exists: ${dependency.qualifiedName}`);
  }
  return { ...catalog, dependencies: [...catalog.dependencies, dependency] };
};

const locateSchema = (catalog: Catalog, schemaQualifiedName: string) => {
  for (const database of catalog.databases) {
    const schema = findByQualifiedName(database.schemas, schemaQualifiedName);
    if (schema) {
      return { database, schema };
    }
  }
  throw new Error(`Schema not found: ${schemaQualifiedName}`);
};

const locateTable = (catalog: Catalog, tableQualifiedName: string) => {
  for (const database of catalog.databases) {
    for (const schema of database.schemas) {
      const table = findByQualifiedName(schema.tables, tableQualifiedName);
      if (table) {
        return { database, schema, table };
      }
    }
  }
  throw new Error(`Table not found: ${tableQualifiedName}`);
};

const locatePackage = (catalog: Catalog, packageQualifiedName: string) => {
  for (const database of catalog.databases) {
    for (const schema of database.schemas) {
      const packageItem = findByQualifiedName(schema.packages, packageQualifiedName);
      if (packageItem) {
        return { database, schema, packageItem };
      }
    }
  }
  throw new Error(`Package not found: ${packageQualifiedName}`);
};

const replaceDatabase = (catalog: Catalog, database: Database): Catalog => ({
  ...catalog,
  databases: catalog.databases.map((item) => (item.qualifiedName === database.qualifiedName ? database : item)),
});

const replaceSchema = (catalog: Catalog, database: Database, schema: Schema): Catalog => {
  const updatedSchemas = database.schemas.map((item) =>
    item.qualifiedName === schema.qualifiedName ? schema : item
  );
  const updatedDatabase = { ...database, schemas: updatedSchemas };
  return replaceDatabase(catalog, updatedDatabase);
};

const replaceTable = (schema: Schema, table: Table): Schema => ({
  ...schema,
  tables: schema.tables.map((item) => (item.qualifiedName === table.qualifiedName ? table : item)),
});

const replacePackage = (schema: Schema, packageItem: Package): Schema => ({
  ...schema,
  packages: schema.packages.map((item) => (item.qualifiedName === packageItem.qualifiedName ? packageItem : item)),
});
