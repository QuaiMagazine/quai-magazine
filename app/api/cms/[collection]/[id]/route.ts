import { NextResponse } from "next/server";
import { ensureSeeded, getCmsCollection, isCmsCollection, serializeDoc } from "@/lib/mongodb";
import { normalizeAboutArticle, normalizeAmaFeedback, normalizeAmaSession, normalizeArticle, normalizeCommunityFeedback, normalizeCommunitySettings, normalizeMediaItem, normalizeSiteSettings, normalizeTimelineEvent, validateAboutArticle, validateAmaFeedback, validateAmaSession, validateArticle, validateCommunityFeedback, validateCommunitySettings, validateMediaItem, validateSiteSettings, validateTimelineEvent } from "@/lib/cms-content";
import { getAdminSession } from "@/lib/auth";

const legacyMediaFields = ["ep", "date", "desc", "imgSeed", "color"];
const typeSpecificFields = {
  audio: ["episode", "publishedAt", "duration", "audioUrl", "rssUrl", "spotifyUrl"],
  video: ["publishedAt", "duration", "views", "watchUrl"],
  external: ["platform", "handle", "profileUrl", "brandColor"],
} as const;

function mediaFieldsToRemove(type: "audio" | "video" | "external") {
  const currentFields = new Set(typeSpecificFields[type]);
  return Object.fromEntries([
    ...legacyMediaFields,
    ...Object.values(typeSpecificFields).flat().filter((field) => !currentFields.has(field)),
  ].map((field) => [field, ""]));
}

export async function PUT(request: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!isCmsCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = await request.json();
    const mediaItem = collection === "media" ? normalizeMediaItem({ ...payload, id: payload.id || id }) : null;
    const article = collection === "articles" ? normalizeArticle({ ...payload, id: payload.id || id }) : null;
    const aboutArticle = collection === "aboutArticles" ? normalizeAboutArticle({ ...payload, id: payload.id || id }) : null;
    const timelineEvent = collection === "timelineEvents" ? normalizeTimelineEvent({ ...payload, id: payload.id || id }) : null;
    const siteSettings = collection === "siteSettings" ? normalizeSiteSettings({ ...payload, id: payload.id || id }) : null;
    const amaSession = collection === "amaSessions" ? normalizeAmaSession({ ...payload, id: payload.id || id }) : null;
    const amaFeedback = collection === "amaFeedback" ? normalizeAmaFeedback({ ...payload, id: payload.id || id }) : null;
    const communitySettings = collection === "communitySettings" ? normalizeCommunitySettings({ ...payload, id: payload.id || id }) : null;
    const communityFeedback = collection === "communityFeedback" ? normalizeCommunityFeedback({ ...payload, id: payload.id || id }) : null;
    const validationError = mediaItem ? validateMediaItem(mediaItem) : article ? validateArticle(article) : aboutArticle ? validateAboutArticle(aboutArticle) : timelineEvent ? validateTimelineEvent(timelineEvent) : siteSettings ? validateSiteSettings(siteSettings) : amaSession ? validateAmaSession(amaSession) : amaFeedback ? validateAmaFeedback(amaFeedback) : communitySettings ? validateCommunitySettings(communitySettings) : communityFeedback ? validateCommunityFeedback(communityFeedback) : null;
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const update = { ...(mediaItem || article || aboutArticle || timelineEvent || siteSettings || amaSession || amaFeedback || communitySettings || communityFeedback || payload), id: mediaItem?.id || article?.id || aboutArticle?.id || timelineEvent?.id || siteSettings?.id || amaSession?.id || amaFeedback?.id || communitySettings?.id || communityFeedback?.id || payload.id || id, updatedAt: new Date() };
    delete update._id;
    await ensureSeeded(collection);
    const col = await getCmsCollection(collection);
    if (mediaItem) {
      await col.updateOne(
        { id },
        { $set: update, $unset: mediaFieldsToRemove(mediaItem.type), $setOnInsert: { createdAt: new Date() } },
        { upsert: true },
      );
    } else {
      await col.updateOne({ id }, { $set: update }, { upsert: true });
    }
    const doc = await col.findOne({ id: update.id });
    const result = doc ? serializeDoc(doc) : update;
    if (collection === "media") return NextResponse.json(normalizeMediaItem(result));
    if (collection === "articles") return NextResponse.json(normalizeArticle(result));
    if (collection === "aboutArticles") return NextResponse.json(normalizeAboutArticle(result));
    if (collection === "timelineEvents") return NextResponse.json(normalizeTimelineEvent(result));
    if (collection === "siteSettings") return NextResponse.json(normalizeSiteSettings(result));
    if (collection === "amaSessions") return NextResponse.json(normalizeAmaSession(result));
    if (collection === "amaFeedback") return NextResponse.json(normalizeAmaFeedback(result));
    if (collection === "communitySettings") return NextResponse.json(normalizeCommunitySettings(result));
    if (collection === "communityFeedback") return NextResponse.json(normalizeCommunityFeedback(result));
    return NextResponse.json(result);
  } catch (error) {
    console.error(`CMS PUT ${collection}/${id} failed`, error);
    return NextResponse.json({ error: "Unable to update item" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!isCmsCollection(collection)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await ensureSeeded(collection);
    const col = await getCmsCollection(collection);
    await col.deleteOne({ id });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(`CMS DELETE ${collection}/${id} failed`, error);
    return NextResponse.json({ error: "Unable to delete item" }, { status: 500 });
  }
}
