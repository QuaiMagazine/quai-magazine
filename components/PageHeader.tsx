"use client";

import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="px-8 pb-8 pt-36 md:px-14">
      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-sm font-mono tracking-widest mb-6 transition-colors"
        style={{ color: "var(--tx-muted)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#FF6B00";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--tx-muted)";
        }}
      >
        ← HOME
      </button>
      <h1
        className="font-bold leading-none"
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "32px",
          color: "var(--tx-high)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mt-3 text-sm font-mono"
          style={{ color: "var(--tx-muted)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
