import { aboutArticles, externalArticles, internalArticles, networkStats, podcastEpisodes, qaData, rawSessions, timelineEvents, transcriptSummaries } from "@/lib/data";

export interface CmsArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  read: string;
  body: string;
  type: "internal" | "external";
  source?: string;
  externalUrl?: string;
  coverImageUrl?: string;
  excerpt?: string;
  featured?: boolean;
  viewCount: number;
}

export interface CmsAboutArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  read: string;
  body: string;
  coverImageUrl?: string;
  excerpt?: string;
  viewCount: number;
}

export interface CmsNetworkStat {
  id: string;
  icon: string;
  label: string;
  value: string;
  desc: string;
}

export interface CmsTimelineEvent {
  id: string;
  year: string;
  title: string;
  short: string;
  description: string;
  category: string;
  accent: string;
  imageUrl?: string;
  linkUrl?: string;
  order: number;
}

interface CmsMediaBase {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  thumbnailSeed?: string;
  viewCount: number;
}

export interface CmsAudioMediaItem extends CmsMediaBase {
  type: "audio";
  episode: string;
  publishedAt: string;
  duration: string;
  audioUrl?: string;
  rssUrl?: string;
  spotifyUrl?: string;
}

export interface CmsVideoMediaItem extends CmsMediaBase {
  type: "video";
  publishedAt: string;
  duration: string;
  views?: string;
  watchUrl?: string;
}

export interface CmsExternalMediaItem extends CmsMediaBase {
  type: "external";
  platform: string;
  handle: string;
  profileUrl?: string;
  brandColor?: string;
}

export type CmsMediaItem = CmsAudioMediaItem | CmsVideoMediaItem | CmsExternalMediaItem;

export interface CmsAmaTag {
  id: string;
  label: string;
  transcriptTerm: string;
}

export interface CmsAmaQuestion {
  id: string;
  question: string;
  answer: string;
  speaker: string;
  timestamp: string;
}

export interface CmsAmaTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  transcriptTerm: string;
}

export interface CmsAmaSession {
  id: string;
  episodeNumber: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  description: string;
  episodeNotes: string;
  participants: string[];
  coverImageUrl: string;
  audioUrl: string;
  youtubeUrl: string;
  spotifyUrl: string;
  rssUrl: string;
  xUrl: string;
  telegramUrl: string;
  instagramUrl: string;
  tags: CmsAmaTag[];
  rawTranscript: string;
  questions: CmsAmaQuestion[];
  timeline: CmsAmaTimelineItem[];
  viewCount: number;
}

export interface CmsAmaFeedback {
  id: string;
  sessionId: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  submittedAt: string;
}

export interface CmsCommunityUploadOption {
  id: string;
  type: "audio" | "video" | "document";
  title: string;
  formatHint: string;
  submissionUrl: string;
}

export interface CmsCommunitySettings {
  id: string;
  title: string;
  subtitle: string;
  uploadHeading: string;
  feedbackHeading: string;
  telegramUrl: string;
  uploadOptions: CmsCommunityUploadOption[];
  feedbackCategories: string[];
}

export interface CmsCommunityFeedback {
  id: string;
  name: string;
  category: string;
  message: string;
  status: "new" | "reviewed" | "archived";
  submittedAt: string;
}

export interface CmsSiteSettings {
  id: string;
  showViewCounts: boolean;
}

type MediaInput = Record<string, unknown>;

const value = (input: MediaInput, key: string, fallback = "") => {
  const current = input[key];
  return typeof current === "string" ? current.trim() : fallback;
};

const numericValue = (input: MediaInput, key: string, fallback = 0) => {
  const current = input[key];
  const parsed = typeof current === "number" ? current : Number(value(input, key));
  return Number.isFinite(parsed) ? parsed : fallback;
};

const recordItems = (input: MediaInput, key: string) => Array.isArray(input[key])
  ? input[key].filter((item): item is MediaInput => Boolean(item) && typeof item === "object" && !Array.isArray(item))
  : [];

const stringItems = (input: MediaInput, key: string) => {
  const current = input[key];
  if (Array.isArray(current)) return current.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  if (typeof current === "string") return current.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
};

export function normalizeArticle(input: MediaInput): CmsArticle {
  const title = value(input, "title", "Untitled");
  const type = value(input, "type") === "external" ? "external" : "internal";
  return {
    id: value(input, "id"),
    type,
    title,
    date: value(input, "date"),
    category: value(input, "category"),
    read: value(input, "read"),
    body: value(input, "body"),
    source: value(input, "source"),
    externalUrl: value(input, "externalUrl"),
    coverImageUrl: value(input, "coverImageUrl"),
    excerpt: value(input, "excerpt"),
    featured: Boolean(input.featured),
    viewCount: numericValue(input, "viewCount"),
  };
}

export function validateArticle(article: CmsArticle) {
  if (!article.id || !article.title || !article.date || !article.category || !article.read || !article.body) return "ID, title, date, category, read time, and body are required.";
  if (article.type === "external" && (!article.source || !article.externalUrl)) return "Source and source URL are required for an external article.";
  return null;
}

export function normalizeAboutArticle(input: MediaInput): CmsAboutArticle {
  return {
    id: value(input, "id"),
    title: value(input, "title", "Untitled"),
    date: value(input, "date"),
    category: value(input, "category"),
    read: value(input, "read"),
    body: value(input, "body"),
    coverImageUrl: value(input, "coverImageUrl"),
    excerpt: value(input, "excerpt"),
    viewCount: numericValue(input, "viewCount"),
  };
}

export function validateAboutArticle(article: CmsAboutArticle) {
  if (!article.id || !article.title || !article.date || !article.category || !article.read || !article.body) return "ID, title, date, category, read time, and body are required.";
  return null;
}

export function normalizeSiteSettings(input: MediaInput): CmsSiteSettings {
  return {
    id: value(input, "id", "site-settings"),
    showViewCounts: input.showViewCounts !== false && input.showViewCounts !== "false",
  };
}

export function validateSiteSettings(settings: CmsSiteSettings) {
  if (!settings.id) return "Settings ID is required.";
  return null;
}

export function normalizeTimelineEvent(input: MediaInput): CmsTimelineEvent {
  return {
    id: value(input, "id"),
    year: value(input, "year"),
    title: value(input, "title", "Untitled event"),
    short: value(input, "short"),
    description: value(input, "description"),
    category: value(input, "category", "Milestone"),
    accent: value(input, "accent", "#FF6B00"),
    imageUrl: value(input, "imageUrl"),
    linkUrl: value(input, "linkUrl"),
    order: numericValue(input, "order"),
  };
}

export function validateTimelineEvent(event: CmsTimelineEvent) {
  if (!event.id || !event.year || !event.title || !event.short || !event.description || !event.category) {
    return "ID, year, title, summary, description, and category are required.";
  }
  if (!Number.isFinite(event.order) || event.order < 1) return "Timeline order must be a positive number.";
  return null;
}

export function normalizeMediaItem(input: MediaInput): CmsMediaItem {
  const type = value(input, "type") as CmsMediaItem["type"];
  const id = value(input, "id");
  const title = value(input, "title", value(input, "platform", "Untitled"));
  const description = value(input, "description", value(input, "desc"));
  const thumbnailUrl = value(input, "thumbnailUrl");
  const thumbnailSeed = value(input, "thumbnailSeed", value(input, "imgSeed"));

  if (type === "audio") {
    return {
      id,
      type,
      title,
      description,
      episode: value(input, "episode", value(input, "ep")),
      publishedAt: value(input, "publishedAt", value(input, "date")),
      duration: value(input, "duration"),
      thumbnailUrl,
      thumbnailSeed,
      viewCount: numericValue(input, "viewCount"),
      audioUrl: value(input, "audioUrl"),
      rssUrl: value(input, "rssUrl"),
      spotifyUrl: value(input, "spotifyUrl"),
    };
  }

  if (type === "video") {
    return {
      id,
      type,
      title,
      description,
      publishedAt: value(input, "publishedAt", value(input, "date")),
      duration: value(input, "duration"),
      views: value(input, "views"),
      thumbnailUrl,
      thumbnailSeed,
      viewCount: numericValue(input, "viewCount"),
      watchUrl: value(input, "watchUrl"),
    };
  }

  return {
    id,
    type: "external",
    title,
    description,
    platform: value(input, "platform", title),
    handle: value(input, "handle"),
    thumbnailUrl,
    thumbnailSeed,
    viewCount: numericValue(input, "viewCount"),
    profileUrl: value(input, "profileUrl"),
    brandColor: value(input, "brandColor", value(input, "color", "#FF6B00")),
  };
}

export function validateMediaItem(item: CmsMediaItem) {
  if (!item.id || !item.title || !item.description) return "ID, title, and description are required.";
  if (item.type === "audio" && (!item.episode || !item.publishedAt || !item.duration)) return "Episode, publish date, and duration are required for audio.";
  if (item.type === "video" && (!item.publishedAt || !item.duration)) return "Publish date and duration are required for video.";
  if (item.type === "external" && (!item.platform || !item.handle)) return "Platform and handle are required for an external channel.";
  return null;
}

export function normalizeAmaSession(input: MediaInput): CmsAmaSession {
  return {
    id: value(input, "id"),
    episodeNumber: value(input, "episodeNumber"),
    title: value(input, "title", "Untitled AMA"),
    date: value(input, "date"),
    time: value(input, "time"),
    duration: value(input, "duration"),
    description: value(input, "description"),
    episodeNotes: value(input, "episodeNotes", value(input, "description")),
    participants: stringItems(input, "participants"),
    coverImageUrl: value(input, "coverImageUrl", value(input, "image")),
    audioUrl: value(input, "audioUrl"),
    youtubeUrl: value(input, "youtubeUrl"),
    spotifyUrl: value(input, "spotifyUrl"),
    rssUrl: value(input, "rssUrl"),
    xUrl: value(input, "xUrl"),
    telegramUrl: value(input, "telegramUrl"),
    instagramUrl: value(input, "instagramUrl"),
    tags: recordItems(input, "tags").map((tag, index) => ({
      id: value(tag, "id", `tag-${index + 1}`),
      label: value(tag, "label"),
      transcriptTerm: value(tag, "transcriptTerm"),
    })).filter((tag) => tag.label),
    rawTranscript: value(input, "rawTranscript", value(input, "rawText")),
    questions: recordItems(input, "questions").map((question, index) => ({
      id: value(question, "id", `question-${index + 1}`),
      question: value(question, "question", value(question, "q")),
      answer: value(question, "answer", value(question, "a")),
      speaker: value(question, "speaker"),
      timestamp: value(question, "timestamp", value(question, "ts")),
    })).filter((question) => question.question || question.answer),
    timeline: recordItems(input, "timeline").map((item, index) => ({
      id: value(item, "id", `timeline-${index + 1}`),
      title: value(item, "title"),
      description: value(item, "description", value(item, "text")),
      timestamp: value(item, "timestamp", value(item, "ts")),
      transcriptTerm: value(item, "transcriptTerm"),
    })).filter((item) => item.title || item.description),
    viewCount: numericValue(input, "viewCount"),
  };
}

export function validateAmaSession(session: CmsAmaSession) {
  if (!session.id || !session.episodeNumber || !session.title || !session.date || !session.time || !session.duration || !session.description || !session.rawTranscript) {
    return "ID, episode number, title, date, session time, duration, description, and raw transcript are required.";
  }
  if (session.questions.some((question) => !question.question || !question.answer)) return "Each Q&A item requires both a question and an answer.";
  if (session.timeline.some((item) => !item.title || !item.description || !item.timestamp)) return "Each timeline item requires a title, description, and timestamp.";
  return null;
}

export function normalizeAmaFeedback(input: MediaInput): CmsAmaFeedback {
  const requestedStatus = value(input, "status");
  return {
    id: value(input, "id"),
    sessionId: value(input, "sessionId"),
    message: value(input, "message"),
    status: requestedStatus === "reviewed" || requestedStatus === "archived" ? requestedStatus : "new",
    submittedAt: value(input, "submittedAt", new Date().toISOString()),
  };
}

export function validateAmaFeedback(feedback: CmsAmaFeedback) {
  if (!feedback.id || !feedback.sessionId || !feedback.message) return "Episode and feedback message are required.";
  return null;
}

export function normalizeCommunitySettings(input: MediaInput): CmsCommunitySettings {
  return {
    id: value(input, "id", "community-page"),
    title: value(input, "title", "Contribute"),
    subtitle: value(input, "subtitle"),
    uploadHeading: value(input, "uploadHeading", "Upload Content"),
    feedbackHeading: value(input, "feedbackHeading", "Feedback & Suggestions"),
    telegramUrl: value(input, "telegramUrl", "https://t.me/QuaiNetwork"),
    uploadOptions: recordItems(input, "uploadOptions").map((item, index) => ({
      id: value(item, "id", `upload-${index + 1}`),
      type: (["audio", "video", "document"] as const).includes(value(item, "type") as "audio" | "video" | "document")
        ? value(item, "type") as "audio" | "video" | "document"
        : "document",
      title: value(item, "title"),
      formatHint: value(item, "formatHint"),
      submissionUrl: value(item, "submissionUrl", value(input, "telegramUrl", "https://t.me/QuaiNetwork")),
    })).filter((item) => item.title),
    feedbackCategories: stringItems(input, "feedbackCategories"),
  };
}

export function validateCommunitySettings(settings: CmsCommunitySettings) {
  if (!settings.id || !settings.title || !settings.uploadHeading || !settings.feedbackHeading || !settings.telegramUrl) return "Page title, section headings, and submission URL are required.";
  if (!settings.uploadOptions.length) return "Add at least one upload option.";
  if (!settings.feedbackCategories.length) return "Add at least one feedback category.";
  if (settings.uploadOptions.some((item) => !item.title || !item.formatHint || !item.submissionUrl)) return "Each upload option requires a title, format hint, and destination URL.";
  return null;
}

export function normalizeCommunityFeedback(input: MediaInput): CmsCommunityFeedback {
  const status = value(input, "status");
  return {
    id: value(input, "id"),
    name: value(input, "name", "Anonymous"),
    category: value(input, "category", "Other"),
    message: value(input, "message"),
    status: status === "reviewed" || status === "archived" ? status : "new",
    submittedAt: value(input, "submittedAt", new Date().toISOString()),
  };
}

export function validateCommunityFeedback(feedback: CmsCommunityFeedback) {
  if (!feedback.id || !feedback.category || !feedback.message) return "Category and message are required.";
  return null;
}

export const seedArticles: CmsArticle[] = [
  ...internalArticles.map((item) => normalizeArticle({ ...item, type: "internal" })),
  ...externalArticles.map((item) => normalizeArticle({
    ...item,
    type: "external",
    externalUrl: {
      CoinDesk: "https://www.coindesk.com/",
      "The Block": "https://www.theblock.co/",
      Decrypt: "https://decrypt.co/",
      Unchained: "https://unchainedcrypto.com/",
    }[item.source] || "",
  })),
];

export const seedAboutArticles: CmsAboutArticle[] = aboutArticles.map((item) => normalizeAboutArticle(item));

export const seedNetworkStats: CmsNetworkStat[] = networkStats.map((item) => ({
  id: item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  ...item,
}));

const timelineAccentByCategory: Record<string, string> = {
  Foundation: "#F2B544",
  Milestone: "#3BC7FF",
  Innovation: "#6D8DFF",
  Launch: "#32C48D",
  Ecosystem: "#C6D84E",
  Upgrade: "#E776A8",
  Quai: "#FF6B00",
};

export const seedTimelineEvents: CmsTimelineEvent[] = timelineEvents.map((item, index) => normalizeTimelineEvent({
  ...item,
  accent: timelineAccentByCategory[item.category] || "#FF6B00",
  order: index + 1,
  imageUrl: "",
  linkUrl: "",
}));

export const seedMediaItems: CmsMediaItem[] = [
  ...podcastEpisodes.map((item, index) => normalizeMediaItem({
    id: `audio-${item.ep.toLowerCase().replace(/[^a-z0-9]+/g, "-") || index}`,
    type: "audio",
    title: item.title,
    episode: item.ep,
    publishedAt: item.date,
    duration: item.duration,
    description: item.desc,
    thumbnailSeed: `audio-${index}`,
    rssUrl: "https://www.qu.ai/blog",
    spotifyUrl: "https://open.spotify.com/",
  })),
  normalizeMediaItem({ id: "video-quai-ama-nov-2024", type: "video", title: "Quai AMA Nov 2024 - Full Recording", description: "A complete Quai Network AMA recording.", views: "12.4K", publishedAt: "Nov 2024", duration: "34:45", thumbnailSeed: "quai-ama-nov", watchUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "video-mainnet-launch", type: "video", title: "Quai Network Mainnet Launch Livestream", description: "The Quai Network mainnet launch livestream.", views: "34.8K", publishedAt: "Sep 2024", duration: "2:14:30", thumbnailSeed: "quai-mainnet-launch", watchUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "video-iron-age-testnet", type: "video", title: "Iron Age Testnet Stress Test - Live", description: "A live look at the Iron Age Testnet stress test.", views: "8.2K", publishedAt: "Aug 2024", duration: "1:45:12", thumbnailSeed: "quai-iron-age", watchUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "video-sdk-deep-dive", type: "video", title: "Developer AMA: Multi-Chain SDK Deep Dive", description: "A developer-focused deep dive into the multi-chain SDK.", views: "5.9K", publishedAt: "Jul 2024", duration: "52:18", thumbnailSeed: "quai-sdk-dive", watchUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "video-protocol-v14", type: "video", title: "Protocol v1.4 Upgrade Walkthrough", description: "A walkthrough of the Quai protocol v1.4 upgrade.", views: "7.1K", publishedAt: "Jun 2024", duration: "28:44", thumbnailSeed: "quai-protocol-v14", watchUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "video-qi-token-economics", type: "video", title: "Qi Token Economics Explained", description: "An explainer for Qi token economics.", views: "15.3K", publishedAt: "May 2024", duration: "41:22", thumbnailSeed: "quai-qi-economics", watchUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "external-youtube", type: "external", platform: "YouTube", title: "YouTube", handle: "@QuaiNetwork", description: "Official Quai Network channel - AMAs, livestreams, protocol explainers, and developer deep-dives.", brandColor: "#FF0000", thumbnailSeed: "ext-youtube", profileUrl: "https://www.youtube.com/@QuaiNetwork" }),
  normalizeMediaItem({ id: "external-x-twitter", type: "external", platform: "X (Twitter)", title: "X (Twitter)", handle: "@QuaiNetwork", description: "Real-time protocol updates, community highlights, governance announcements, and ecosystem news.", brandColor: "#1D9BF0", thumbnailSeed: "ext-twitter", profileUrl: "https://x.com/QuaiNetwork" }),
  normalizeMediaItem({ id: "external-instagram", type: "external", platform: "Instagram", title: "Instagram", handle: "@quainetwork", description: "Visual ecosystem coverage - infographics, event highlights, and community spotlights.", brandColor: "#E1306C", thumbnailSeed: "ext-instagram", profileUrl: "https://www.instagram.com/quainetwork" }),
  normalizeMediaItem({ id: "external-tiktok", type: "external", platform: "TikTok", title: "TikTok", handle: "@quainetwork", description: "Short-form explainers on merged mining, tokenomics, and blockchain concepts made accessible.", brandColor: "#69C9D0", thumbnailSeed: "ext-tiktok", profileUrl: "https://www.tiktok.com/@quainetwork" }),
  normalizeMediaItem({ id: "external-podcast-features", type: "external", platform: "Podcast Features", title: "Podcast Features", handle: "External Shows", description: "Quai team members featured on top crypto podcasts - Unchained, Bankless, Epicenter, and more.", brandColor: "#FF6B00", thumbnailSeed: "ext-podcast", profileUrl: "https://www.qu.ai/" }),
];

const amaLinks = {
  xUrl: "https://x.com/QuaiNetwork",
  rssUrl: "https://www.qu.ai/blog",
  spotifyUrl: "https://open.spotify.com/",
  telegramUrl: "https://t.me/QuaiNetwork",
  instagramUrl: "https://www.instagram.com/quainetwork",
};

export const seedAmaSessions: CmsAmaSession[] = rawSessions.map((session, sessionIndex) => normalizeAmaSession({
  id: session.id,
  episodeNumber: session.episodeNumber,
  title: session.title,
  date: session.date,
  time: session.time,
  duration: session.duration,
  description: session.description,
  episodeNotes: session.description,
  participants: session.participants,
  coverImageUrl: session.image,
  audioUrl: session.spotifyUrl,
  youtubeUrl: session.youtubeUrl,
  ...amaLinks,
  tags: session.tags.map((tag, index) => ({ id: `tag-${index + 1}`, ...tag })),
  rawTranscript: session.rawText,
  questions: sessionIndex === 0 ? qaData.map((item, index) => ({ id: `question-${index + 1}`, question: item.q, answer: item.a, speaker: item.speaker, timestamp: item.ts })) : [],
  timeline: transcriptSummaries.map((item, index) => ({ id: `timeline-${index + 1}`, title: item.title, description: item.text, timestamp: item.ts, transcriptTerm: "" })),
}));

export const seedCommunitySettings: CmsCommunitySettings[] = [
  normalizeCommunitySettings({
    id: "community-page",
    title: "Contribute",
    subtitle: "Share content · Give feedback · Shape the ecosystem",
    uploadHeading: "Upload Content",
    feedbackHeading: "Feedback & Suggestions",
    telegramUrl: "https://t.me/QuaiNetwork",
    uploadOptions: [
      { id: "audio", type: "audio", title: "Upload Audio", formatHint: "MP3, WAV, AAC · max 500MB", submissionUrl: "https://t.me/QuaiNetwork" },
      { id: "video", type: "video", title: "Upload Video", formatHint: "MP4, MOV, WebM · max 2GB", submissionUrl: "https://t.me/QuaiNetwork" },
      { id: "document", type: "document", title: "Upload Document", formatHint: "PDF, DOCX, PPTX · max 100MB", submissionUrl: "https://t.me/QuaiNetwork" },
    ],
    feedbackCategories: ["Content Suggestion", "Website Feedback", "Technical Report", "Community Idea", "Other"],
  }),
];

export const seedSiteSettings: CmsSiteSettings[] = [
  normalizeSiteSettings({ id: "site-settings", showViewCounts: true }),
];

export const cmsSeeds = {
  articles: seedArticles,
  aboutArticles: seedAboutArticles,
  networkStats: seedNetworkStats,
  timelineEvents: seedTimelineEvents,
  media: seedMediaItems,
  amaSessions: seedAmaSessions,
  amaFeedback: [] as CmsAmaFeedback[],
  siteSettings: seedSiteSettings,
  communitySettings: seedCommunitySettings,
  communityFeedback: [] as CmsCommunityFeedback[],
};

export type CmsCollectionName = keyof typeof cmsSeeds;
