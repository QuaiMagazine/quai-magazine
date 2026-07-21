"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Archive, BarChart3, Edit3, ExternalLink, FileText, HeartHandshake, Info, Library, Plus, RefreshCcw, Route, Save, Settings, Trash2, X } from "lucide-react";

type FieldType = "text" | "textarea" | "select" | "checkbox" | "url" | "file" | "color";

export interface DashboardField {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  accept?: string;
  visibleWhen?: { key: string; value: string | string[] };
  section?: string;
}

interface Props {
  title: string;
  collection: string;
  seedItems: any[];
  fields: DashboardField[];
  filterKey?: string;
  filterOptions?: string[];
  newItem?: Record<string, unknown>;
  nextOrderKey?: string;
  singleton?: boolean;
}

const emptyItem = (fields: DashboardField[]) =>
  fields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = field.type === "checkbox" ? false : "";
    return acc;
  }, {});

function publicHref(collection: string, item: Record<string, unknown>) {
  const id = encodeURIComponent(String(item.id || ""));
  if (collection === "articles") return `/articles/${id}`;
  if (collection === "aboutArticles") return `/about/article/${id}`;
  if (collection === "media") return `/media?tab=${encodeURIComponent(String(item.type || "audio"))}`;
  if (collection === "networkStats") return "/about?tab=network";
  if (collection === "timelineEvents") return "/timeline";
  return null;
}

export default function DashboardManager({ title, collection, seedItems, fields, filterKey, filterOptions, newItem, nextOrderKey, singleton = false }: Props) {
  const pathname = usePathname();
  const [items, setItems] = useState<Record<string, unknown>[]>(seedItems);
  const [active, setActive] = useState<Record<string, unknown> | null>(null);
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    setMessage("");
    const response = await fetch(`/api/cms/${collection}`, { cache: "no-store" });
    const data = await response.json();
    setItems(Array.isArray(data) ? data : seedItems);
  };

  useEffect(() => {
    load().catch(() => setItems(seedItems));
  }, [collection]);

  const visibleItems = useMemo(() => {
    if (!filterKey || filter === "all") return items;
    return items.filter((item) => String(item[filterKey] || "") === filter);
  }, [filter, filterKey, items]);

  const saveItem = async () => {
    if (!active) return;
    setSaving(true);
    setMessage("");
    const id = String(active.id || "");
    const method = id && items.some((item) => item.id === id) ? "PUT" : "POST";
    const url = method === "PUT" ? `/api/cms/${collection}/${id}` : `/api/cms/${collection}`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });

    setSaving(false);
    if (!response.ok) {
      setMessage("Save failed. Check MongoDB connection and required fields.");
      return;
    }

    setActive(null);
    setMessage("Saved.");
    await load();
  };

  const deleteItem = async (item: Record<string, unknown>) => {
    const id = String(item.id || "");
    if (!id) return;
    const response = await fetch(`/api/cms/${collection}/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage("Delete failed.");
      return;
    }
    setMessage("Deleted.");
    await load();
  };

  const updateActive = (key: string, value: unknown) => {
    setActive((current) => ({ ...(current || {}), [key]: value }));
  };

  const createNewItem = () => {
    const item = { ...emptyItem(fields), ...newItem };
    if (nextOrderKey) {
      const highestOrder = Math.max(0, ...items.map((current) => Number(current[nextOrderKey]) || 0));
      item[nextOrderKey] = highestOrder + 1;
    }
    setActive(item);
  };

  const uploadFile = async (key: string, file?: File) => {
    if (!file) return;
    setUploadingKey(key);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/uploads", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      updateActive(key, data.url);
      setMessage("Image uploaded. Save changes to publish it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadingKey(null);
    }
  };

  const formFields = active ? fields.filter((field) => {
    if (!field.visibleWhen) return true;
    const expected = field.visibleWhen.value;
    const actual = String(active[field.visibleWhen.key] || "");
    return Array.isArray(expected) ? expected.includes(actual) : expected === actual;
  }) : [];

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
              {navItems.map(({ href, label, Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="mb-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors"
                    style={{
                      background: isActive ? "var(--admin-active-bg)" : "transparent",
                      color: isActive ? "var(--admin-active-text)" : "var(--admin-sidebar-text)",
                      borderLeft: `3px solid ${isActive ? "var(--admin-active-border)" : "transparent"}`,
                    }}
                  >
                    <Icon size={16} /> {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="border-b px-5 py-4 md:px-8" style={{ background: "var(--admin-topbar)", borderColor: "var(--border)" }}>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>{title}</h1>
                <p className="text-sm" style={{ color: "var(--tx-dim)" }}>{visibleItems.length} item{visibleItems.length === 1 ? "" : "s"} visible</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:hidden">
                {navItems.map(({ href, label }) => (
                  <Link key={href} href={href} className="rounded-md px-3 py-2 text-sm" style={{ color: pathname === href ? "var(--accent-text)" : "var(--tx-body)", border: "1px solid var(--border)" }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="px-5 py-5 md:px-8">
            <div className="mb-4 flex flex-col justify-between gap-3 rounded-md border p-3 md:flex-row md:items-center" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="flex flex-wrap gap-2">
                {filterKey && (
                  <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-md px-3 py-2 text-sm outline-none" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" }}>
                    <option value="all">All</option>
                    {filterOptions?.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                )}
                <button onClick={load} className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}>
                  <RefreshCcw size={14} /> Refresh
                </button>
              </div>
              {!singleton && <button onClick={createNewItem} className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold" style={{ background: "#FF6B00", color: "#fff" }}>
                <Plus size={15} /> Add New
              </button>}
            </div>

            {message && <p className="mb-4 rounded-md px-3 py-2 text-sm" style={{ color: "var(--accent-text)", background: "rgba(255,107,0,0.08)", border: "1px solid rgba(255,107,0,0.18)" }}>{message}</p>}

            {active && (
              <section className="mb-5 rounded-md border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
                  <h2 className="text-xl font-bold" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>
                    {items.some((item) => item.id === active.id) ? "Edit item" : "Add new item"}
                  </h2>
                  <button onClick={() => setActive(null)} className="rounded-md p-2" style={{ color: "var(--tx-dim)", border: "1px solid var(--border)" }}><X size={16} /></button>
                </div>
                <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
                  {formFields.map((field, index) => (
                    <label key={field.key} className={field.type === "textarea" ? "block md:col-span-2 xl:col-span-3" : "block"}>
                      {field.section && (index === 0 || formFields[index - 1]?.section !== field.section) && <span className="mb-2 block text-sm font-mono tracking-[0.14em]" style={{ color: "var(--accent-text)" }}>{field.section}</span>}
                      <span className="mb-1 block text-sm font-medium" style={{ color: "var(--tx-dim)" }}>{field.label}{field.required ? <span style={{ color: "var(--accent-text)" }}> *</span> : null}</span>
                      {field.type === "textarea" ? (
                        <textarea value={String(active[field.key] || "")} onChange={(event) => updateActive(field.key, event.target.value)} placeholder={field.placeholder} className="min-h-40 w-full rounded-md p-3 text-sm outline-none" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" }} />
                      ) : field.type === "select" ? (
                        <select value={String(active[field.key] || "")} onChange={(event) => updateActive(field.key, event.target.value)} className="w-full rounded-md p-3 text-sm outline-none" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" }}>
                          <option value="">Select</option>
                          {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
                        </select>
                      ) : field.type === "checkbox" ? (
                        <div className="flex h-11 items-center rounded-md px-3" style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)" }}>
                          <input type="checkbox" checked={Boolean(active[field.key])} onChange={(event) => updateActive(field.key, event.target.checked)} />
                        </div>
                      ) : field.type === "file" ? (
                        <div className="rounded-md border p-3" style={{ background: "var(--bg-input)", borderColor: "var(--bg-input-border)" }}>
                          <input type="file" accept={field.accept || "image/png,image/jpeg,image/webp,image/gif"} disabled={uploadingKey === field.key} onChange={(event) => uploadFile(field.key, event.target.files?.[0])} className="block w-full text-sm" style={{ color: "var(--tx-body)" }} />
                          {uploadingKey === field.key && <span className="mt-2 block text-sm" style={{ color: "var(--accent-text)" }}>Uploading file...</span>}
                          {typeof active[field.key] === "string" && Boolean(String(active[field.key])) && <span className="mt-2 block truncate text-sm" style={{ color: "var(--tx-dim)" }}>File attached</span>}
                        </div>
                      ) : (
                        <input type={field.type === "url" ? "url" : field.type === "color" ? "color" : "text"} value={String(active[field.key] || (field.type === "color" ? "#FF6B00" : ""))} onChange={(event) => updateActive(field.key, event.target.value)} placeholder={field.placeholder} className={field.type === "color" ? "h-11 w-full rounded-md border p-1" : "w-full rounded-md p-3 text-sm outline-none"} style={{ background: "var(--bg-input)", border: "1px solid var(--bg-input-border)", color: "var(--tx-high)" }} />
                      )}
                      {field.helpText && <span className="mt-1 block text-sm leading-4" style={{ color: "var(--tx-muted)" }}>{field.helpText}</span>}
                    </label>
                  ))}
                </div>
                <div className="flex justify-end border-t px-4 py-3" style={{ borderColor: "var(--border)" }}>
                  <button onClick={saveItem} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold disabled:opacity-60" style={{ background: "#FF6B00", color: "#fff" }}>
                    <Save size={15} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </section>
            )}

            <div className="overflow-hidden rounded-md border" style={{ background: "var(--glass-bg)", borderColor: "var(--border)" }}>
              <div className="grid grid-cols-[minmax(220px,1fr)_160px_150px_250px] border-b px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em]" style={{ borderColor: "var(--border)", color: "var(--tx-dim)" }}>
                <span>Title</span>
                <span>Type</span>
                <span>Date/Value</span>
                <span className="text-right">Actions</span>
              </div>
              {visibleItems.map((item) => (
                <div key={String(item.id)} className="grid grid-cols-[minmax(220px,1fr)_160px_150px_250px] items-center border-b px-4 py-3 text-sm" style={{ borderColor: "var(--border)" }}>
                  <div className="min-w-0">
                    <p className="truncate font-medium" style={{ color: "var(--tx-high)" }}>{String(item.title || item.label || item.platform || item.id)}</p>
                    <p className="truncate text-sm" style={{ color: "var(--tx-dim)" }}>{String(item.id || "")}</p>
                  </div>
                  <span style={{ color: "var(--tx-body)" }}>{String(item.type || item.category || "Content")}</span>
                  <div className="min-w-0">
                    <span className="block truncate" style={{ color: "var(--tx-dim)" }}>{String(item.publishedAt || item.date || item.year || item.value || item.handle || item.order || "")}</span>
                    {typeof item.viewCount === "number" && <span className="mt-1 block text-sm" style={{ color: "var(--accent-text)" }}>{item.viewCount} views</span>}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {publicHref(collection, item) && <a href={publicHref(collection, item)!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm" style={{ color: "var(--tx-body)", border: "1px solid var(--border)" }}><ExternalLink size={13} /> View</a>}
                    <button onClick={() => setActive(item)} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm" style={{ color: "var(--accent-text)", border: "1px solid rgba(255,107,0,.28)" }}>
                      <Edit3 size={13} /> Edit
                    </button>
                    {!singleton && <button onClick={() => deleteItem(item)} className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm" style={{ color: "#ff7777", border: "1px solid rgba(255,120,120,.28)" }}>
                      <Trash2 size={13} /> Delete
                    </button>}
                  </div>
                </div>
              ))}
              {!visibleItems.length && <p className="p-8 text-sm" style={{ color: "var(--tx-dim)" }}>No items found.</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
