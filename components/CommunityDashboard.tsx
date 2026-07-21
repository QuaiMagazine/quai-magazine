"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, BarChart3, ExternalLink, FileText, HeartHandshake, Info, Library, Plus, RefreshCcw, Route, Save, Settings, Trash2, X } from "lucide-react";
import { seedCommunitySettings, type CmsCommunityFeedback, type CmsCommunitySettings } from "@/lib/cms-content";

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

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-1.5 block text-sm font-medium" style={{ color: "var(--tx-dim)" }}>{label}</span>{children}</label>;
}

export default function CommunityDashboard() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<CmsCommunitySettings>(seedCommunitySettings[0]);
  const [feedback, setFeedback] = useState<CmsCommunityFeedback[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [settingsResponse, feedbackResponse] = await Promise.all([
      fetch("/api/cms/communitySettings", { cache: "no-store" }),
      fetch("/api/cms/communityFeedback", { cache: "no-store" }),
    ]);
    const [settingsData, feedbackData] = await Promise.all([settingsResponse.json(), feedbackResponse.json()]);
    if (Array.isArray(settingsData) && settingsData[0]) setSettings(settingsData[0]);
    setFeedback(Array.isArray(feedbackData) ? feedbackData : []);
  };

  useEffect(() => { load().catch(() => undefined); }, []);

  const saveSettings = async () => {
    setSaving(true);
    setMessage("");
    const response = await fetch(`/api/cms/communitySettings/${settings.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) return setMessage(result.error || "Unable to save community page.");
    setSettings(result);
    setMessage("Community page saved and synced to the public frontend.");
  };

  const updateFeedbackStatus = async (item: CmsCommunityFeedback, status: CmsCommunityFeedback["status"]) => {
    const response = await fetch(`/api/cms/communityFeedback/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, status }) });
    if (!response.ok) return setMessage("Unable to update feedback status.");
    await load();
  };

  const deleteFeedback = async (item: CmsCommunityFeedback) => {
    if (!window.confirm("Delete this feedback submission?")) return;
    const response = await fetch(`/api/cms/communityFeedback/${item.id}`, { method: "DELETE" });
    if (!response.ok) return setMessage("Unable to delete feedback.");
    setMessage("Feedback deleted.");
    await load();
  };

  const updateUpload = (index: number, key: "type" | "title" | "formatHint" | "submissionUrl", value: string) => {
    setSettings((current) => ({ ...current, uploadOptions: current.uploadOptions.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item) }));
  };

  return (
    <main className="relative min-h-screen pt-32" style={{ zIndex: 2, background: "var(--admin-bg)" }}>
      <div className="flex min-h-[calc(100vh-128px)] w-full">
        <aside className="hidden w-64 shrink-0 border-r lg:block" style={{ background: "var(--admin-sidebar)", borderColor: "var(--border)" }}>
          <div className="sticky top-32">
            <div className="border-b px-5 py-5" style={{ borderColor: "var(--border)" }}><p className="text-sm font-mono tracking-[0.22em]" style={{ color: "var(--accent-text)" }}>QUAI ADMIN</p><h2 className="mt-1 text-xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--admin-sidebar-heading)" }}>Dashboard</h2></div>
            <nav className="p-3">{navItems.map(({ href, label, Icon }) => <Link key={href} href={href} className="mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm" style={{ background: pathname === href ? "var(--admin-active-bg)" : "transparent", color: pathname === href ? "var(--admin-active-text)" : "var(--admin-sidebar-text)", borderLeft: `3px solid ${pathname === href ? "var(--admin-active-border)" : "transparent"}` }}><Icon size={16} />{label}</Link>)}</nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="border-b px-5 py-4 md:px-8" style={{ background: "var(--admin-topbar)", borderColor: "var(--border)" }}>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div><h1 className="text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>Community Contribution</h1><p className="text-sm" style={{ color: "var(--tx-dim)" }}>{feedback.length} feedback submission{feedback.length === 1 ? "" : "s"}</p></div>
              <div className="flex flex-wrap gap-2 lg:hidden">{navItems.map(({ href, label }) => <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm" style={{ color: pathname === href ? "var(--accent-text)" : "var(--tx-body)", border: "1px solid var(--border)" }}>{label}</Link>)}</div>
            </div>
          </header>

          <div className="px-5 py-5 md:px-8">
            <div className="mb-5 flex flex-wrap justify-between gap-3 rounded-md border p-3" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <button onClick={() => load().catch(() => setMessage("Refresh failed."))} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}><RefreshCcw size={14} />Refresh</button>
              <div className="flex flex-wrap gap-2"><a href="/community" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}><ExternalLink size={14} />View</a><button onClick={saveSettings} disabled={saving} className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-60" style={{ background: "#FF6B00", color: "#fff" }}><Save size={15} />{saving ? "Saving..." : "Save public page"}</button></div>
            </div>
            {message && <p className="mb-5 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.08)", border: "1px solid rgba(255,107,0,.18)" }}>{message}</p>}

            <section className="mb-6 rounded-md border p-4 md:p-5" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <p className="mb-4 text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>PUBLIC PAGE CONTENT</p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Field label="Page Title"><input value={settings.title} onChange={(event) => setSettings({ ...settings, title: event.target.value })} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                <Field label="Upload Section Heading"><input value={settings.uploadHeading} onChange={(event) => setSettings({ ...settings, uploadHeading: event.target.value })} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                <Field label="Feedback Section Heading"><input value={settings.feedbackHeading} onChange={(event) => setSettings({ ...settings, feedbackHeading: event.target.value })} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                <Field label="Page Subtitle" className="md:col-span-2 xl:col-span-3"><input value={settings.subtitle} onChange={(event) => setSettings({ ...settings, subtitle: event.target.value })} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
                <Field label="Default Submission URL" className="md:col-span-2 xl:col-span-3"><input type="url" value={settings.telegramUrl} onChange={(event) => setSettings({ ...settings, telegramUrl: event.target.value })} className="w-full rounded-md p-3 text-sm outline-none" style={inputStyle} /></Field>
              </div>
            </section>

            <section className="mb-6 rounded-md border p-4 md:p-5" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>CONTRIBUTION TILES</p><button onClick={() => setSettings({ ...settings, uploadOptions: [...settings.uploadOptions, { id: `upload-${Date.now()}`, type: "document", title: "", formatHint: "", submissionUrl: settings.telegramUrl }] })} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}><Plus size={14} />Add tile</button></div>
              <div className="space-y-3">{settings.uploadOptions.map((item, index) => <div key={item.id} className="grid gap-3 rounded-md border p-3 md:grid-cols-2 xl:grid-cols-[150px_1fr_1fr_1.5fr_auto]" style={{ background: "var(--bg-chip)", borderColor: "var(--border)" }}><select value={item.type} onChange={(event) => updateUpload(index, "type", event.target.value)} className="rounded-md p-3 text-sm outline-none" style={inputStyle}><option value="audio">Audio</option><option value="video">Video</option><option value="document">Document</option></select><input value={item.title} onChange={(event) => updateUpload(index, "title", event.target.value)} placeholder="Card title" className="rounded-md p-3 text-sm outline-none" style={inputStyle} /><input value={item.formatHint} onChange={(event) => updateUpload(index, "formatHint", event.target.value)} placeholder="Format hint" className="rounded-md p-3 text-sm outline-none" style={inputStyle} /><input type="url" value={item.submissionUrl} onChange={(event) => updateUpload(index, "submissionUrl", event.target.value)} placeholder="Submission destination" className="rounded-md p-3 text-sm outline-none" style={inputStyle} /><button aria-label="Delete contribution tile" onClick={() => setSettings({ ...settings, uploadOptions: settings.uploadOptions.filter((_, itemIndex) => itemIndex !== index) })} className="justify-self-start rounded-md p-3 xl:justify-self-auto" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={15} /></button></div>)}</div>
            </section>

            <section className="mb-6 rounded-md border p-4 md:p-5" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm font-mono tracking-[0.16em]" style={{ color: "var(--accent-text)" }}>FEEDBACK CATEGORIES</p><button onClick={() => setSettings({ ...settings, feedbackCategories: [...settings.feedbackCategories, ""] })} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}><Plus size={14} />Add category</button></div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{settings.feedbackCategories.map((item, index) => <div key={`${item}-${index}`} className="flex gap-2"><input value={item} onChange={(event) => setSettings({ ...settings, feedbackCategories: settings.feedbackCategories.map((current, itemIndex) => itemIndex === index ? event.target.value : current) })} placeholder="Category name" className="min-w-0 flex-1 rounded-md p-3 text-sm outline-none" style={inputStyle} /><button aria-label="Delete category" onClick={() => setSettings({ ...settings, feedbackCategories: settings.feedbackCategories.filter((_, itemIndex) => itemIndex !== index) })} className="rounded-md p-3" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><X size={15} /></button></div>)}</div>
            </section>

            <section className="overflow-hidden rounded-md border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="border-b px-4 py-3 text-sm font-mono tracking-[0.16em]" style={{ borderColor: "var(--border)", color: "var(--accent-text)" }}>INCOMING FEEDBACK</div>
              {feedback.map((item) => <article key={item.id} className="grid gap-3 border-b p-4 lg:grid-cols-[180px_160px_minmax(0,1fr)_150px_46px] lg:items-start" style={{ borderColor: "var(--border)" }}><div><p className="font-medium" style={{ color: "var(--tx-high)" }}>{item.name}</p><p className="mt-1 text-sm" style={{ color: "var(--tx-dim)" }}>{new Date(item.submittedAt).toLocaleString()}</p></div><span className="text-sm" style={{ color: "var(--tx-body)" }}>{item.category}</span><p className="whitespace-pre-wrap text-sm leading-6" style={{ color: "var(--tx-body)" }}>{item.message}</p><select value={item.status} onChange={(event) => updateFeedbackStatus(item, event.target.value as CmsCommunityFeedback["status"])} className="rounded-md p-2 text-sm outline-none" style={inputStyle}><option value="new">New</option><option value="reviewed">Reviewed</option><option value="archived">Archived</option></select><button aria-label="Delete feedback" onClick={() => deleteFeedback(item)} className="justify-self-start rounded-md p-2 lg:justify-self-auto" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}><Trash2 size={15} /></button></article>)}
              {!feedback.length && <p className="p-8 text-sm" style={{ color: "var(--tx-dim)" }}>No feedback submissions yet.</p>}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
