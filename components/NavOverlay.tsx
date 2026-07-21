"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { navItems } from "@/lib/data";

interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function NavOverlay({ open, onClose }: NavOverlayProps) {
  const [expanded, setExpanded] = useState<string[]>([]);
  const router = useRouter();

  const toggle = (id: string) => {
    setExpanded((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  };

  const navigate = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
          style={{ background: "rgba(2, 4, 10, 0.32)", backdropFilter: "blur(3px)", zIndex: 50 }}
        >
          <motion.nav
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="absolute right-4 top-4 w-[calc(100%_-_2rem)] max-w-[350px] overflow-hidden rounded-2xl border shadow-2xl sm:right-8 sm:top-5"
            style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--modal-shadow)" }}
            aria-label="Main navigation"
          >
            <div className="flex items-center justify-between border-b px-4 py-3.5" style={{ borderColor: "var(--border)" }}>
              <button onClick={() => navigate("/")} className="transition-opacity hover:opacity-70">
                <img src="/assets/quai-logo.png" alt="Quai" className="h-7 w-auto object-contain" />
              </button>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg transition-colors" style={{ color: "var(--tx-dim)" }} aria-label="Close menu">
                <X size={17} />
              </button>
            </div>

            <div className="max-h-[min(70vh,520px)] overflow-y-auto p-2" style={{ scrollbarColor: "rgba(255,107,0,.5) transparent" }}>
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.025, duration: 0.18 }}
                >
                  {item.children ? (
                    <>
                      <button onClick={() => toggle(item.id)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors" onMouseEnter={(event) => { event.currentTarget.style.background = "var(--bg-chip)"; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }}>
                        <span className="text-[15px] font-semibold" style={{ fontFamily: "Rajdhani, sans-serif", color: expanded.includes(item.id) ? "var(--accent-text)" : "var(--tx-high)" }}>{item.label}</span>
                        {item.badge && <span className="rounded-full px-1.5 py-0.5 text-[8px] font-mono" style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.1)" }}>{item.badge}</span>}
                        <ChevronDown size={14} className="ml-auto transition-transform" style={{ color: "var(--tx-dim)", transform: expanded.includes(item.id) ? "rotate(180deg)" : "rotate(0deg)" }} />
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded.includes(item.id) && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="mb-1 ml-4 border-l py-1 pl-2" style={{ borderColor: "rgba(255,107,0,.22)" }}>
                              {item.children.map((child) => (
                                <button key={child.id} onClick={() => navigate(child.href)} className="flex w-full items-center gap-1.5 rounded-lg px-2 py-2 text-left text-sm transition-colors" style={{ color: "var(--tx-dim)" }}>
                                  <ChevronRight size={12} style={{ color: "var(--accent-text)" }} />
                                  {child.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <button onClick={() => navigate(item.href!)} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold transition-colors" style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}>
                      {item.label}
                      {item.badge && <span className="rounded-full px-1.5 py-0.5 text-[8px] font-mono" style={{ color: "var(--accent-text)", background: "rgba(255,107,0,.1)" }}>{item.badge}</span>}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
