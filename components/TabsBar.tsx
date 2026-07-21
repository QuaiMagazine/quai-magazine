"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";

interface Tab {
  id: string;
  label: string;
}

interface TabsBarProps {
  tabs: Tab[];
  paramName?: string;
}

export default function TabsBar({ tabs, paramName = "tab" }: TabsBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(paramName) || tabs[0].id;

  const handleChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, tabId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className="flex px-8 md:px-14 mb-8"
      style={{ borderBottom: "1px solid rgba(255,107,0,0.1)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleChange(tab.id)}
          className="relative px-5 py-3 font-mono text-sm tracking-widest transition-colors"
          style={{
            color: active === tab.id ? "#FF6B00" : "var(--tx-muted)",
          }}
        >
          {tab.label}
          {active === tab.id && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: 2,
                background: "#FF6B00",
                boxShadow: "0 0 8px rgba(255,107,0,0.7)",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
