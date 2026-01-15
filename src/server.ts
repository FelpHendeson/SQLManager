import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createEmptyCatalog } from "./catalog/operations.js";
import { CatalogRepository } from "./storage/mongo.js";
import { parseSqlScript } from "./scripts/parser.js";
import { ScriptsRepository } from "./scripts/repository.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

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

const createScriptsRepository = () => {
  const config = getMongoConfig();
  if (!config) {
    return null;
  }
  return new ScriptsRepository(config);
};

const app = express();
app.use(express.json());
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public"), { index: false }));

app.get("/", async (_req, res) => {
  const repository = createScriptsRepository();
  if (!repository) {
    res.status(503).send("MongoDB config missing.");
    return;
  }
  await repository.connect();
  try {
    const scripts = await repository.list(10);
    res.render("index", { scripts });
  } finally {
    await repository.disconnect();
  }
});

app.post("/scripts/upload", upload.single("sqlFile"), async (req, res) => {
  const repository = createScriptsRepository();
  if (!repository) {
    res.status(503).send("MongoDB config missing.");
    return;
  }
  const databaseName = String(req.body.databaseName ?? "").trim();
  const file = req.file;

  if (!databaseName || !file) {
    res.status(400).send("Database e arquivo são obrigatórios.");
    return;
  }

  const rawSql = file.buffer.toString("utf-8");
  const artifact = parseSqlScript(databaseName, file.originalname, rawSql);

  await repository.connect();
  try {
    await repository.create(artifact);
  } finally {
    await repository.disconnect();
  }

  res.redirect("/");
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

app.get("/api/scripts", async (_req, res) => {
  const repository = createScriptsRepository();
  if (!repository) {
    res.status(503).json({ message: "MongoDB config missing." });
    return;
  }
  await repository.connect();
  try {
    const scripts = await repository.list(20);
    res.json(scripts);
  } finally {
    await repository.disconnect();
  }
});

app.get("/api/scripts/:id", async (req, res) => {
  const repository = createScriptsRepository();
  if (!repository) {
    res.status(503).json({ message: "MongoDB config missing." });
    return;
  }
  await repository.connect();
  try {
    const script = await repository.findById(req.params.id);
    if (!script) {
      res.status(404).json({ message: "Script not found." });
      return;
    }
    res.json(script);
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
