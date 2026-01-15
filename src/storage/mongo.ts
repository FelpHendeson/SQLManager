import { MongoClient } from "mongodb";
import { Catalog } from "../catalog/models.js";

type CatalogDocument = Catalog & { _id: string; updatedAt?: Date };

export type MongoConfig = {
  uri: string;
  databaseName: string;
  collectionName?: string;
};

export class CatalogRepository {
  private client: MongoClient;
  private config: MongoConfig;

  constructor(config: MongoConfig) {
    this.client = new MongoClient(config.uri);
    this.config = config;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  async load(): Promise<Catalog | null> {
    const collection = this.getCollection();
    const document = await collection.findOne({ _id: "catalog" });
    if (!document) {
      return null;
    }
    const { _id, updatedAt, ...catalog } = document;
    return catalog;
  }

  async save(catalog: Catalog): Promise<void> {
    const collection = this.getCollection();
    await collection.updateOne(
      { _id: "catalog" },
      { $set: { ...catalog, updatedAt: new Date() } },
      { upsert: true }
    );
  }

  private getCollection() {
    const database = this.client.db(this.config.databaseName);
    const collectionName = this.config.collectionName ?? "catalogs";
    return database.collection<CatalogDocument>(collectionName);
  }
}
