"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Blocks,
  ChevronRight,
  CircleDot,
  Filter,
  Landmark,
  Network,
  Rocket,
  X,
  Zap,
} from "lucide-react";
import { seedTimelineEvents, type CmsTimelineEvent } from "@/lib/cms-content";

const categoryColors: Record<string, string> = {
  Foundation: "#F2B544",
  Milestone: "#3BC7FF",
  Innovation: "#6D8DFF",
  Launch: "#32C48D",
  Ecosystem: "#C6D84E",
  Upgrade: "#E776A8",
  Quai: "#FF6B00",
};

const categoryIcons: Record<string, typeof CircleDot> = {
  Foundation: Landmark,
  Milestone: CircleDot,
  Innovation: Blocks,
  Launch: Rocket,
  Ecosystem: Network,
  Upgrade: Zap,
  Quai: Network,
};

function accentFor(event: CmsTimelineEvent) {
  return /^#[0-9a-f]{6}$/i.test(event.accent) ? event.accent : categoryColors[event.category] || "#FF6B00";
}

function EventMark({ event, size = 18 }: { event: CmsTimelineEvent; size?: number }) {
  const Icon = categoryIcons[event.category] || CircleDot;
  return <Icon size={size} aria-hidden="true" />;
}

function SortableEvents({ events }: { events: CmsTimelineEvent[] }) {
  return [...events].sort((a, b) => a.order - b.order || Number(a.year) - Number(b.year));
}

export default function TimelineSection() {
  const [events, setEvents] = useState<CmsTimelineEvent[]>(seedTimelineEvents);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<CmsTimelineEvent | null>(null);

  useEffect(() => {
    fetch("/api/cms/timelineEvents", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setEvents(Array.isArray(data) && data.length ? data : seedTimelineEvents))
      .catch(() => setEvents(seedTimelineEvents));
  }, []);

  const orderedEvents = useMemo(() => SortableEvents({ events }), [events]);
  const categories = useMemo(() => ["All", ...Array.from(new Set(orderedEvents.map((event) => event.category)))], [orderedEvents]);
  const visibleEvents = activeCategory === "All" ? orderedEvents : orderedEvents.filter((event) => event.category === activeCategory);
  const firstYear = orderedEvents[0]?.year || "-";
  const latestYear = orderedEvents.at(-1)?.year || "-";

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ zIndex: 2, background: "var(--timeline-page-bg)" }}>
      <section className="relative left-1/2 isolate min-h-[570px] w-screen -translate-x-1/2 overflow-hidden pt-32 sm:min-h-[620px] md:pt-36">
        <img src="/assets/quai-timeline-network.png" alt="" className="timeline-hero-image absolute inset-0 hidden h-full w-full max-w-none dark:block" />
        <img src="/assets/quai-timeline-network-light.png" alt="" className="timeline-hero-image absolute inset-0 hidden h-full w-full max-w-none light:block" style={{ opacity: "var(--timeline-hero-image-opacity)" }} />
        <div className="absolute inset-0" style={{ background: "var(--timeline-hero-overlay)" }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(transparent, var(--background))" }} />

        <div className="relative mx-auto flex min-h-[438px] max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8 md:px-12 lg:px-16">
          <Link href="/" className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-medium" style={{ color: "var(--timeline-hero-body)" }}>
            <ChevronRight size={15} className="rotate-180" /> HOME
          </Link>
          <p className="mb-4 text-sm font-semibold" style={{ color: "var(--timeline-hero-kicker)" }}>QUAI PROTOCOL CHRONICLE</p>
          <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--timeline-hero-title)" }}>
            The timeline behind
            <span className="block" style={{ color: "var(--timeline-hero-accent)" }}>decentralized money.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7" style={{ color: "var(--timeline-hero-body)" }}>
            Foundational breakthroughs, protocol shifts, and Quai Network milestones arranged as one continuous route.
          </p>

          <div className="mt-10 grid max-w-2xl grid-cols-3 border-y" style={{ borderColor: "var(--timeline-hero-border)" }}>
            {[
              ["EVENTS", String(orderedEvents.length).padStart(2, "0")],
              ["ORIGIN", firstYear],
              ["LATEST", latestYear],
            ].map(([label, value], index) => (
              <div key={label} className={`py-4 ${index ? "border-l pl-4 sm:pl-6" : "pr-4 sm:pr-6"}`} style={{ borderColor: "var(--timeline-hero-border)" }}>
                <p className="text-sm font-medium" style={{ color: "var(--timeline-hero-muted)" }}>{label}</p>
                <p className="mt-1 text-xl font-semibold" style={{ color: "var(--timeline-hero-title)", fontFamily: "Rajdhani, sans-serif" }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y" style={{ background: "var(--page-band)", borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 md:flex-row md:items-center md:px-12 lg:px-16">
          <div className="flex shrink-0 items-center gap-2 text-sm font-medium" style={{ color: "var(--tx-dim)" }}><Filter size={15} /> FILTER</div>
          <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 md:pb-0" style={{ scrollbarColor: "rgba(255,107,0,.5) transparent" }}>
            {categories.map((category) => {
              const active = activeCategory === category;
              const color = category === "All" ? "var(--accent-text)" : categoryColors[category] || "var(--accent-text)";
              return <button key={category} type="button" onClick={() => setActiveCategory(category)} className="shrink-0 rounded-md border px-3 py-2 text-sm transition-colors" style={{ color: active ? color : "var(--tx-body)", background: active ? `${color}1A` : "transparent", borderColor: active ? `${color}80` : "var(--border)" }}>{category}</button>;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--accent-text)" }}>THE ROUTE</p>
            <h2 className="mt-2 text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>A living chain of milestones</h2>
          </div>
          <p className="text-sm" style={{ color: "var(--tx-dim)" }}>{visibleEvents.length} event{visibleEvents.length === 1 ? "" : "s"} in view</p>
        </div>

        <div className="relative">
          <div className="absolute bottom-7 left-[23px] top-7 w-px md:left-1/2 md:-translate-x-1/2" style={{ background: "var(--border)" }} />
          <div className="space-y-8 md:space-y-10">
            {visibleEvents.map((event, index) => {
              const accent = accentFor(event);
              const isLeft = index % 2 === 0;
              return (
                <motion.article key={event.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.34, delay: Math.min(index * 0.035, 0.22) }} className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_84px_minmax(0,1fr)] md:gap-x-8">
                  <div className="col-start-1 row-start-1 flex justify-center pt-5 md:col-start-2">
                    <div className="relative grid h-12 w-12 place-items-center rounded-full border-2" style={{ color: accent, background: "var(--card)", borderColor: accent, boxShadow: `0 0 0 6px ${accent}1F, 0 0 24px ${accent}55` }}>
                      <EventMark event={event} size={18} />
                      <span className="absolute -bottom-7 whitespace-nowrap text-sm font-medium" style={{ color: "var(--tx-dim)" }}>{event.year}</span>
                    </div>
                  </div>

                  <button type="button" onClick={() => setSelected(event)} className={`group relative col-start-2 row-start-1 overflow-hidden rounded-lg border p-5 text-left transition-all hover:-translate-y-1 hover:shadow-xl md:max-w-[520px] md:p-6 ${isLeft ? "md:col-start-1 md:justify-self-end" : "md:col-start-3"}`} style={{ background: "var(--timeline-card-bg)", borderColor: "var(--border)", boxShadow: "var(--surface-shadow)", backdropFilter: "blur(14px)" }}>
                    <span className="absolute inset-x-0 top-0 h-1" style={{ background: accent }} />
                    {event.imageUrl ? <img src={event.imageUrl} alt="" className="mb-5 aspect-[16/7] w-full rounded-md object-cover" /> : <div className="mb-5 flex items-center justify-between"><span className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium" style={{ color: accent, background: `${accent}18` }}><EventMark event={event} size={14} />{event.category}</span><span className="text-2xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: accent }}>{event.year}</span></div>}
                    {event.imageUrl && <span className="mb-3 inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-sm font-medium" style={{ color: accent, background: `${accent}18` }}><EventMark event={event} size={14} />{event.category}</span>}
                    <h3 className="text-2xl font-bold transition-colors group-hover:text-[var(--accent-text)]" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{event.title}</h3>
                    <p className="mt-2 text-base leading-7" style={{ color: "var(--tx-body)" }}>{event.short}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>Explore event <ArrowUpRight size={15} /></span>
                  </button>
                </motion.article>
              );
            })}
          </div>
          {!visibleEvents.length && <p className="py-16 text-center text-base" style={{ color: "var(--tx-dim)" }}>No timeline events in this category.</p>}
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center sm:p-6" style={{ background: "var(--bg-overlay)", backdropFilter: "blur(12px)" }} onClick={() => setSelected(null)}>
            <motion.article initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 28 }} transition={{ type: "spring", damping: 25, stiffness: 280 }} className="relative max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-lg border p-6 sm:p-8" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--modal-shadow)" }} onClick={(event) => event.stopPropagation()}>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close timeline event" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border" style={{ color: "var(--tx-dim)", borderColor: "var(--border)" }}><X size={17} /></button>
              {selected.imageUrl && <img src={selected.imageUrl} alt="" className="mb-6 aspect-[16/7] w-full rounded-md object-cover" />}
              <div className="flex flex-wrap items-center gap-2 pr-10"><span className="rounded-md px-2.5 py-1 text-sm font-medium" style={{ color: accentFor(selected), background: `${accentFor(selected)}18` }}>{selected.year}</span><span className="rounded-md px-2.5 py-1 text-sm font-medium" style={{ color: "var(--tx-dim)", background: "var(--bg-chip)" }}>{selected.category}</span></div>
              <h2 className="mt-5 text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{selected.title}</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-8" style={{ color: "var(--tx-body)" }}>{selected.description}</p>
              <div className="mt-7 flex items-center justify-between border-t pt-5" style={{ borderColor: "var(--border)" }}>
                <span className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: accentFor(selected) }}><EventMark event={selected} size={15} />{selected.category}</span>
                {selected.linkUrl ? <a href={selected.linkUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold" style={{ color: "var(--tx-high)", background: accentFor(selected) }}>Source <ArrowUpRight size={15} /></a> : null}
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
