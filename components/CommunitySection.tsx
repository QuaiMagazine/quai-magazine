"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, FileText, Mic, Send, Upload, Video } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { seedCommunitySettings, type CmsCommunitySettings } from "@/lib/cms-content";
import { glass, orangeGlow } from "@/lib/styles";

function UploadIcon({ type }: { type: "audio" | "video" | "document" }) {
  if (type === "audio") return <Mic size={28} style={{ color: "#FF6B00" }} />;
  if (type === "video") return <Video size={28} style={{ color: "#FF6B00" }} />;
  return <FileText size={28} style={{ color: "#FF6B00" }} />;
}

export default function CommunitySection() {
  const [settings, setSettings] = useState<CmsCommunitySettings>(seedCommunitySettings[0]);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState(seedCommunitySettings[0].feedbackCategories[0]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cms/communitySettings", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (!Array.isArray(data) || !data[0]) return;
        setSettings(data[0]);
        setCategory(data[0].feedbackCategories[0] || "Other");
      })
      .catch(() => undefined);
  }, []);

  const submitFeedback = async () => {
    if (!feedback.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch("/api/cms/communityFeedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `feedback-${Date.now()}`,
          name: name.trim() || "Anonymous",
          category,
          message: feedback.trim(),
          status: "new",
          submittedAt: new Date().toISOString(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send feedback.");
      setFeedbackSent(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to send feedback.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ zIndex: 2 }}>
      <PageHeader title={settings.title} subtitle={settings.subtitle} />

      <div className="max-w-5xl px-8 pb-20 md:px-14">
        <h2 className="mb-6 text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{settings.uploadHeading}</h2>
        <div className="mb-14 grid gap-5 md:grid-cols-3">
          {settings.uploadOptions.map((option, index) => (
            <motion.button
              key={option.id}
              type="button"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-xl p-8 text-center transition-all duration-300"
              style={{ ...glass, border: "1px solid rgba(255,107,0,0.11)" }}
              onClick={() => window.open(option.submissionUrl || settings.telegramUrl, "_blank", "noopener,noreferrer")}
              onMouseEnter={(event) => { event.currentTarget.style.borderColor = "rgba(255,107,0,0.36)"; event.currentTarget.style.background = "rgba(255,107,0,0.04)"; }}
              onMouseLeave={(event) => { event.currentTarget.style.borderColor = "rgba(255,107,0,0.11)"; event.currentTarget.style.background = "var(--glass-bg)"; }}
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110" style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.2)" }}>
                <UploadIcon type={option.type} />
              </div>
              <h3 className="mb-2 text-2xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{option.title}</h3>
              <p className="mb-5 text-sm" style={{ color: "var(--tx-dim)" }}>{option.formatHint}</p>
              <div className="rounded-xl border-2 border-dashed p-6" style={{ borderColor: "rgba(255,107,0,0.18)" }}>
                <Upload size={18} className="mx-auto mb-2" style={{ color: "rgba(255,107,0,0.45)" }} />
                <p className="text-sm font-mono" style={{ color: "var(--tx-dim)" }}>Open submission channel</p>
              </div>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-mono" style={{ color: "rgba(255,107,0,0.60)" }}>
                <ExternalLink size={11} /> Submit contribution
              </div>
            </motion.button>
          ))}
        </div>

        <h2 className="mb-6 text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{settings.feedbackHeading}</h2>
        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-2xl rounded-xl p-8" style={{ ...glass }}>
          {feedbackSent ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: "rgba(255,107,0,0.1)", border: "1px solid rgba(255,107,0,0.28)" }}><span className="text-2xl" style={{ color: "var(--accent-text)" }}>✓</span></div>
              <h3 className="mb-2 text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>Feedback Received</h3>
              <p className="text-sm" style={{ color: "var(--tx-dim)" }}>Thank you for helping improve the Quai ecosystem.</p>
              <button onClick={() => { setFeedbackSent(false); setFeedback(""); setName(""); }} className="mt-5 text-sm font-mono" style={{ color: "var(--accent-text)" }}>Submit another</button>
            </div>
          ) : (
            <>
              <label className="mb-2 block text-sm font-mono tracking-wider" style={{ color: "var(--tx-dim)" }}>YOUR NAME (OPTIONAL)</label>
              <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Anonymous" className="mb-5 w-full rounded-lg px-4 py-3 text-sm font-mono outline-none" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--foreground)" }} />
              <label className="mb-2 block text-sm font-mono tracking-wider" style={{ color: "var(--tx-dim)" }}>CATEGORY</label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="mb-5 w-full rounded-lg px-4 py-3 text-sm font-mono outline-none" style={{ background: "var(--bg-select)", border: "1px solid var(--bg-input-border)", color: "var(--tx-mid)" }}>
                {settings.feedbackCategories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <label className="mb-2 block text-sm font-mono tracking-wider" style={{ color: "var(--tx-dim)" }}>MESSAGE</label>
              <textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} rows={5} placeholder="Share your thoughts, ideas, or suggestions..." className="mb-4 w-full resize-none rounded-lg px-4 py-3 text-sm outline-none" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--foreground)" }} />
              {error && <p className="mb-4 text-sm" style={{ color: "#d4183d" }}>{error}</p>}
              <button onClick={submitFeedback} disabled={!feedback.trim() || sending} className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-mono text-white disabled:cursor-not-allowed" style={{ ...orangeGlow, opacity: feedback.trim() && !sending ? 1 : 0.45 }}><Send size={13} />{sending ? "Sending..." : "Send Feedback"}</button>
            </>
          )}
        </motion.section>
      </div>
    </div>
  );
}
