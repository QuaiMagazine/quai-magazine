import { MongoClient, type Collection, type Document } from "mongodb";
import { cmsSeeds, normalizeAboutArticle, normalizeAmaSession, normalizeArticle, normalizeMediaItem, normalizeTimelineEvent, type CmsCollectionName } from "@/lib/cms-content";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "quai_dashboard";

let cachedClient: MongoClient | null = null;
const seededCollections = new Set<string>();

export function getSeed<T extends CmsCollectionName>(name: T) {
  return cmsSeeds[name];
}

export function isCmsCollection(value: string): value is CmsCollectionName {
  return Object.prototype.hasOwnProperty.call(cmsSeeds, value);
}

async function getClient() {
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!cachedClient) {
    cachedClient = new MongoClient(uri);
    await cachedClient.connect();
  }
  return cachedClient;
}

export async function getDatabase() {
  return (await getClient()).db(dbName);
}

export async function getCmsCollection<T extends Document>(name: CmsCollectionName): Promise<Collection<T>> {
  const client = await getClient();
  return client.db(dbName).collection<T>(name);
}

export async function ensureSeeded(name: CmsCollectionName) {
  if (seededCollections.has(name)) return;
  const collection = await getCmsCollection(name);
  const count = await collection.estimatedDocumentCount();
  if (count === 0) {
    const seed = cmsSeeds[name].map((item, index) => ({ ...item, order: typeof (item as { order?: unknown }).order === "number" ? (item as { order: number }).order : index, createdAt: new Date(), updatedAt: new Date() }));
    for (const item of seed) {
      await collection.updateOne({ id: item.id }, { $setOnInsert: item }, { upsert: true });
    }
  }
  if (name === "media") {
    const docs = await collection.find({}).toArray();
    const seedById = new Map(cmsSeeds.media.map((item) => [item.id, item]));
    for (const doc of docs) {
      if (doc.schemaVersion === 3) continue;
      const normalized = normalizeMediaItem(doc as Record<string, unknown>);
      const seed = seedById.get(normalized.id);
      const completed = Object.fromEntries(
        Object.entries({ ...seed, ...normalized }).map(([key, current]) => {
          const normalizedValue = normalized[key as keyof typeof normalized];
          const seedValue = seed?.[key as keyof typeof seed];
          return [key, normalizedValue === "" || normalizedValue === undefined ? seedValue ?? current : normalizedValue];
        }),
      );
      await collection.updateOne({ _id: doc._id }, { $set: { ...completed, schemaVersion: 3, updatedAt: new Date() } });
    }
  }
  if (name === "articles" || name === "aboutArticles") {
    const docs = await collection.find({}).toArray();
    const seeds = cmsSeeds[name] as unknown as Record<string, unknown>[];
    const seedById = new Map(seeds.map((item) => [String(item.id), item]));
    for (const doc of docs) {
      if (doc.schemaVersion === 4) continue;
      const normalized = name === "articles"
        ? normalizeArticle(doc as Record<string, unknown>)
        : normalizeAboutArticle(doc as Record<string, unknown>);
      const seed = seedById.get(normalized.id);
      const complete = Object.fromEntries(Object.keys({ ...seed, ...normalized }).map((key) => {
        const current = (normalized as unknown as Record<string, unknown>)[key];
        const fallback = seed?.[key];
        return [key, current === "" || current === undefined ? fallback ?? current : current];
      }));
      await collection.updateOne({ _id: doc._id }, { $set: { ...complete, schemaVersion: 4, updatedAt: new Date() } });
    }
  }
  if (name === "amaSessions") {
    const docs = await collection.find({}).toArray();
    const seedById = new Map(cmsSeeds.amaSessions.map((item) => [item.id, item]));
    for (const doc of docs) {
      if (doc.schemaVersion === 2) continue;
      const normalized = normalizeAmaSession(doc as Record<string, unknown>);
      const seed = seedById.get(normalized.id);
      const complete = Object.fromEntries(Object.keys({ ...seed, ...normalized }).map((key) => {
        const current = (normalized as unknown as Record<string, unknown>)[key];
        const fallback = seed?.[key as keyof typeof seed];
        const missingArray = Array.isArray(current) && current.length === 0;
        return [key, current === "" || current === undefined || missingArray ? fallback ?? current : current];
      }));
      await collection.updateOne({ _id: doc._id }, { $set: { ...complete, schemaVersion: 2, updatedAt: new Date() } });
    }
  }
  if (name === "timelineEvents") {
    const docs = await collection.find({}).toArray();
    const seedById = new Map(cmsSeeds.timelineEvents.map((item) => [item.id, item]));
    for (const doc of docs) {
      if (doc.schemaVersion === 1) continue;
      const normalized = normalizeTimelineEvent(doc as Record<string, unknown>);
      const seed = seedById.get(normalized.id);
      const complete = {
        ...seed,
        ...normalized,
        order: seed?.order ?? normalized.order,
      };
      await collection.updateOne({ _id: doc._id }, { $set: { ...complete, schemaVersion: 1, updatedAt: new Date() } });
    }
  }
  const duplicateGroups = await collection
    .aggregate<{ ids: unknown[]; count: number }>([
      { $group: { _id: "$id", ids: { $push: "$_id" }, count: { $sum: 1 } } },
      { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    ])
    .toArray();

  for (const group of duplicateGroups) {
    const [, ...duplicates] = group.ids;
    if (duplicates.length) await collection.deleteMany({ _id: { $in: duplicates as any[] } } as any);
  }

  await collection.createIndex({ id: 1 }, { unique: true }).catch((error) => {
    if (error?.code !== 85 && error?.code !== 86) throw error;
  });
  seededCollections.add(name);
}

export function serializeDoc<T extends { _id?: unknown }>(doc: T) {
  const { _id, ...rest } = doc;
  return rest;
}
