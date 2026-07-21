import { NextResponse } from "next/server";
import { ensureSeeded, getCmsCollection, getSeed, isCmsCollection, serializeDoc } from "@/lib/mongodb";
import { normalizeAboutArticle, normalizeAmaFeedback, normalizeAmaSession, normalizeArticle, normalizeCommunityFeedback, normalizeCommunitySettings, normalizeMediaItem, normalizeSiteSettings, normalizeTimelineEvent, validateAboutArticle, validateAmaFeedback, validateAmaSession, validateArticle, validateCommunityFeedback, validateCommunitySettings, validateMediaItem, validateSiteSettings, validateTimelineEvent } from "@/lib/cms-content";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export async function GET(_: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCmsCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if ((collection === "amaFeedback" || collection === "communityFeedback") && !(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureSeeded(collection);
    const docs = await getCmsCollection(collection).then((col) => col.find({}).sort({ order: 1, createdAt: 1 }).toArray());
    const items = docs.map(serializeDoc);
    if (collection === "media") return NextResponse.json(items.map((item) => normalizeMediaItem(item)));
    if (collection === "articles") return NextResponse.json(items.map((item) => normalizeArticle(item)));
    if (collection === "aboutArticles") return NextResponse.json(items.map((item) => normalizeAboutArticle(item)));
    if (collection === "timelineEvents") return NextResponse.json(items.map((item) => normalizeTimelineEvent(item)));
    if (collection === "siteSettings") return NextResponse.json(items.map((item) => normalizeSiteSettings(item)));
    if (collection === "amaSessions") return NextResponse.json(items.map((item) => normalizeAmaSession(item)));
    if (collection === "amaFeedback") return NextResponse.json(items.map((item) => normalizeAmaFeedback(item)));
    if (collection === "communitySettings") return NextResponse.json(items.map((item) => normalizeCommunitySettings(item)));
    if (collection === "communityFeedback") return NextResponse.json(items.map((item) => normalizeCommunityFeedback(item)));
    return NextResponse.json(items);
  } catch (error) {
    console.error(`CMS GET ${collection} failed`, error);
    return NextResponse.json(getSeed(collection));
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  if (!isCmsCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (collection !== "amaFeedback" && collection !== "communityFeedback" && !(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const mediaItem = collection === "media" ? normalizeMediaItem(payload) : null;
    const article = collection === "articles" ? normalizeArticle(payload) : null;
    const aboutArticle = collection === "aboutArticles" ? normalizeAboutArticle(payload) : null;
    const timelineEvent = collection === "timelineEvents" ? normalizeTimelineEvent(payload) : null;
    const siteSettings = collection === "siteSettings" ? normalizeSiteSettings(payload) : null;
    const amaSession = collection === "amaSessions" ? normalizeAmaSession(payload) : null;
    const amaFeedback = collection === "amaFeedback" ? normalizeAmaFeedback(payload) : null;
    const communitySettings = collection === "communitySettings" ? normalizeCommunitySettings(payload) : null;
    const communityFeedback = collection === "communityFeedback" ? normalizeCommunityFeedback(payload) : null;
    const validationError = mediaItem ? validateMediaItem(mediaItem) : article ? validateArticle(article) : aboutArticle ? validateAboutArticle(aboutArticle) : timelineEvent ? validateTimelineEvent(timelineEvent) : siteSettings ? validateSiteSettings(siteSettings) : amaSession ? validateAmaSession(amaSession) : amaFeedback ? validateAmaFeedback(amaFeedback) : communitySettings ? validateCommunitySettings(communitySettings) : communityFeedback ? validateCommunityFeedback(communityFeedback) : null;
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const title = payload.title || payload.label || payload.platform || payload.id || "Untitled";
    const item = {
      ...(mediaItem || article || aboutArticle || timelineEvent || siteSettings || amaSession || amaFeedback || communitySettings || communityFeedback || payload),
      id: mediaItem?.id || article?.id || aboutArticle?.id || timelineEvent?.id || siteSettings?.id || amaSession?.id || amaFeedback?.id || communitySettings?.id || communityFeedback?.id || payload.id || slugify(title),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await ensureSeeded(collection);
    const col = await getCmsCollection(collection);
    await col.insertOne(item);
    return NextResponse.json(serializeDoc(item), { status: 201 });
  } catch (error) {
    console.error(`CMS POST ${collection} failed`, error);
    return NextResponse.json({ error: "Unable to create item" }, { status: 500 });
  }
}
