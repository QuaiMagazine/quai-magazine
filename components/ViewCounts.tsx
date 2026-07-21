"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";

type ViewCollection = "articles" | "aboutArticles" | "media" | "amaSessions";

const ViewCountContext = createContext({ enabled: false });

export function ViewCountsProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch("/api/cms/siteSettings", { cache: "no-store" })
      .then((response) => response.json())
      .then((items) => setEnabled(Array.isArray(items) && items[0]?.showViewCounts !== false))
      .catch(() => setEnabled(false));
  }, []);

  return <ViewCountContext.Provider value={{ enabled }}>{children}</ViewCountContext.Provider>;
}

export function ViewCount({ count, className = "" }: { count?: number; className?: string }) {
  const { enabled } = useContext(ViewCountContext);
  if (!enabled) return null;

  return (
    <span className={`inline-flex items-center gap-1 text-sm ${className}`} style={{ color: "var(--tx-dim)" }}>
      <Eye size={14} aria-hidden="true" />
      {new Intl.NumberFormat("en-US").format(Number(count) || 0)} views
    </span>
  );
}

export function ViewTracker({
  collection,
  id,
  onTracked,
}: {
  collection: ViewCollection;
  id: string;
  onTracked?: (viewCount: number) => void;
}) {
  const { enabled } = useContext(ViewCountContext);
  const tracked = useRef<string | null>(null);

  useEffect(() => {
    const key = `${collection}:${id}`;
    if (!enabled || !id || tracked.current === key) return;
    tracked.current = key;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection, id }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.enabled && typeof result.viewCount === "number") onTracked?.(result.viewCount);
      })
      .catch(() => undefined);
  }, [collection, enabled, id, onTracked]);

  return null;
}
