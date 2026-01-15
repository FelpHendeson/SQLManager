import { Collection, MongoClient } from "mongodb";
import { ScriptArtifact } from "./models.js";

export type ScriptsConfig = {
  uri: string;
  databaseName: string;
  collectionName?: string;
};

export class ScriptsRepository {
  private client: MongoClient;
  private config: ScriptsConfig;

  constructor(config: ScriptsConfig) {
    this.client = new MongoClient(config.uri);
    this.config = config;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async create(script: ScriptArtifact): Promise<void> {
    const collection = this.getCollection();
    await collection.insertOne({ ...script, _id: script.id });
  }

  async list(limit = 10): Promise<ScriptArtifact[]> {
    const collection = this.getCollection();
    const documents = await collection
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return documents as ScriptArtifact[];
  }

  async findById(id: string): Promise<ScriptArtifact | null> {
    const collection = this.getCollection();
    const document = await collection.findOne({ _id: id }, { projection: { _id: 0 } });
    return document as ScriptArtifact | null;
  }

  private getCollection(): Collection<ScriptArtifact & { _id: string }> {
    const database = this.client.db(this.config.databaseName);
    const collectionName = this.config.collectionName ?? "scripts";
    return database.collection(collectionName);
  }
}
