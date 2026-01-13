import { addDatabase, addSchema, createEmptyCatalog } from "./catalog/operations.js";
import { Catalog } from "./catalog/models.js";
import { CatalogRepository } from "./storage/mongo.js";

const getEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const ensureCatalog = async (): Promise<void> => {
  const repository = new CatalogRepository({
    uri: getEnv("MONGODB_URI"),
    databaseName: getEnv("MONGODB_DATABASE"),
  });

  await repository.connect();
  try {
    const existing = await repository.load();
    if (existing) {
      console.log("Catalog already initialized.");
      return;
    }

    const catalog = seedCatalog(createEmptyCatalog());
    await repository.save(catalog);
    console.log("Catalog initialized with seed data.");
  } finally {
    await repository.disconnect();
  }
};

const seedCatalog = (catalog: Catalog): Catalog => {
  const database = {
    id: "db-erp",
    qualifiedName: "oracle://erp-host:1521/ERPORCL",
    name: "ERPORCL",
    vendor: "oracle",
    version: "19c",
    schemas: [],
  };

  const withDatabase = addDatabase(catalog, database);
  const schema = {
    id: "schema-fin",
    qualifiedName: "ERPORCL.FIN",
    name: "FIN",
    tables: [],
    packages: [],
  };

  return addSchema(withDatabase, database.qualifiedName, schema);
};

ensureCatalog().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
