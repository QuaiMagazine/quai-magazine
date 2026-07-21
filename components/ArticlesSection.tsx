"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, ChevronLeft, ChevronRight, ChevronDown,
  FileText, Globe, ExternalLink, X, ArrowRight,
} from "lucide-react";
import { seedArticles, type CmsArticle } from "@/lib/cms-content";
import { ViewCount } from "@/components/ViewCounts";

interface ModalContent { title: string; subtitle?: string; body: string; }
interface Suggestion { id: string; label: string; sublabel?: string; tab: string; index: number; page: number; }

const CARDS_PER_PAGE = 4;

const clampStyle: React.CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
} as React.CSSProperties;

function coverImage(article: CmsArticle) {
  return /^https?:\/\//i.test(article.coverImageUrl || "") ? article.coverImageUrl! : "/assets/tech-ama-monero-51-attack.png";
}

function buildSuggestions(query: string, tab: string, internalArticles: CmsArticle[], externalArticles: CmsArticle[]): Suggestion[] {
  if (query.trim().length < 2) return [];
  const q = query.toLowerCase();
  if (tab === "internal") {
    return internalArticles
      .map((a, i) => ({ a, i }))
      .filter(({ a }) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.body.toLowerCase().includes(q))
      .slice(0, 6)
      .map(({ a, i }) => ({ id: `int-${i}`, label: a.title, sublabel: a.category, tab: "internal", index: i, page: Math.ceil((i + 1) / CARDS_PER_PAGE) }));
  }
  return externalArticles
    .map((a, i) => ({ a, i }))
    .filter(({ a }) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || String(a.source || "").toLowerCase().includes(q) || a.body.toLowerCase().includes(q))
    .slice(0, 6)
    .map(({ a, i }) => ({ id: `ext-${i}`, label: a.title, sublabel: a.source, tab: "external", index: i, page: Math.ceil((i + 1) / CARDS_PER_PAGE) }));
}

export default function ArticlesSection() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "internal";

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [page, setPage] = useState(1);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [articles, setArticles] = useState<CmsArticle[]>(seedArticles);

  const searchWrap = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const internalArticles = useMemo(() => articles.filter((article) => article.type === "internal"), [articles]);
  const externalArticles = useMemo(() => articles.filter((article) => article.type === "external"), [articles]);

  useEffect(() => {
    fetch("/api/cms/articles", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => Array.isArray(data) && setArticles(data))
      .catch(() => setArticles(seedArticles));
  }, []);

  useEffect(() => { setPage(1); setSearch(""); setSuggestions([]); setShowSug(false); }, [tab]);

  useEffect(() => {
    const s = buildSuggestions(search, tab, internalArticles, externalArticles);
    setSuggestions(s);
    setShowSug(search.trim().length >= 2 && s.length > 0);
  }, [search, tab, internalArticles, externalArticles]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchWrap.current && !searchWrap.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const scrollToCard = (id: string) => {
    setTimeout(() => {
      const el = cardRefs.current.get(id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlighted(id);
      setTimeout(() => setHighlighted(null), 2200);
    }, 160);
  };

  const handleSuggestionClick = (s: Suggestion) => {
    setSearch(""); setShowSug(false);
    if (s.tab !== tab) {
      router.push(`/articles?tab=${s.tab}`);
      setTimeout(() => { setPage(s.page); scrollToCard(`${s.tab}-card-${s.index}`); }, 200);
    } else {
      setPage(s.page);
      scrollToCard(`${s.tab}-card-${s.index}`);
    }
  };

  const setCardRef = (id: string) => (el: HTMLDivElement | null) => {
    el ? cardRefs.current.set(id, el) : cardRefs.current.delete(id);
  };

  const q = search.toLowerCase();
  const filteredInternal = internalArticles.filter(a =>
    !q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.body.toLowerCase().includes(q)
  );
  const filteredExternal = externalArticles.filter(a =>
    !q || a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || String(a.source || "").toLowerCase().includes(q) || a.body.toLowerCase().includes(q)
  );

  const activeData = tab === "internal" ? filteredInternal : filteredExternal;
  const totalPages = Math.ceil(activeData.length / CARDS_PER_PAGE);
  const pageData = activeData.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  const sidebarItems = (tab === "internal" ? internalArticles : externalArticles).map((a, i) => ({
    id: `${tab}-card-${i}`,
    label: a.title,
    sub: tab === "external" ? (a as typeof externalArticles[0]).source : undefined,
    page: Math.ceil((i + 1) / CARDS_PER_PAGE),
  }));

  const cardBorder = (id: string): React.CSSProperties => ({
    border: `1px solid ${highlighted === id ? "rgba(255,107,0,0.55)" : "var(--border)"}`,
    boxShadow: highlighted === id
      ? "0 0 0 3px rgba(255,107,0,0.10), 0 8px 28px rgba(0,0,0,0.22)"
      : "0 2px 12px rgba(0,0,0,0.10)",
    transition: "border-color 0.3s, box-shadow 0.3s",
  });

  return (
    <div className="relative min-h-screen" style={{ zIndex: 2 }}>
      {/* Title */}
      <div className="px-8 pb-3 pt-36 md:px-14">
        <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "30px", fontWeight: 700, color: "var(--tx-high)", lineHeight: 1 }}>
          Articles
        </h1>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: "1px solid var(--border)", background: "var(--muted)" }}>
        <div className="px-8 md:px-14 flex">
          {[
            { id: "internal", label: "Internal", Icon: FileText },
            { id: "external", label: "External", Icon: Globe },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => router.push(`/articles?tab=${id}`)}
              className="flex items-center gap-2 px-5 py-3.5 text-sm transition-all"
              style={{
                color: tab === id ? "var(--accent-text)" : "var(--tx-body)",
                borderBottom: `2px solid ${tab === id ? "#FF6B00" : "transparent"}`,
                fontFamily: "Inter, sans-serif",
                fontWeight: tab === id ? 600 : 400,
                marginBottom: -1,
              }}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Doc layout */}
      <div className="flex" style={{ minHeight: "calc(100vh - 220px)" }}>

        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-60 flex-shrink-0 sticky top-32 self-start overflow-y-auto"
          style={{ height: "100vh", borderRight: "1px solid var(--border)", background: "var(--sidebar)", padding: "28px 16px" }}
        >
          <p className="text-sm font-mono tracking-[0.15em] mb-3" style={{ color: "rgba(255,107,0,0.65)" }}>
            {tab === "internal" ? "INTERNAL" : "EXTERNAL"}
          </p>
          <div className="space-y-2.5 mb-6">
            <div className="flex items-center gap-2.5">
              <FileText size={10} style={{ color: "rgba(255,107,0,0.55)", flexShrink: 0 }} />
              <span className="text-sm" style={{ color: "var(--tx-body)", fontFamily: "Inter, sans-serif" }}>
                {tab === "internal" ? `${internalArticles.length} Articles` : `${externalArticles.length} Articles`}
              </span>
            </div>
            {tab === "external" && (
              <div className="flex items-center gap-2.5">
                <Globe size={10} style={{ color: "rgba(255,107,0,0.55)", flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "var(--tx-body)", fontFamily: "Inter, sans-serif" }}>Multiple Sources</span>
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", marginBottom: "20px" }} />

          <p className="text-sm font-mono tracking-[0.15em] mb-3" style={{ color: "rgba(255,107,0,0.65)" }}>ON THIS PAGE</p>
          <div className="space-y-0.5">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setPage(item.page); scrollToCard(item.id); }}
                className="block w-full text-left px-2.5 py-1.5 rounded-lg leading-snug transition-all"
                style={{ fontSize: "14px", color: "var(--tx-body)", fontFamily: "Inter, sans-serif" }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-chip)"; e.currentTarget.style.color = "var(--tx-high)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--tx-body)"; }}
              >
                <span className="block truncate">{item.label}</span>
                {item.sub && <span className="text-sm font-mono" style={{ color: "rgba(255,107,0,0.50)" }}>{item.sub}</span>}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 py-8 px-6 md:px-10">

          {/* Search */}
          <div className="max-w-2xl mb-7" ref={searchWrap}>
            <div className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--tx-dim)" }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                onFocus={() => search.trim().length >= 2 && setShowSug(true)}
                placeholder={tab === "internal" ? "Search internal articles…" : "Search external sources, articles…"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--foreground)", fontFamily: "Inter, sans-serif", transition: "border-color 0.2s" }}
                onFocusCapture={e => { (e.target as HTMLInputElement).style.borderColor = "rgba(255,107,0,0.40)"; }}
                onBlurCapture={e => { (e.target as HTMLInputElement).style.borderColor = "var(--bg-input-border)"; }}
              />
              <AnimatePresence>
                {showSug && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.13 }}
                    className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50"
                    style={{ background: "var(--bg-select)", border: "1px solid var(--border)", boxShadow: "0 16px 48px rgba(0,0,0,0.45)" }}
                  >
                    {suggestions.map((s, si) => (
                      <button
                        key={s.id}
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                        style={{ borderBottom: si < suggestions.length - 1 ? "1px solid var(--border)" : "none" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "var(--bg-chip)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                      >
                        <span className="text-sm font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: tab === "internal" ? "rgba(255,107,0,0.12)" : "rgba(110,180,255,0.10)", color: tab === "internal" ? "var(--accent-text)" : "#88BBFF" }}>
                          {tab === "internal" ? "INT" : "EXT"}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block truncate text-sm" style={{ color: "var(--tx-mid)", fontFamily: "Inter, sans-serif" }}>{s.label}</span>
                          {s.sublabel && <span className="text-sm font-mono" style={{ color: "rgba(255,107,0,0.55)" }}>{s.sublabel}</span>}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Count */}
          <div className="flex items-center max-w-2xl mb-5">
            <span className="text-sm" style={{ color: "var(--tx-dim)", fontFamily: "Inter, sans-serif" }}>
              {activeData.length} articles{search ? ` · "${search}"` : ""}
            </span>
          </div>

          {/* Internal cards */}
          {tab === "internal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {(pageData as typeof internalArticles).map((a, i) => {
                const idx = (page - 1) * CARDS_PER_PAGE + i;
                const id = `internal-card-${idx}`;
                return (
                  <motion.div
                    key={id}
                    ref={setCardRef(id)}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl overflow-hidden cursor-pointer group"
                    style={{ background: "var(--glass-bg)", ...cardBorder(id) }}
                    onClick={() => router.push(`/articles/${a.id}`)}
                    onMouseEnter={e => { if (highlighted !== id) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,0,0.28)"; }}
                    onMouseLeave={e => { if (highlighted !== id) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                  >
                    <div className="h-40 p-3" style={{ background: "var(--muted)" }}><img src={coverImage(a)} alt="" className="h-full w-full object-cover" /></div>
                    <div className="px-5 pt-5 pb-4" style={{ background: "rgba(255,107,0,0.04)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ background: "rgba(255,107,0,0.12)", color: "var(--accent-text)", border: "1px solid rgba(255,107,0,0.22)" }}>
                          {a.category}
                        </span>
                        <span className="text-sm font-mono" style={{ color: "var(--tx-faint)" }}>{a.read} read</span>
                      </div>
                      <h3 className="font-bold leading-tight transition-colors group-hover:text-orange-400" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", color: "var(--tx-high)" }}>
                        {a.title}
                      </h3>
                    </div>
                    <div className="px-5 pt-4 pb-5">
                      <p style={{ fontSize: "14px", color: "var(--tx-mid)", fontFamily: "Inter, sans-serif", lineHeight: "1.7", ...clampStyle }}>
                        {a.excerpt || a.body.split("\n\n")[0]}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setModal({ title: a.title, subtitle: `${a.category} · ${a.date}`, body: a.body }); }}
                        className="mt-2.5 flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: "var(--accent-text)", fontFamily: "Inter, sans-serif" }}
                      >
                        <ChevronDown size={11} /> See more
                      </button>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-sm font-mono" style={{ color: "var(--tx-faint)" }}>{a.date}</p>
                          <ViewCount count={a.viewCount} />
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold transition-opacity opacity-0 group-hover:opacity-100" style={{ color: "var(--accent-text)" }}>
                          Read article <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* External cards */}
          {tab === "external" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {(pageData as typeof externalArticles).map((a, i) => {
                const idx = (page - 1) * CARDS_PER_PAGE + i;
                const id = `external-card-${idx}`;
                return (
                  <motion.div
                    key={id}
                    ref={setCardRef(id)}
                    initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="rounded-2xl overflow-hidden cursor-pointer group"
                    style={{ background: "var(--glass-bg)", ...cardBorder(id) }}
                    onClick={() => router.push(`/articles/${a.id}?from=external`)}
                    onMouseEnter={e => { if (highlighted !== id) (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,107,0,0.28)"; }}
                    onMouseLeave={e => { if (highlighted !== id) (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                  >
                    <div className="h-40 p-3" style={{ background: "var(--muted)" }}><img src={coverImage(a)} alt="" className="h-full w-full object-cover" /></div>
                    <div className="px-5 pt-5 pb-4" style={{ background: "rgba(110,180,255,0.04)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono px-2 py-0.5 rounded" style={{ background: "var(--bg-chip)", color: "var(--tx-mid)", border: "1px solid var(--bg-chip-border)" }}>
                            {a.category}
                          </span>
                          <span className="text-sm font-mono" style={{ color: "rgba(255,107,0,0.55)" }}>{a.source}</span>
                        </div>
                        <ExternalLink size={12} style={{ color: "var(--tx-faint)" }} />
                      </div>
                      <h3 className="font-bold leading-tight transition-colors group-hover:text-orange-400" style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", color: "var(--tx-high)" }}>
                        {a.title}
                      </h3>
                    </div>
                    <div className="px-5 pt-4 pb-5">
                      <p style={{ fontSize: "14px", color: "var(--tx-mid)", fontFamily: "Inter, sans-serif", lineHeight: "1.7", ...clampStyle }}>
                        {a.excerpt || a.body.split("\n\n")[0]}
                      </p>
                      <button
                        onClick={e => { e.stopPropagation(); setModal({ title: a.title, subtitle: `${a.source} · ${a.date}`, body: a.body }); }}
                        className="mt-2.5 flex items-center gap-1 text-sm font-medium hover:opacity-70 transition-opacity"
                        style={{ color: "var(--accent-text)", fontFamily: "Inter, sans-serif" }}
                      >
                        <ChevronDown size={11} /> See more
                      </button>
                      <div className="mt-3 flex flex-wrap items-center gap-3"><p className="text-sm font-mono" style={{ color: "var(--tx-faint)" }}>{a.date} · {a.read} read</p><ViewCount count={a.viewCount} /></div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pb-16">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg transition-all disabled:opacity-25"
                style={{ background: "var(--bg-chip)", border: "1px solid var(--border)", color: "var(--tx-body)" }}
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n} onClick={() => setPage(n)}
                  className="w-8 h-8 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: n === page ? "rgba(255,107,0,0.14)" : "var(--bg-chip)",
                    border: `1px solid ${n === page ? "rgba(255,107,0,0.42)" : "var(--border)"}`,
                    color: n === page ? "var(--accent-text)" : "var(--tx-body)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >{n}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg transition-all disabled:opacity-25"
                style={{ background: "var(--bg-chip)", border: "1px solid var(--border)", color: "var(--tx-body)" }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "var(--bg-overlay)", backdropFilter: "blur(6px)" }}
            onClick={() => setModal(null)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl p-7"
              style={{ background: "var(--card)", border: "1px solid var(--border)", maxHeight: "78vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.45)" }}
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.94, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 16 }} transition={{ duration: 0.18 }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold leading-snug mb-1" style={{ color: "var(--tx-high)", fontFamily: "Rajdhani, sans-serif", fontSize: "18px" }}>{modal.title}</h3>
                  {modal.subtitle && <p className="text-sm font-mono" style={{ color: "rgba(255,107,0,0.65)" }}>{modal.subtitle}</p>}
                </div>
                <button
                  onClick={() => setModal(null)}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                  style={{ color: "var(--tx-dim)", background: "var(--bg-chip)", border: "1px solid var(--border)" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,107,0,0.10)"; e.currentTarget.style.color = "var(--accent-text)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-chip)"; e.currentTarget.style.color = "var(--tx-dim)"; }}
                >
                  <X size={15} />
                </button>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", marginBottom: "18px" }} />
              <p className="leading-relaxed whitespace-pre-line" style={{ fontSize: "15px", color: "var(--tx-mid)", fontFamily: "Inter, sans-serif", lineHeight: "1.8" }}>
                {modal.body}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
