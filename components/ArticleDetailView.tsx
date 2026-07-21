"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Clock, ExternalLink } from "lucide-react";
import { ViewCount, ViewTracker } from "@/components/ViewCounts";

interface ArticleData {
  id: string;
  title: string;
  date: string;
  category: string;
  read: string;
  body: string;
  source?: string;
  externalUrl?: string;
  coverImageUrl?: string;
  viewCount: number;
}

interface Props {
  article: ArticleData;
  backUrl: string;
  backLabel?: string;
  viewCollection: "articles" | "aboutArticles";
}

export default function ArticleDetailView({ article, backUrl, backLabel = "BACK", viewCollection }: Props) {
  const router = useRouter();
  const paragraphs = article.body.split("\n\n").filter(Boolean);

  return (
    <div className="relative min-h-screen" style={{ zIndex: 2 }}>
      <div className="max-w-2xl mx-auto px-8 pb-24 pt-36 md:px-10">
        <ViewTracker collection={viewCollection} id={article.id} />

        {/* Back */}
        <button
          onClick={() => router.push(backUrl)}
          className="flex items-center gap-2 text-sm font-mono tracking-widest mb-10 transition-colors"
          style={{ color: "var(--tx-muted)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#FF6B00"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--tx-muted)"; }}
        >
          <ArrowLeft size={12} /> {backLabel}
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-5">
            <span
              className="text-sm font-mono px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,107,0,0.10)", color: "var(--accent-text)", border: "1px solid rgba(255,107,0,0.22)" }}
            >
              {article.category}
            </span>
            {article.source && (
              <span className="text-sm font-mono" style={{ color: "rgba(255,107,0,0.55)" }}>
                {article.source}
              </span>
            )}
          </div>

          <h1
            className="font-bold leading-tight mb-5"
            style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "34px", color: "var(--tx-high)" }}
          >
            {article.title}
          </h1>

          {/^https?:\/\//i.test(article.coverImageUrl || "") && <img src={article.coverImageUrl} alt="" className="mb-7 max-h-96 w-full rounded-lg border object-cover" style={{ borderColor: "var(--border)" }} />}

          <div className="flex items-center gap-4 mb-8" style={{ color: "var(--tx-muted)" }}>
            <span className="flex items-center gap-1.5 text-sm font-mono">
              {article.date}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-mono">
              <Clock size={11} /> {article.read} read
            </span>
            <ViewCount count={article.viewCount} />
          </div>
        </motion.div>

        <div style={{ borderTop: "1px solid var(--border)", marginBottom: "36px" }} />

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: "15px",
                lineHeight: "1.85",
                color: "var(--tx-mid)",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {para}
            </p>
          ))}
        </motion.div>

        {/* External link for sourced articles */}
        {article.source && /^https?:\/\//i.test(article.externalUrl || "") && (
          <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-mono transition-all"
              style={{
                color: "var(--accent-text)",
                border: "1px solid rgba(255,107,0,0.28)",
                background: "rgba(255,107,0,0.06)",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,107,0,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,107,0,0.06)"; }}
            >
              <ExternalLink size={13} /> Read on {article.source}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
