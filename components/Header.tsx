"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import NavOverlay from "@/components/NavOverlay";
import { useTheme } from "@/components/ThemeProvider";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const isDashboard = pathname.startsWith("/dashboard");

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 md:px-10 md:py-5"
        style={{
          zIndex: 40,
          background: theme === "light" ? "rgba(255,255,255,0.92)" : "transparent",
          borderBottom: theme === "light" ? "1px solid rgba(31,35,42,0.10)" : "1px solid transparent",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="transition-opacity hover:opacity-80"
          style={{
            fontFamily: "Rajdhani, sans-serif",
            color: "#FF6B00",
            textShadow: "0 0 24px rgba(255,107,0,0.55)",
          }}
        >
          <img src="/assets/quai-logo.png" alt="Quai" className="h-14 w-auto object-contain sm:h-16 md:h-20" style={{ filter: theme === "light" ? "invert(1)" : undefined }} />
        </button>

        <div className="flex items-center gap-3">
          {isDashboard && <button onClick={signOut} title="Sign out" className="flex h-9 w-9 items-center justify-center rounded-full transition-opacity hover:opacity-70" style={{ color: "var(--foreground)", background: "var(--glass-bg, rgba(8,8,18,0.78))", border: "1px solid rgba(255,107,0,0.18)" }}><LogOut size={16} /></button>}
          <button
            onClick={toggle}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-all hover:opacity-70"
            style={{
              color: "var(--foreground)",
              background: "var(--glass-bg, rgba(8,8,18,0.78))",
              border: "1px solid rgba(255,107,0,0.18)",
              backdropFilter: "blur(8px)",
            }}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col gap-1.5 p-2 transition-opacity hover:opacity-70"
            aria-label="Open menu"
          >
            <span
              className="block w-6 h-0.5"
              style={{ background: "var(--foreground)" }}
            />
            <span
              className="block w-4 h-0.5 self-end"
              style={{ background: "var(--foreground)" }}
            />
            <span
              className="block w-6 h-0.5"
              style={{ background: "var(--foreground)" }}
            />
          </button>
        </div>
      </header>

      <NavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
