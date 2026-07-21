"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  ExternalLink,
  Instagram,
  MessageSquare,
  Play,
  Rss,
  Send,
  Share2,
  Twitter,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { parseRawTranscript } from "@/lib/data";
import { seedAmaSessions, type CmsAmaSession } from "@/lib/cms-content";
import { ViewCount, ViewTracker } from "@/components/ViewCounts";

interface Props {
  id: string;
}

type Tab = "raw" | "timeline" | "qa" | "feedback";
type Turn = { id: string; speaker: string; timestamp: string; text: string };
type Question = { q: string; a: string; speaker: string; ts: string };
type TimelineItem = { title: string; text: string; ts: string; targetTerms?: string[] };

function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" fill="currentColor">
      <path d="M12 1.9a10.1 10.1 0 1 0 0 20.2 10.1 10.1 0 0 0 0-20.2Zm4.63 14.6a.63.63 0 0 1-.87.2c-2.37-1.45-5.35-1.78-8.86-.98a.63.63 0 0 1-.28-1.22c3.84-.88 7.15-.5 9.78 1.11.3.18.39.57.2.87h.03Zm1.24-2.75a.8.8 0 0 1-1.1.27c-2.72-1.67-6.87-2.15-10.08-1.17a.8.8 0 1 1-.47-1.53c3.67-1.12 8.23-.57 11.33 1.33.38.23.5.72.26 1.1h.06Zm.1-2.86C14.7 8.94 9.32 8.77 6.2 9.72a.96.96 0 0 1-.56-1.83c3.58-1.09 9.53-.88 13.28 1.34a.96.96 0 1 1-.95 1.66Z" />
    </svg>
  );
}

function clampTextStyle(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  } as CSSProperties;
}

function timecodeToSeconds(value: string) {
  const parts = value.trim().split(":").map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function extractStartTime(value: string) {
  return value.match(/\d{2}:\d{2}:\d{2}/)?.[0] ?? "";
}

function SpeakerTranscript({ turns, activeTurnId }: { turns: Turn[]; activeTurnId: string | null }) {
  return (
    <div
      className="max-h-[620px] space-y-1 overflow-y-auto pr-2 md:pr-3"
      style={{ borderColor: "var(--border)", scrollbarColor: "rgba(255,107,0,.5) transparent" }}
    >
      {turns.map((turn, index) => (
        <motion.div
          id={`transcript-turn-${turn.id}`}
          key={turn.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.02, 0.28) }}
          className="scroll-mt-36 rounded-2xl border px-4 py-4 transition-colors duration-500 md:px-5"
          style={{
            background: activeTurnId === turn.id ? "rgba(255,107,0,0.09)" : "var(--bg-chip)",
            borderColor: activeTurnId === turn.id ? "rgba(255,107,0,0.55)" : "var(--border)",
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>
              {turn.timestamp}
            </span>
            <span className="text-sm uppercase tracking-[0.12em]" style={{ color: "var(--tx-dim)" }}>
              {turn.speaker}
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words text-base leading-7" style={{ color: "var(--tx-mid)" }}>
            {turn.text}
          </pre>
        </motion.div>
      ))}
    </div>
  );
}

function TimelinePanel({
  items,
  activeTime,
  onSelect,
}: {
  items: TimelineItem[];
  activeTime: string | null;
  onSelect: (item: TimelineItem) => void;
}) {
  if (!items.length) {
    return (
      <div
        className="rounded-2xl border px-5 py-6 text-sm"
        style={{ background: "var(--bg-chip)", borderColor: "var(--border)", color: "var(--tx-body)" }}
      >
        Timeline data is not available for this episode yet.
      </div>
    );
  }

  return (
    <div className="max-h-[620px] space-y-4 overflow-y-auto pr-2 md:pr-3" style={{ scrollbarColor: "rgba(255,107,0,.5) transparent" }}>
      {items.map((item, index) => {
        const startTime = extractStartTime(item.ts);
        const isActive = activeTime === (startTime || item.ts);

        return (
        <motion.button
          key={`${item.ts}-${item.title}`}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
          className="w-full rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(255,107,0,0.45)]"
          style={{
            background: isActive ? "rgba(255,107,0,0.08)" : "var(--bg-chip)",
            borderColor: isActive ? "rgba(255,107,0,0.35)" : "var(--border)",
          }}
          onClick={() => onSelect(item)}
        >
          <div className="grid gap-4 md:grid-cols-[160px_1fr]">
            <div>
              <div className="text-sm font-mono tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>
                {item.ts}
              </div>
              <div className="mt-2 h-px w-14 bg-[rgba(255,107,0,0.25)]" />
            </div>
            <div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--tx-high)" }}>
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "var(--tx-body)" }}>
              {item.text}
            </p>
          </div>
          </div>
        </motion.button>
        );
      })}
    </div>
  );
}

function ReadingCompanion({
  items,
  activeTime,
  duration,
  onSelect,
}: {
  items: TimelineItem[];
  activeTime: string | null;
  duration: string;
  onSelect: (item: TimelineItem) => void;
}) {
  const activeItem = items.find((item) => activeTime === (extractStartTime(item.ts) || item.ts));
  const waveformHeights = [35, 62, 45, 78, 54, 90, 48, 70, 38, 76, 58, 88, 46, 64, 41, 72, 52, 85];

  return (
    <div className="overflow-hidden rounded-[22px] border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
      <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "rgba(255,107,0,.12)", color: "var(--accent-text)" }}>
          <Clock3 size={17} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--tx-high)" }}>Reading companion</p>
          <p className="text-sm" style={{ color: "var(--tx-dim)" }}>{activeItem?.title || "Chapters"}</p>
        </div>
      </div>
      <div className="border-b px-5 py-3" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--tx-dim)" }}>CURRENT TIME</span>
          <span className="rounded-full px-2.5 py-1 text-sm font-mono" style={{ background: "rgba(255,107,0,.1)", color: "var(--accent-text)" }}>{activeTime || "00:00:00"}</span>
        </div>
      </div>
      <div className="border-b px-5 py-4" style={{ borderColor: "var(--border)" }}>
        <div className="flex h-10 items-end gap-1" aria-label="Episode chapter graph">
          {waveformHeights.map((height, index) => {
            const itemIndex = items.length ? Math.min(items.length - 1, Math.floor(index * items.length / waveformHeights.length)) : -1;
            const target = items[itemIndex];
            const isActive = target && activeTime === (extractStartTime(target.ts) || target.ts);
            return (
              <button
                key={index}
                type="button"
                disabled={!target}
                title={target?.title}
                aria-label={target ? `Jump to ${target.title}` : undefined}
                onClick={() => target && onSelect(target)}
                className="flex h-full flex-1 items-end disabled:cursor-default"
              >
                <span className="w-full rounded-full transition-colors" style={{ height: `${height}%`, background: isActive ? "#FF6B00" : index < waveformHeights.length / 2 ? "rgba(255,107,0,.90)" : "rgba(255,107,0,.28)" }} />
              </button>
            );
          })}
        </div>
      </div>
      <div className="max-h-[360px] space-y-1 overflow-y-auto p-2" style={{ scrollbarColor: "rgba(255,107,0,.5) transparent" }}>
        {items.map((item) => {
          const itemTime = extractStartTime(item.ts) || item.ts;
          const isActive = activeTime === itemTime;
          return (
            <button
              key={`${item.ts}-${item.title}`}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
              style={{ background: isActive ? "rgba(255,107,0,.10)" : "transparent", color: isActive ? "var(--accent-text)" : "var(--tx-body)" }}
            >
              <span className="shrink-0 text-sm font-mono" style={{ color: isActive ? "var(--accent-text)" : "var(--tx-dim)" }}>{itemTime}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.title}</span>
              <ChevronRight size={15} className="shrink-0" aria-hidden="true" />
            </button>
          );
        })}
        {!items.length && <p className="px-3 py-4 text-sm" style={{ color: "var(--tx-dim)" }}>No chapters available.</p>}
      </div>
      <div className="flex justify-end border-t px-5 py-3 text-sm" style={{ borderColor: "var(--border)", color: "var(--tx-dim)" }}>{duration}</div>
    </div>
  );
}

function QuestionAnswers({ questions }: { questions: Question[] }) {
  if (!questions.length) {
    return <p className="rounded-2xl border px-5 py-6 text-sm" style={{ background: "var(--bg-chip)", borderColor: "var(--border)", color: "var(--tx-body)" }}>Q&A is not available for this episode yet.</p>;
  }

  return (
    <div className="max-h-[620px] space-y-4 overflow-y-auto pr-2 md:pr-3" style={{ scrollbarColor: "rgba(255,107,0,.5) transparent" }}>
      {questions.map((item, index) => (
        <motion.article
          key={item.q}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.035 }}
          className="rounded-2xl border p-5 md:p-6"
          style={{ background: "var(--bg-chip)", borderColor: "var(--border)" }}
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-sm font-mono tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>
              {item.ts}
            </span>
            <span className="text-sm uppercase tracking-[0.12em]" style={{ color: "var(--tx-dim)" }}>
              {item.speaker}
            </span>
          </div>
          <p className="mb-1 text-sm font-mono tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>
            QUESTION
          </p>
          <h3 className="mb-3 text-base font-semibold leading-7" style={{ color: "var(--tx-high)" }}>
            {item.q}
          </h3>
          <p className="mb-1 text-sm font-mono tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>
            ANSWER
          </p>
          <p className="whitespace-pre-line text-sm leading-7" style={{ color: "var(--tx-body)" }}>
            {item.a}
          </p>
        </motion.article>
      ))}
    </div>
  );
}

function Feedback({ sessionId }: { sessionId: string }) {
  const [sent, setSent] = useState(false);
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendFeedback = async () => {
    if (!value.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/cms/amaFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `ama-feedback-${Date.now()}`,
          sessionId,
          message: value.trim(),
          status: "new",
          submittedAt: new Date().toISOString(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to send feedback.");
      setSent(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to send feedback.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl overflow-hidden rounded-2xl border" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--surface-shadow)" }}>
      <div className="flex items-start gap-4 border-b p-6 md:p-7" style={{ borderColor: "var(--border)" }}>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "rgba(255,107,0,.12)", color: "var(--accent-text)" }}><MessageSquare size={18} /></div>
        <div>
          <p className="mb-1 text-sm font-mono tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>COMMUNITY INPUT</p>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>Share your feedback</h3>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--tx-body)" }}>Tell us what was useful or what should be covered next.</p>
        </div>
      </div>
      <div className="p-6 md:p-7">
      {sent ? (
        <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ color: "#79d99a", background: "rgba(60,180,100,.1)" }}>
          <Check size={16} /> Thanks — your feedback has been recorded.
        </div>
      ) : (
        <>
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Write your feedback…"
            className="mb-4 min-h-32 w-full rounded-xl p-4 text-sm leading-6 outline-none transition-colors focus:border-[rgba(255,107,0,.7)]"
            style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" }}
          />
          <button
            onClick={sendFeedback}
            disabled={!value.trim() || sending}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium disabled:cursor-not-allowed"
            style={{ background: "#FF6B00", color: "#fff", opacity: value.trim() && !sending ? 1 : 0.45 }}
          >
            <Send size={14} /> {sending ? "Sending..." : "Send feedback"}
          </button>
          {error && <p className="mt-3 text-sm" style={{ color: "#e15b5b" }}>{error}</p>}
        </>
      )}
      </div>
    </div>
  );
}

export default function TranscriptSessionView({ id }: Props) {
  const router = useRouter();
  const [sessions, setSessions] = useState<CmsAmaSession[]>(seedAmaSessions);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("qa");
  const [notesOpen, setNotesOpen] = useState(false);
  const [syncedTime, setSyncedTime] = useState<string>("00:00:00");
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [trackedViewCount, setTrackedViewCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cms/amaSessions", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => Array.isArray(data) && setSessions(data))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  const session = sessions.find((item) => item.id === id);
  const turns = session ? parseRawTranscript(session.rawTranscript) : [];
  const questions: Question[] = session?.questions.map((item) => ({ q: item.question, a: item.answer, speaker: item.speaker, ts: item.timestamp })) || [];
  const timelineItems: TimelineItem[] = session?.timeline.map((item) => ({
    title: item.title,
    text: item.description,
    ts: item.timestamp,
    targetTerms: item.transcriptTerm ? [item.transcriptTerm] : [],
  })) || [];
  const socialLinks = session ? [
    { label: "X (Twitter)", href: session.xUrl, Icon: Twitter },
    { label: "RSS Feed", href: session.rssUrl, Icon: Rss },
    { label: "Spotify", href: session.spotifyUrl, Icon: SpotifyMark },
    { label: "YouTube", href: session.youtubeUrl, Icon: Youtube },
    { label: "Telegram", href: session.telegramUrl, Icon: Send },
    { label: "Instagram", href: session.instagramUrl, Icon: Instagram },
  ].filter((item) => Boolean(item.href)) : [];

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <button onClick={() => router.push("/transcript")} style={{ color: "var(--accent-text)" }}>
          {loaded ? "Back to episodes" : "Loading episode..."}
        </button>
      </main>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "qa", label: "Q&A" },
    { id: "timeline", label: "Timeline" },
    { id: "raw", label: "RAW Transcript" },
    { id: "feedback", label: "Feedback" },
  ];

  const goToTag = (term: string) => {
    const target = turns.find((turn) => turn.text.toLowerCase().includes(term.toLowerCase()));
    if (!target) return;
    setSyncedTime(target.timestamp);
    setActiveTurnId(target.id);
    setTab("raw");
    window.setTimeout(() => document.getElementById(`transcript-turn-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
  };

  const goToTimelineItem = (item: TimelineItem) => {
    setSyncedTime(extractStartTime(item.ts) || item.ts);
    const matchingTerm = item.targetTerms?.find((term) => turns.some((turn) => turn.text.toLowerCase().includes(term.toLowerCase())));
    const textTarget = matchingTerm
      ? turns.find((turn) => turn.text.toLowerCase().includes(matchingTerm.toLowerCase()))
      : undefined;
    if (textTarget) {
      setActiveTurnId(textTarget.id);
      setTab("raw");
      window.setTimeout(() => document.getElementById(`transcript-turn-${textTarget.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 160);
      return;
    }

    const startTime = extractStartTime(item.ts);
    const seconds = startTime ? timecodeToSeconds(startTime) : null;
    const target = seconds === null
      ? turns.find((turn) => turn.timestamp === startTime)
      : turns
          .map((turn) => ({ turn, seconds: timecodeToSeconds(turn.timestamp) }))
          .filter((entry): entry is { turn: Turn; seconds: number } => entry.seconds !== null)
          .find((entry) => entry.seconds >= seconds)?.turn ?? turns.find((turn) => turn.timestamp === startTime);

    setTab("raw");
    if (!target) return;
    setActiveTurnId(target.id);
    window.setTimeout(() => document.getElementById(`transcript-turn-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 160);
  };

  const descriptionStyle: CSSProperties = {
    ...clampTextStyle(2),
    maxWidth: "56rem",
  };

  return (
    <main className="relative min-h-screen px-5 pb-24 pt-36 md:px-10 xl:px-16 2xl:px-20" style={{ zIndex: 2 }}>
      <ViewTracker collection="amaSessions" id={session.id} onTracked={setTrackedViewCount} />
      <div className="mx-auto max-w-[1720px] space-y-10">
        <div className="w-fit rounded-lg px-2 py-1" style={{ background: "var(--fade-top)" }}>
          <button onClick={() => router.push("/transcript")} className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.14em]" style={{ color: "var(--tx-dim)" }}>
            <ArrowLeft size={14} /> BACK TO EPISODES
          </button>
        </div>

        <section
          className="grid overflow-hidden rounded-[28px] border lg:grid-cols-[1.1fr_0.9fr]"
          style={{ background: "var(--glass-bg)", borderColor: "var(--border)", boxShadow: "0 16px 46px rgba(0,0,0,.18)" }}
        >
          <div className="p-7 md:p-10 lg:p-11">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border px-3 py-1 text-sm font-mono tracking-[0.16em]" style={{ background: "rgba(255,107,0,0.10)", color: "var(--accent-text)", borderColor: "rgba(255,107,0,0.22)" }}>
                  {session.episodeNumber}
                </span>
                <span className="text-sm uppercase tracking-[0.18em]" style={{ color: "var(--tx-dim)" }}>
                  Session Details
                </span>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight md:text-5xl" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>
                  {session.title}
                </h1>
                <p className="text-sm leading-7 md:text-[15px]" style={{ ...descriptionStyle, color: "var(--tx-body)" }}>
                  {session.description}
                </p>
                {(session.episodeNotes || session.description) && (
                  <button
                    type="button"
                    onClick={() => setNotesOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors hover:brightness-125"
                    style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.08)", borderColor: "rgba(255,107,0,.25)" }}
                  >
                    Episode summary <ChevronRight size={14} aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm" style={{ color: "var(--tx-dim)" }}>
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} /> {session.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} /> {session.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={13} /> {session.participants.length} guests
                </span>
                <ViewCount count={trackedViewCount ?? session.viewCount} />
              </div>

              <div>
                <p className="mb-3 text-sm font-mono tracking-[0.18em]" style={{ color: "var(--tx-dim)" }}>
                  JUMP TO A TOPIC
                </p>
                <div className="flex flex-wrap gap-2">
                  {session.tags.map((tag) => (
                    <button
                      key={tag.label}
                      onClick={() => tag.transcriptTerm && goToTag(tag.transcriptTerm)}
                      className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:brightness-125"
                      style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.08)", border: "1px solid rgba(255,107,0,.25)" }}
                    >
                      #{tag.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border p-4" style={{ background: "var(--bg-chip)", borderColor: "var(--bg-chip-border)" }}>
                <div className="mb-3 flex items-center gap-3">
                  {session.audioUrl ? <a href={session.audioUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "#FF6B00", color: "#fff" }}><Play size={14} fill="currentColor" /></a> : <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--bg-chip-border)", color: "var(--tx-dim)" }}><Play size={14} /></span>}
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--tx-high)" }}>
                      Episode audio
                    </p>
                    <p className="text-sm" style={{ color: "var(--tx-dim)" }}>
                      00:00 / {session.duration}
                    </p>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--bg-chip-border)" }}>
                  <div className="h-full w-[5%] rounded-full" style={{ background: "#FF6B00" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-h-[320px] flex-col overflow-hidden" style={{ background: "#171326" }}>
            <div className="relative min-h-[260px] flex-1">
              {session.coverImageUrl && <img src={session.coverImageUrl} alt={`${session.title} episode`} className="absolute inset-0 h-full w-full object-contain" />}
              {session.youtubeUrl && <div className="absolute inset-0 grid place-items-center" style={{ background: "rgba(8,6,20,.25)" }}>
                <a href={session.youtubeUrl} target="_blank" rel="noreferrer" className="grid h-16 w-16 place-items-center rounded-full transition-transform hover:scale-105" style={{ background: "#ff0033", color: "#fff", boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}>
                  <Play size={27} fill="currentColor" />
                </a>
              </div>}
            </div>
            <div className="flex flex-wrap gap-2 border-t p-5" style={{ background: "rgba(5,4,14,.82)", borderColor: "rgba(255,255,255,.12)" }}>
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5"
                  style={{ color: "#fff", background: "rgba(0,0,0,.55)", border: "1px solid rgba(255,255,255,.22)" }}
                >
                  <Icon size={label === "Spotify" ? undefined : 14} /> {label} <ExternalLink size={11} />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex gap-1 overflow-x-auto">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className="whitespace-nowrap px-2.5 py-3 text-sm font-medium sm:px-4 sm:text-sm"
                  style={{
                    color: tab === item.id ? "var(--accent-text)" : "var(--tx-dim)",
                    borderBottom: `2px solid ${tab === item.id ? "#FF6B00" : "transparent"}`,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <Share2 size={16} className="mr-2 hidden sm:block" style={{ color: "var(--tx-dim)" }} />
          </div>

          <div className="mb-6 xl:hidden">
            <ReadingCompanion items={timelineItems} activeTime={syncedTime} duration={session.duration} onSelect={goToTimelineItem} />
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
            <div className="rounded-[24px] border p-5 md:p-6" style={{ background: "var(--bg-chip)", borderColor: "var(--border)" }}>
              {tab === "raw" && <SpeakerTranscript turns={turns} activeTurnId={activeTurnId} />}
              {tab === "timeline" && <TimelinePanel items={timelineItems} activeTime={syncedTime} onSelect={goToTimelineItem} />}
              {tab === "qa" && <QuestionAnswers questions={questions} />}
              {tab === "feedback" && <Feedback sessionId={session.id} />}
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-32">
                <ReadingCompanion items={timelineItems} activeTime={syncedTime} duration={session.duration} onSelect={goToTimelineItem} />
              </div>
            </aside>
          </div>
        </section>
      </div>

      {notesOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/65 p-5"
          role="presentation"
          onMouseDown={() => setNotesOpen(false)}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="episode-notes-title"
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl border p-6 shadow-2xl md:p-8"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setNotesOpen(false)}
              aria-label="Close episode summary"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border"
              style={{ color: "var(--tx-dim)", borderColor: "var(--border)" }}
            >
              <X size={17} />
            </button>
            <p className="mb-3 text-sm font-mono tracking-[0.18em]" style={{ color: "var(--accent-text)" }}>EPISODE SUMMARY</p>
            <h2 id="episode-notes-title" className="pr-10 text-2xl font-bold md:text-3xl" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{session.title}</h2>
            <p className="mt-5 whitespace-pre-line text-base leading-8" style={{ color: "var(--tx-body)" }}>{session.episodeNotes || session.description}</p>
          </motion.section>
        </div>
      )}
    </main>
  );
}
