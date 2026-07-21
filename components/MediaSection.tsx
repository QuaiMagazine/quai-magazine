"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronLeft, ChevronRight, ExternalLink, Headphones, Instagram, Music, Play,
  Radio, Rss, Search, Twitter, X, Youtube,
} from "lucide-react";
import { seedMediaItems, type CmsAudioMediaItem, type CmsExternalMediaItem, type CmsMediaItem, type CmsVideoMediaItem } from "@/lib/cms-content";
import { ViewCount, ViewTracker } from "@/components/ViewCounts";

const CARDS_PER_PAGE = 6;

function externalIcon(platform: string) {
  const name = platform.toLowerCase();
  if (name.includes("youtube")) return Youtube;
  if (name.includes("twitter") || name === "x" || name.includes("x (")) return Twitter;
  if (name.includes("instagram")) return Instagram;
  if (name.includes("tiktok")) return Music;
  return Radio;
}

function publicUrl(url?: string) {
  return url && /^https?:\/\//i.test(url) ? url : undefined;
}

function Thumbnail({ item, height, children }: { item: CmsMediaItem; height: string; children: React.ReactNode }) {
  const src = publicUrl(item.thumbnailUrl) || `https://picsum.photos/seed/${encodeURIComponent(item.thumbnailSeed || item.id)}/900/480`;
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0.58 }} />
      <div className="absolute inset-0" style={{ background: "var(--media-image-overlay)" }} />
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

function LinkPill({ href, label, Icon, accent = false }: { href?: string; label: string; Icon: typeof Rss; accent?: boolean }) {
  const url = publicUrl(href);
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-mono transition-colors"
      style={{ color: accent ? "var(--accent-text)" : "var(--tx-body)", borderColor: accent ? "rgba(255,107,0,0.28)" : "var(--bg-chip-border)" }}
    >
      <Icon size={11} /> {label}
    </a>
  );
}

export default function MediaSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "video" || searchParams.get("tab") === "external" ? searchParams.get("tab")! : "audio";
  const [items, setItems] = useState<CmsMediaItem[]>(seedMediaItems);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CmsMediaItem | null>(null);
  const [trackedViewCounts, setTrackedViewCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/cms/media", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => Array.isArray(data) && setItems(data))
      .catch(() => setItems(seedMediaItems));
  }, []);

  useEffect(() => { setPage(1); setQuery(""); }, [tab]);
  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const typeItems = useMemo(() => items.filter((item) => item.type === tab), [items, tab]);
  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return typeItems;
    return typeItems.filter((item) => [item.title, item.description, item.type === "audio" ? item.episode : "", item.type === "external" ? `${item.platform} ${item.handle}` : ""].join(" ").toLowerCase().includes(value));
  }, [query, typeItems]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / CARDS_PER_PAGE));
  const pageItems = filtered.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);
  const title = tab === "audio" ? "Audio" : tab === "video" ? "Video" : "External";

  const renderAudio = (item: CmsAudioMediaItem, index: number) => (
    <motion.article key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelected(item)} className="group cursor-pointer overflow-hidden rounded-lg border md:flex" style={{ background: "var(--glass-bg)", borderColor: "var(--border)", boxShadow: "var(--surface-shadow)" }}>
      <div className="md:w-72"><Thumbnail item={item} height="176px">
        <span className="absolute left-3 top-3 rounded px-2 py-1 text-sm font-mono" style={{ background: "rgba(255,107,0,0.20)", color: "#FFB071", border: "1px solid rgba(255,107,0,0.35)" }}>{item.episode}</span>
        <span className="absolute right-3 top-3 text-sm font-mono" style={{ color: "var(--media-text-muted)" }}>{item.publishedAt}</span>
        <div className="absolute inset-0 grid place-items-center"><div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: "rgba(255,107,0,0.24)", border: "1px solid rgba(255,107,0,0.45)" }}><Headphones size={22} style={{ color: "#FFB071" }} /></div></div>
        <span className="absolute bottom-3 right-3 rounded px-2 py-1 text-sm font-mono" style={{ background: "var(--media-pill-bg)", color: "var(--media-text)" }}>{item.duration}</span>
      </Thumbnail></div>
      <div className="flex-1 px-5 py-5">
        <h2 className="mb-2 text-lg font-bold leading-snug" style={{ color: "var(--tx-high)" }}>{item.title}</h2>
        <p className="line-clamp-3 text-sm leading-6" style={{ color: "var(--tx-body)" }}>{item.description}</p>
        <ViewCount count={trackedViewCounts[item.id] ?? item.viewCount} className="mt-3" />
        <div className="mt-4 flex flex-wrap gap-2 border-t pt-4" style={{ borderColor: "var(--bg-chip-border)" }}>
          <LinkPill href={item.audioUrl} label="Listen" Icon={Headphones} accent />
          <LinkPill href={item.rssUrl} label="RSS" Icon={Rss} />
          <LinkPill href={item.spotifyUrl} label="Spotify" Icon={Music} />
        </div>
      </div>
    </motion.article>
  );

  const renderVideo = (item: CmsVideoMediaItem, index: number) => (
    <motion.article key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelected(item)} className="group cursor-pointer overflow-hidden rounded-lg border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)", boxShadow: "var(--surface-shadow)" }}>
      <Thumbnail item={item} height="208px">
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-mono" style={{ background: "var(--media-pill-bg)", color: "#FFB071" }}><Youtube size={11} /> Video</span>
        <div className="absolute inset-0 grid place-items-center"><div className="grid h-16 w-16 place-items-center rounded-full" style={{ background: "#FF6B00", color: "#fff", boxShadow: "0 0 26px rgba(255,107,0,.38)" }}><Play size={24} /></div></div>
        <span className="absolute bottom-3 right-3 rounded px-2 py-1 text-sm font-mono" style={{ background: "var(--media-pill-bg)", color: "var(--media-text)" }}>{item.duration}</span>
        <ViewCount count={trackedViewCounts[item.id] ?? item.viewCount} className="absolute bottom-3 left-3" />
      </Thumbnail>
      <div className="px-5 py-5">
        <h2 className="mb-2 text-lg font-bold leading-snug" style={{ color: "var(--tx-high)" }}>{item.title}</h2>
        <p className="line-clamp-2 text-sm leading-6" style={{ color: "var(--tx-body)" }}>{item.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3"><span className="text-sm font-mono" style={{ color: "var(--tx-dim)" }}>{item.publishedAt}</span><LinkPill href={item.watchUrl} label="Watch" Icon={Play} accent /></div>
      </div>
    </motion.article>
  );

  const renderExternal = (item: CmsExternalMediaItem, index: number) => {
    const Icon = externalIcon(item.platform);
    const color = item.brandColor || "#FF6B00";
    return <motion.article key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} onClick={() => setSelected(item)} className="group cursor-pointer overflow-hidden rounded-lg border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)", boxShadow: "var(--surface-shadow)" }}>
      <Thumbnail item={item} height="128px"><div className="absolute inset-0 grid place-items-center" style={{ color }}><Icon size={38} /></div></Thumbnail>
      <div className="px-5 py-5"><div className="mb-2 flex items-start justify-between gap-3"><h2 className="text-lg font-bold" style={{ color: "var(--tx-high)" }}>{item.platform}</h2><ExternalLink size={15} style={{ color: "var(--tx-dim)" }} /></div><p className="mb-3 text-sm font-mono" style={{ color: "#D65B12" }}>{item.handle}</p><p className="line-clamp-3 text-sm leading-6" style={{ color: "var(--tx-body)" }}>{item.description}</p><ViewCount count={trackedViewCounts[item.id] ?? item.viewCount} className="mt-3" /><div className="mt-4"><LinkPill href={item.profileUrl} label="Visit platform" Icon={ExternalLink} accent /></div></div>
    </motion.article>;
  };

  return (
    <section className="relative min-h-screen pt-36" style={{ zIndex: 2 }}>
      <div className="border-b px-6 pb-4 pt-6 md:px-14" style={{ borderColor: "var(--border)", background: "var(--page-band)" }}><h1 className="text-3xl font-bold" style={{ color: "var(--tx-high)" }}>Media</h1></div>
      <div className="border-b" style={{ borderColor: "var(--border)", background: "var(--muted)" }}><div className="flex px-6 md:px-14">{[["audio", "Audio", Headphones], ["video", "Video", Play], ["external", "External", ExternalLink]].map(([id, label, Icon]) => { const ActiveIcon = Icon as typeof Headphones; return <button key={id as string} onClick={() => router.push(`/media?tab=${id}`)} className="inline-flex items-center gap-2 border-b-2 px-5 py-3 text-sm" style={{ borderColor: tab === id ? "#FF6B00" : "transparent", color: tab === id ? "#D65B12" : "var(--tx-body)" }}><ActiveIcon size={14} />{label as string}</button>; })}</div></div>
      <div className="flex min-h-[calc(100vh-180px)]">
        <aside className="hidden w-60 shrink-0 border-r px-4 py-7 lg:block" style={{ borderColor: "var(--border)", background: "var(--sidebar)" }}><p className="mb-2 text-sm font-mono tracking-[.16em]" style={{ color: "#D65B12" }}>{title.toUpperCase()}</p><p className="text-sm leading-6" style={{ color: "var(--tx-body)" }}>{typeItems.length} {tab === "audio" ? "episodes" : tab === "video" ? "videos" : "platforms"}</p><div className="my-6 border-t" style={{ borderColor: "var(--border)" }} /><p className="text-sm leading-5" style={{ color: "var(--tx-dim)" }}>All content and links are managed from the Media Library dashboard.</p></aside>
        <div className="min-w-0 flex-1 px-6 py-8 md:px-10"><div className="mb-7 max-w-2xl"><label className="relative block"><Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={15} style={{ color: "var(--tx-dim)" }} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}...`} className="w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--bg-input-border)", color: "var(--tx-high)" }} /></label></div><p className="mb-5 text-sm" style={{ color: "var(--tx-dim)" }}>{filtered.length} result{filtered.length === 1 ? "" : "s"}</p>
          {tab === "audio" ? <div className="space-y-4">{(pageItems as CmsAudioMediaItem[]).map(renderAudio)}</div> : tab === "video" ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{(pageItems as CmsVideoMediaItem[]).map(renderVideo)}</div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{(pageItems as CmsExternalMediaItem[]).map(renderExternal)}</div>}
          {!pageItems.length && <p className="py-16 text-center text-sm" style={{ color: "var(--tx-dim)" }}>No media matches this search.</p>}
          {totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-3"><button aria-label="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="rounded border p-2 disabled:opacity-40" style={{ borderColor: "var(--border)", color: "var(--tx-body)" }}><ChevronLeft size={16} /></button><span className="text-sm" style={{ color: "var(--tx-dim)" }}>Page {page} of {totalPages}</span><button aria-label="Next page" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="rounded border p-2 disabled:opacity-40" style={{ borderColor: "var(--border)", color: "var(--tx-body)" }}><ChevronRight size={16} /></button></div>}
        </div>
      </div>
      <AnimatePresence>{selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-5" onClick={() => setSelected(null)}><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={(event) => event.stopPropagation()} className="relative w-full max-w-xl rounded-lg border p-6" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--modal-shadow)" }}><ViewTracker collection="media" id={selected.id} onTracked={(viewCount) => setTrackedViewCounts((current) => ({ ...current, [selected.id]: viewCount }))} /><button aria-label="Close" onClick={() => setSelected(null)} className="absolute right-4 top-4 rounded p-1" style={{ color: "var(--tx-dim)" }}><X size={18} /></button><p className="mb-3 text-sm font-mono" style={{ color: "#D65B12" }}>{selected.type.toUpperCase()}</p><h2 className="mb-3 pr-8 text-2xl font-bold" style={{ color: "var(--tx-high)" }}>{selected.type === "external" ? selected.platform : selected.title}</h2><ViewCount count={trackedViewCounts[selected.id] ?? selected.viewCount} className="mb-3" /><p className="whitespace-pre-line text-sm leading-7" style={{ color: "var(--tx-body)" }}>{selected.description}</p></motion.div></motion.div>}</AnimatePresence>
    </section>
  );
}
