import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createEmptyCatalog } from "./catalog/operations.js";
import { CatalogRepository } from "./storage/mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getMongoConfig = (): { uri: string; databaseName: string } | null => {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DATABASE;
  if (!uri || !databaseName) {
    return null;
  }
  return { uri, databaseName };
};

const createRepository = () => {
  const config = getMongoConfig();
  if (!config) {
    return null;
  }
  return new CatalogRepository(config);
};

const app = express();
app.use(express.json());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (_req, res) => {
  res.render("index");
});

app.get("/api/catalog", async (_req, res) => {
  const repository = createRepository();
  if (!repository) {
    res.status(503).json({ message: "MongoDB config missing." });
    return;
  }
  await repository.connect();
  try {
    const catalog = (await repository.load()) ?? createEmptyCatalog();
    res.json(catalog);
  } finally {
    await repository.disconnect();
  }
});

app.post("/api/catalog/seed", async (_req, res) => {
  const repository = createRepository();
  if (!repository) {
    res.status(503).json({ message: "MongoDB config missing." });
    return;
  }
  await repository.connect();
  try {
    const existing = await repository.load();
    if (existing) {
      res.status(409).json({ message: "Catalog already exists." });
      return;
    }
    const catalog = createEmptyCatalog();
    await repository.save(catalog);
    res.status(201).json(catalog);
  } finally {
    await repository.disconnect();
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`SQLManager running on http://localhost:${port}`);
});
