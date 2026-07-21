"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight, CalendarDays, Clock3, Search } from "lucide-react";
import { seedAmaSessions, type CmsAmaSession } from "@/lib/cms-content";
import { ViewCount } from "@/components/ViewCounts";

export default function TranscriptSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sessions, setSessions] = useState<CmsAmaSession[]>(seedAmaSessions);

  useEffect(() => {
    fetch("/api/cms/amaSessions", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => Array.isArray(data) && setSessions(data))
      .catch(() => undefined);
  }, []);

  const episodes = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return sessions;
    const tagQuery = value.replace(/^#/, "");
    return sessions.filter((episode) =>
      [episode.title, episode.description, episode.episodeNumber, ...episode.participants]
        .some((item) => item.toLowerCase().includes(value)) || episode.tags.some((tag) => tag.label.toLowerCase().includes(tagQuery))
    );
  }, [query, sessions]);

  return (
    <main className="relative min-h-screen mt-20 px-6 pb-20 pt-24 md:px-14" style={{ zIndex: 2 }}>
      <div className="mx-auto max-w-[1720px]">
        <p className="mb-3 text-sm font-mono tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>QUAI NETWORK AMA ARCHIVE</p>
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="mb-2 font-bold" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(34px, 5vw, 52px)", color: "var(--tx-high)" }}>Quai Network AMA Archive</h1>
            <p className="max-w-xl text-sm leading-relaxed" style={{ color: "var(--tx-body)" }}>Browse every Quai conversation, listen to the episode, and explore the complete discussion.</p>
          </div>
          <label className="relative block w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={15} style={{ color: "var(--tx-dim)" }} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search episodes or #tags" className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" }} />
            {query.trim().startsWith("#") && <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-xl" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 12px 28px rgba(0,0,0,.24)" }}>{Array.from(new Set(sessions.flatMap((item) => item.tags.map((tag) => tag.label)))).filter((tag) => tag.toLowerCase().includes(query.trim().slice(1).toLowerCase())).slice(0, 6).map((tag) => <button key={tag} onClick={() => setQuery(`#${tag}`)} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-orange-500/10" style={{ color: "var(--accent-text)" }}>#{tag}</button>)}</div>}
          </label>
        </div>

        <p className="mb-5 text-sm" style={{ color: "var(--tx-dim)" }}>{episodes.length} episode{episodes.length === 1 ? "" : "s"}</p>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {episodes.map((episode, index) => (
            <motion.button key={episode.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} onClick={() => router.push(`/transcript/session/${episode.id}`)} className="group overflow-hidden rounded-2xl text-left" style={{ background: "var(--glass-bg)", border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.14)" }}>
              <div className="relative aspect-[16/9] overflow-hidden" style={{ background: "var(--muted)" }}>
                {episode.coverImageUrl && <img src={episode.coverImageUrl} alt="" className="h-full w-full object-contain transition duration-500 group-hover:scale-105" />}
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 45%, rgba(5,4,14,.78))" }} />
                <span className="absolute bottom-3 left-4 text-sm font-mono tracking-wider" style={{ color: "#fff" }}>{episode.episodeNumber}</span>
                <span className="absolute bottom-3 right-4 rounded-full px-2 py-1 text-sm font-mono" style={{ color: "#fff", background: "rgba(0,0,0,.45)", border: "1px solid rgba(255,255,255,.25)" }}>{episode.duration}</span>
              </div>
              <div className="p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm font-mono" style={{ color: "var(--tx-dim)" }}>
                  <span className="flex items-center gap-1"><CalendarDays size={11} />{episode.date}</span><span className="flex items-center gap-1"><Clock3 size={11} />{episode.time}</span>
                  <ViewCount count={episode.viewCount} />
                </div>
                <h2 className="mb-2 text-xl font-bold leading-tight" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{episode.title}</h2>
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--tx-body)" }}>{episode.description}</p>
                <div className="mb-5 flex flex-wrap gap-1.5">{episode.tags.map((tag) => <span key={tag.label} className="rounded-full px-2 py-1 text-sm" style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.08)", border: "1px solid rgba(255,107,0,.18)" }}>#{tag.label}</span>)}</div>
                <span className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "var(--accent-text)" }}>Open episode <ArrowRight size={14} /></span>
              </div>
            </motion.button>
          ))}
        </div>
        {!episodes.length && <p className="py-16 text-center text-sm" style={{ color: "var(--tx-dim)" }}>No episodes match your search.</p>}
      </div>
    </main>
  );
}
