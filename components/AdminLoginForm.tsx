"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn } from "lucide-react";

export default function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.replace("/dashboard/articles");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 pt-24" style={{ zIndex: 2 }}>
      <form onSubmit={signIn} className="w-full max-w-md rounded-lg border p-6 sm:p-8" style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--surface-shadow)" }}>
        <div className="mb-7 flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md" style={{ background: "rgba(255,107,0,.12)", color: "var(--accent-text)" }}><LockKeyhole size={20} /></span>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--accent-text)" }}>QUAI ADMIN</p>
            <h1 className="mt-1 text-2xl font-bold" style={{ color: "var(--tx-high)" }}>Sign in to dashboard</h1>
          </div>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-medium" style={{ color: "var(--tx-body)" }}>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" required className="w-full rounded-md border px-3 py-3 text-base outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--bg-input-border)", color: "var(--tx-high)" }} />
        </label>
        <label className="mb-5 block">
          <span className="mb-2 block text-sm font-medium" style={{ color: "var(--tx-body)" }}>Password</span>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required className="w-full rounded-md border px-3 py-3 text-base outline-none" style={{ background: "var(--bg-input)", borderColor: "var(--bg-input-border)", color: "var(--tx-high)" }} />
        </label>
        {error && <p className="mb-4 rounded-md px-3 py-2 text-sm" style={{ background: "rgba(225,91,91,.12)", color: "#d53f3f" }}>{error}</p>}
        <button disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-base font-semibold disabled:opacity-60" style={{ background: "#FF6B00", color: "#fff" }}>
          <LogIn size={17} /> {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
