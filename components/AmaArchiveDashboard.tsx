"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BarChart3,
  Edit3,
  ExternalLink,
  FileText,
  ImagePlus,
  HeartHandshake,
  Info,
  Library,
  ListPlus,
  MessageCircleQuestion,
  Plus,
  RefreshCcw,
  Route,
  Save,
  Settings,
  Tags,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { seedAmaSessions, type CmsAmaFeedback, type CmsAmaSession } from "@/lib/cms-content";

const navItems = [
  { href: "/dashboard/articles", label: "Articles", Icon: FileText },
  { href: "/dashboard/media", label: "Media", Icon: Library },
  { href: "/dashboard/timeline", label: "Timeline", Icon: Route },
  { href: "/dashboard/ama-archive", label: "AMA Archive", Icon: Archive },
  { href: "/dashboard/community", label: "Community", Icon: HeartHandshake },
  { href: "/dashboard/about", label: "About", Icon: Info },
  { href: "/dashboard/about/network", label: "Network Stats", Icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", Icon: Settings },
];

const inputStyle = { background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" };

function emptySession(): CmsAmaSession {
  return {
    id: `ama-${new Date().toISOString().slice(0, 10)}`,
    episodeNumber: "Episode 01",
    title: "",
    date: "",
    time: "AMA · X Space",
    duration: "",
    description: "",
    episodeNotes: "",
    participants: [],
    coverImageUrl: "",
    audioUrl: "",
    youtubeUrl: "",
    spotifyUrl: "",
    rssUrl: "",
    xUrl: "",
    telegramUrl: "",
    instagramUrl: "",
    tags: [],
    rawTranscript: "",
    questions: [],
    timeline: [],
    viewCount: 0,
  };
}

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-medium" style={{ color: "var(--tx-dim)" }}>{label}</span>{children}</label>;
}

export default function AmaArchiveDashboard() {
  const pathname = usePathname();
  const [items, setItems] = useState<CmsAmaSession[]>(seedAmaSessions);
  const [feedback, setFeedback] = useState<CmsAmaFeedback[]>([]);
  const [form, setForm] = useState<CmsAmaSession | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [sessionsResponse, feedbackResponse] = await Promise.all([
      fetch("/api/cms/amaSessions", { cache: "no-store" }),
      fetch("/api/cms/amaFeedback", { cache: "no-store" }),
    ]);
    const [sessionsData, feedbackData] = await Promise.all([
      sessionsResponse.json(),
      feedbackResponse.json(),
    ]);
    setItems(Array.isArray(sessionsData) ? sessionsData : seedAmaSessions);
    setFeedback(Array.isArray(feedbackData) ? feedbackData : []);
  };

  useEffect(() => {
    load().catch(() => setItems(seedAmaSessions));
  }, []);

  const update = <Key extends keyof CmsAmaSession>(key: Key, value: CmsAmaSession[Key]) => {
    setForm((current) => current ? { ...current, [key]: value } : current);
  };

  const uploadFile = async (key: "coverImageUrl" | "audioUrl", file?: File, label = "File") => {
    if (!file) return;
    setUploading(true);
    setMessage("");
    const data = new FormData();
    data.append("file", file);
    try {
      const response = await fetch("/api/uploads", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `${label} upload failed.`);
      update(key, result.url);
      setMessage(`${label} uploaded. Save the episode to publish it.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${label} upload failed.`);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setMessage("");
    const existing = items.some((item) => item.id === form.id);
    const response = await fetch(existing ? `/api/cms/amaSessions/${form.id}` : "/api/cms/amaSessions", {
      method: existing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setMessage(result.error || "Save failed. Check the required episode fields.");
      return;
    }
    setForm(null);
    setMessage("Episode saved and synced to the public AMA archive.");
    await load();
  };

  const remove = async (session: CmsAmaSession) => {
    if (!window.confirm(`Delete “${session.title}”?`)) return;
    const response = await fetch(`/api/cms/amaSessions/${session.id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Delete failed.");
      return;
    }
    if (form?.id === session.id) setForm(null);
    setMessage("Episode deleted from the public archive.");
    await load();
  };

  const updateFeedbackStatus = async (item: CmsAmaFeedback, status: CmsAmaFeedback["status"]) => {
    const response = await fetch(`/api/cms/amaFeedback/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, status }),
    });
    if (!response.ok) return setMessage("Unable to update feedback status.");
    await load();
  };

  const deleteFeedback = async (item: CmsAmaFeedback) => {
    if (!window.confirm("Delete this AMA feedback submission?")) return;
    const response = await fetch(`/api/cms/amaFeedback/${item.id}`, { method: "DELETE" });
    if (!response.ok) return setMessage("Unable to delete feedback.");
    setMessage("AMA feedback deleted.");
    await load();
  };

  const updateQuestion = (index: number, key: "question" | "answer" | "speaker" | "timestamp", value: string) => {
    setForm((current) => current ? { ...current, questions: current.questions.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) } : current);
  };
  const updateTag = (index: number, key: "label" | "transcriptTerm", value: string) => {
    setForm((current) => current ? { ...current, tags: current.tags.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) } : current);
  };
  const updateTimeline = (index: number, key: "title" | "description" | "timestamp" | "transcriptTerm", value: string) => {
    setForm((current) => current ? { ...current, timeline: current.timeline.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) } : current);
  };

  return (
    <main className="relative min-h-screen pt-32" style={{ zIndex: 2, background: "var(--admin-bg)" }}>
      <div className="flex min-h-[calc(100vh-128px)] w-full">
        <aside className="hidden w-64 shrink-0 border-r lg:block" style={{ background: "var(--admin-sidebar)", borderColor: "var(--border)" }}>
          <div className="sticky top-32">
            <div className="border-b px-5 py-5" style={{ borderColor: "var(--border)" }}>
              <p className="text-sm font-mono tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>QUAI ADMIN</p>
              <h2 className="mt-1 text-xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--admin-sidebar-heading)" }}>Dashboard</h2>
            </div>
            <nav className="p-3">
              {navItems.map(({ href, label, Icon }) => <Link key={href} href={href} className="mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors" style={{ background: pathname === href ? "var(--admin-active-bg)" : "transparent", color: pathname === href ? "var(--admin-active-text)" : "var(--admin-sidebar-text)", borderLeft: `3px solid ${pathname === href ? "var(--admin-active-border)" : "transparent"}` }}><Icon size={16} />{label}</Link>)}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="border-b px-5 py-4 md:px-8" style={{ background: "var(--admin-topbar)", borderColor: "var(--border)" }}>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>Quai Network AMA Archive</h1>
                <p className="text-sm" style={{ color: "var(--tx-dim)" }}>{items.length} public episode{items.length === 1 ? "" : "s"} · {feedback.length} feedback submission{feedback.length === 1 ? "" : "s"}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:hidden">
                {navItems.map(({ href, label }) => <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm" style={{ color: pathname === href ? "var(--accent-text)" : "var(--tx-body)", border: "1px solid var(--border)" }}>{label}</Link>)}
              </div>
            </div>
          </header>

          <div className="px-5 py-5 md:px-8">
            <div className="mb-5 flex flex-wrap justify-between gap-3 rounded-md border p-3" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <button onClick={() => load().catch(() => setMessage("Refresh failed."))} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}><RefreshCcw size={14} />Refresh</button>
              <button onClick={() => { setForm(emptySession()); setMessage(""); }} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "#FF6B00", color: "#fff" }}><Plus size={15} />Add AMA episode</button>
            </div>

            {message && <p className="mb-5 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.08)", border: "1px solid rgba(255,107,0,.18)" }}>{message}</p>}

            {form && <section className="mb-6 overflow-hidden rounded-md border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between border-b px-4 py-3 md:px-5" style={{ borderColor: "var(--border)" }}>
                <div><h2 className="text-2xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{items.some((item) => item.id === form.id) ? "Edit AMA episode" : "Add AMA episode"}</h2><p className="text-sm" style={{ color: "var(--tx-dim)" }}>Every saved field is rendered by the public archive and episode page.</p></div>
                <button aria-label="Close editor" onClick={() => setForm(null)} className="rounded-md p-2" style={{ color: "var(--tx-dim)", border: "1px solid var(--border)" }}><X size={16} /></button>
              </div>

              <div className="space-y-8 p-4 md:p-5">
                <div>
                  <p className="mb-3 text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>EPISODE DETAILS</p>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Episode ID"><input value={form.id} onChange={(event) => update("id", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Episode Number"><input value={form.episodeNumber} onChange={(event) => update("episodeNumber", event.target.value)} placeholder="Episode 01" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Duration"><input value={form.duration} onChange={(event) => update("duration", event.target.value)} placeholder="e.g. 48:12" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Title" className="md:col-span-2 xl:col-span-3"><input value={form.title} onChange={(event) => update("title", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Publish Date"><input value={form.date} onChange={(event) => update("date", event.target.value)} placeholder="e.g. Aug 13, 2025" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Session Label"><input value={form.time} onChange={(event) => update("time", event.target.value)} placeholder="AMA · X Space" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Participants"><input value={form.participants.join(", ")} onChange={(event) => update("participants", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="Matt, Dr. K, Jonathan" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Archive Card Description" className="md:col-span-2 xl:col-span-3"><textarea value={form.description} onChange={(event) => update("description", event.target.value)} className="min-h-28 w-full rounded-md p-3 text-sm leading-6 outline-none" style={inputStyle} /></Field>
                    <Field label="Episode Notes" className="md:col-span-2 xl:col-span-3"><textarea value={form.episodeNotes} onChange={(event) => update("episodeNotes", event.target.value)} className="min-h-32 w-full rounded-md p-3 text-sm leading-6 outline-none" style={inputStyle} /></Field>
                  </div>
                </div>

                <div className="border-t pt-7" style={{ borderColor: "var(--border)" }}>
                  <p className="mb-3 text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>COVER AND LISTENING LINKS</p>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Cover Image" className="md:col-span-2 xl:col-span-3"><div className="rounded-md border p-3" style={inputStyle}><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={uploading} onChange={(event) => uploadFile("coverImageUrl", event.target.files?.[0], "Cover")} className="block w-full text-sm" style={{ color: "var(--tx-body)" }} />{uploading && <span className="mt-2 inline-flex items-center gap-2 text-sm" style={{ color: "var(--accent-text)" }}><Upload size={14} />Uploading cover...</span>}{form.coverImageUrl && <div className="mt-3 flex items-center gap-3"><img src={form.coverImageUrl} alt="Selected cover" className="h-14 w-24 rounded object-contain" style={{ background: "var(--muted)" }} /><span className="truncate text-sm" style={{ color: "var(--tx-dim)" }}>Cover attached</span></div>}</div></Field>
                    <Field label="Episode Audio File"><div className="rounded-md border p-3" style={inputStyle}><input type="file" accept="audio/*" disabled={uploading} onChange={(event) => uploadFile("audioUrl", event.target.files?.[0], "Audio")} className="block w-full text-sm" style={{ color: "var(--tx-body)" }} />{uploading && <span className="mt-2 inline-flex items-center gap-2 text-sm" style={{ color: "var(--accent-text)" }}><Upload size={14} />Uploading audio...</span>}{form.audioUrl && <span className="mt-2 block truncate text-sm" style={{ color: "var(--tx-dim)" }}>Audio file attached</span>}</div></Field>
                    <Field label="YouTube URL"><input type="url" value={form.youtubeUrl} onChange={(event) => update("youtubeUrl", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Spotify URL"><input type="url" value={form.spotifyUrl} onChange={(event) => update("spotifyUrl", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="X (Twitter) URL"><input type="url" value={form.xUrl} onChange={(event) => update("xUrl", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="RSS Feed URL"><input type="url" value={form.rssUrl} onChange={(event) => update("rssUrl", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Telegram URL"><input type="url" value={form.telegramUrl} onChange={(event) => update("telegramUrl", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                    <Field label="Instagram URL"><input type="url" value={form.instagramUrl} onChange={(event) => update("instagramUrl", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                  </div>
                </div>

                <div className="border-t pt-7" style={{ borderColor: "var(--border)" }}>
                  <div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>TOPIC TAGS</p><button onClick={() => update("tags", [...form.tags, { id: `tag-${Date.now()}`, label: "", transcriptTerm: "" }])} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}><Tags size={14} />Add tag</button></div>
                  <div className="space-y-3">{form.tags.map((tag, index) => <div key={tag.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-[1fr_1fr_auto]" style={{ background: "var(--bg-chip)", borderColor: "var(--border)" }}><input value={tag.label} onChange={(event) => updateTag(index, "label", event.target.value)} placeholder="Tag label" className="rounded-md p-3 text-sm outline-none" style={inputStyle} /><input value={tag.transcriptTerm} onChange={(event) => updateTag(index, "transcriptTerm", event.target.value)} placeholder="Exact phrase from the raw transcript" className="rounded-md p-3 text-sm outline-none" style={inputStyle} /><button aria-label="Delete tag" onClick={() => update("tags", form.tags.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-md p-3 md:justify-self-auto" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={15} /></button></div>)}{!form.tags.length && <p className="text-sm" style={{ color: "var(--tx-dim)" }}>No topic tags yet.</p>}</div>
                </div>

                <div className="border-t pt-7" style={{ borderColor: "var(--border)" }}>
                  <div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>Q&A</p><button onClick={() => update("questions", [...form.questions, { id: `question-${Date.now()}`, question: "", answer: "", speaker: "", timestamp: "" }])} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}><MessageCircleQuestion size={14} />Add Q&A</button></div>
                  <div className="space-y-4">{form.questions.map((question, index) => <article key={question.id} className="rounded-md border p-4" style={{ background: "var(--bg-chip)", borderColor: "var(--border)" }}><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold" style={{ color: "var(--tx-high)" }}>Q&A {String(index + 1).padStart(2, "0")}</span><button aria-label="Delete Q&A" onClick={() => update("questions", form.questions.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md p-2" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={15} /></button></div><div className="grid gap-3 md:grid-cols-2"><Field label="Speaker"><input value={question.speaker} onChange={(event) => updateQuestion(index, "speaker", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field><Field label="Timestamp"><input value={question.timestamp} onChange={(event) => updateQuestion(index, "timestamp", event.target.value)} placeholder="00:12:34" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field><Field label="Question" className="md:col-span-2"><textarea value={question.question} onChange={(event) => updateQuestion(index, "question", event.target.value)} className="min-h-24 w-full rounded-md p-3 text-sm leading-6 outline-none" style={inputStyle} /></Field><Field label="Answer" className="md:col-span-2"><textarea value={question.answer} onChange={(event) => updateQuestion(index, "answer", event.target.value)} className="min-h-32 w-full rounded-md p-3 text-sm leading-6 outline-none" style={inputStyle} /></Field></div></article>)}{!form.questions.length && <p className="text-sm" style={{ color: "var(--tx-dim)" }}>No Q&A items yet.</p>}</div>
                </div>

                <div className="border-t pt-7" style={{ borderColor: "var(--border)" }}>
                  <div className="mb-3 flex items-center justify-between gap-3"><p className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>TIMELINE</p><button onClick={() => update("timeline", [...form.timeline, { id: `timeline-${Date.now()}`, title: "", description: "", timestamp: "", transcriptTerm: "" }])} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}><ListPlus size={14} />Add chapter</button></div>
                  <div className="space-y-4">{form.timeline.map((item, index) => <article key={item.id} className="rounded-md border p-4" style={{ background: "var(--bg-chip)", borderColor: "var(--border)" }}><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold" style={{ color: "var(--tx-high)" }}>Timeline chapter {String(index + 1).padStart(2, "0")}</span><button aria-label="Delete timeline chapter" onClick={() => update("timeline", form.timeline.filter((_, itemIndex) => itemIndex !== index))} className="rounded-md p-2" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={15} /></button></div><div className="grid gap-3 md:grid-cols-2"><Field label="Title"><input value={item.title} onChange={(event) => updateTimeline(index, "title", event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field><Field label="Start Timestamp"><input value={item.timestamp} onChange={(event) => updateTimeline(index, "timestamp", event.target.value)} placeholder="00:12:34 – 00:18:20" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field><Field label="Exact Transcript Phrase" className="md:col-span-2"><input value={item.transcriptTerm} onChange={(event) => updateTimeline(index, "transcriptTerm", event.target.value)} placeholder="Text from the raw transcript at this chapter" className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field><Field label="Description" className="md:col-span-2"><textarea value={item.description} onChange={(event) => updateTimeline(index, "description", event.target.value)} className="min-h-28 w-full rounded-md p-3 text-sm leading-6 outline-none" style={inputStyle} /></Field></div></article>)}{!form.timeline.length && <p className="text-sm" style={{ color: "var(--tx-dim)" }}>No timeline chapters yet.</p>}</div>
                </div>

                <div className="border-t pt-7" style={{ borderColor: "var(--border)" }}>
                  <p className="mb-3 text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>RAW TRANSCRIPT</p>
                  <textarea value={form.rawTranscript} onChange={(event) => update("rawTranscript", event.target.value)} placeholder="Paste the complete transcript with timestamps and speakers." className="min-h-[420px] w-full rounded-md p-4 font-mono text-sm leading-6 outline-none" style={inputStyle} />
                </div>
              </div>
              <div className="flex justify-end border-t px-4 py-3 md:px-5" style={{ borderColor: "var(--border)" }}><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold disabled:opacity-60" style={{ background: "#FF6B00", color: "#fff" }}><Save size={15} />{saving ? "Saving..." : "Save and publish"}</button></div>
            </section>}

            <section className="overflow-hidden rounded-md border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="hidden grid-cols-[minmax(240px,1fr)_150px_130px_250px] border-b px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] md:grid" style={{ borderColor: "var(--border)", color: "var(--tx-dim)" }}><span>Episode</span><span>Date</span><span>Content</span><span className="text-right">Actions</span></div>
              {items.map((item) => <div key={item.id} className="grid gap-3 border-b px-4 py-4 text-sm md:grid-cols-[minmax(240px,1fr)_150px_130px_250px] md:items-center" style={{ borderColor: "var(--border)" }}><div className="flex min-w-0 items-center gap-3">{item.coverImageUrl ? <img src={item.coverImageUrl} alt="" className="h-12 w-16 shrink-0 rounded object-contain" style={{ background: "var(--muted)" }} /> : <span className="grid h-12 w-16 shrink-0 place-items-center rounded" style={{ background: "var(--muted)", color: "var(--tx-dim)" }}><ImagePlus size={17} /></span>}<div className="min-w-0"><p className="truncate font-medium" style={{ color: "var(--tx-high)" }}>{item.title || "Untitled episode"}</p><p className="truncate text-sm" style={{ color: "var(--tx-dim)" }}>{item.episodeNumber} · {item.id}</p></div></div><span style={{ color: "var(--tx-body)" }}>{item.date || "Unscheduled"}</span><div><span className="block" style={{ color: "var(--tx-dim)" }}>{item.questions.length} Q&A · {item.timeline.length} chapters</span><span className="mt-1 block text-sm" style={{ color: "var(--accent-text)" }}>{item.viewCount} views</span></div><div className="flex flex-wrap gap-2 md:justify-end"><a href={`/transcript/session/${item.id}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}><ExternalLink size={13} />View</a><button onClick={() => { setForm(item); setMessage(""); }} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}><Edit3 size={13} />Edit</button><button onClick={() => remove(item)} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={13} />Delete</button></div></div>)}
              {!items.length && <p className="p-8 text-sm" style={{ color: "var(--tx-dim)" }}>No AMA episodes found.</p>}
            </section>

            <section className="mt-6 overflow-hidden rounded-md border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}><p className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>AMA USER FEEDBACK</p><span className="text-sm" style={{ color: "var(--tx-dim)" }}>{feedback.length} total</span></div>
              {feedback.map((item) => {
                const episode = items.find((session) => session.id === item.sessionId);
                return <article key={item.id} className="grid gap-3 border-b p-4 lg:grid-cols-[190px_minmax(0,1fr)_150px_116px_46px] lg:items-start" style={{ borderColor: "var(--border)" }}><div><p className="truncate font-medium" style={{ color: "var(--tx-high)" }}>{episode?.title || item.sessionId}</p><p className="mt-1 text-sm" style={{ color: "var(--tx-dim)" }}>{new Date(item.submittedAt).toLocaleString()}</p></div><p className="whitespace-pre-wrap text-sm leading-6" style={{ color: "var(--tx-body)" }}>{item.message}</p><select value={item.status} onChange={(event) => updateFeedbackStatus(item, event.target.value as CmsAmaFeedback["status"])} className="rounded-md p-2 text-sm outline-none" style={inputStyle}><option value="new">New</option><option value="reviewed">Reviewed</option><option value="archived">Archived</option></select><a href={`/transcript/session/${item.sessionId}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-1 rounded-md px-2.5 py-2 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}><ExternalLink size={13} />View</a><button aria-label="Delete AMA feedback" onClick={() => deleteFeedback(item)} className="justify-self-start rounded-md p-2 lg:justify-self-auto" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={15} /></button></article>;
              })}
              {!feedback.length && <p className="p-8 text-sm" style={{ color: "var(--tx-dim)" }}>No AMA feedback submissions yet.</p>}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
