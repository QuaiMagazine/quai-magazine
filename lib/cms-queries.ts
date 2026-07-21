import { seedAboutArticles, seedArticles, type CmsAboutArticle, type CmsArticle } from "@/lib/cms-content";
import { ensureSeeded, getCmsCollection, serializeDoc } from "@/lib/mongodb";

export async function findArticle(id: string) {
  try {
    await ensureSeeded("articles");
    const doc = await (await getCmsCollection<CmsArticle>("articles")).findOne({ id });
    return doc ? serializeDoc(doc) as CmsArticle : seedArticles.find((article) => article.id === id) ?? null;
  } catch {
    return seedArticles.find((article) => article.id === id) ?? null;
  }
}

export async function findAboutArticle(id: string) {
  try {
    await ensureSeeded("aboutArticles");
    const doc = await (await getCmsCollection<CmsAboutArticle>("aboutArticles")).findOne({ id });
    return doc ? serializeDoc(doc) as CmsAboutArticle : seedAboutArticles.find((article) => article.id === id) ?? null;
  } catch {
    return seedAboutArticles.find((article) => article.id === id) ?? null;
  }
}
