"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { orangeGlow } from "@/lib/styles";
import { useTheme } from "@/components/ThemeProvider";

export default function HeroSection() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center md:py-32">
      <div
        className="absolute pointer-events-none"
        style={{
          inset: 0,
          zIndex: 1,
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,107,0,0.13) 0%, rgba(255,107,0,0.04) 45%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          right: 0,
          top: "50%",
          height: 1,
          zIndex: 1,
          background:
            "linear-gradient(to right, transparent, rgba(255,107,0,0.08) 30%, rgba(255,107,0,0.08) 70%, transparent)",
        }}
      />

      <div className="relative flex flex-col items-center" style={{ zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-10 text-sm font-semibold"
          style={{
            background: "rgba(255,107,0,0.07)",
            border: "1px solid rgba(255,107,0,0.22)",
            color: "var(--accent-text)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#FF6B00", boxShadow: "0 0 6px #FF6B00" }}
          />
          MAINNET · LIVE
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[2.45/1] w-[min(86vw,32rem)] overflow-hidden"
          style={{ filter: "drop-shadow(0 0 80px rgba(255,107,0,0.25))" }}
        >
          <img
            src="/assets/quai-logo.png"
            alt="Quai"
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 object-contain"
            style={{ filter: theme === "light" ? "invert(1)" : undefined }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.38 }}
          className="my-8 flex w-full max-w-md items-center gap-5"
        >
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,107,0,0.2)" }}
          />
          <span
            className="text-sm font-medium whitespace-nowrap"
            style={{ color: "var(--tx-muted)" }}
          >
            PROOF · OF · WORK · ECOSYSTEM
          </span>
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,107,0,0.2)" }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-[440px] mb-10 text-base leading-relaxed"
          style={{
            fontFamily: "Inter, sans-serif",
            color: "var(--tx-dim)",
            letterSpacing: "0.01em",
          }}
        >
          A multi-threaded blockchain with 13 parallel chains, merged mining
          consensus, and a hash-denominated currency. Decentralized at scale.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.66 }}
          onClick={() => router.push("/timeline")}
          className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-white font-bold transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            ...orangeGlow,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 60px rgba(255,107,0,0.7), 0 0 120px rgba(255,107,0,0.25)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 0 32px rgba(255,107,0,0.45), 0 0 80px rgba(255,107,0,0.15)";
          }}
        >
          See Timeline
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-start justify-center gap-x-8 gap-y-6 sm:mt-20"
        >
          {[
            ["13", "Parallel Chains"],
            ["50K+", "TPS Capacity"],
            ["PoW", "Consensus"],
            ["Qi", "Hash Token"],
          ].map(([v, l]) => (
            <div key={l} className="text-center">
              <div
                className="text-[32px] font-bold"
                style={{ fontFamily: "Rajdhani, sans-serif", color: "var(--tx-high)" }}
              >
                {v}
              </div>
              <div
                className="mt-1 text-sm font-medium"
                style={{ color: "var(--tx-faint)" }}
              >
                {l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-[2] mt-12 flex flex-col items-center gap-2"
      >
        <div
          className="text-sm font-medium"
          style={{ color: "var(--tx-faint)" }}
        >
          EXPLORE
        </div>
        <div
          className="w-px h-7"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,107,0,0.4), transparent)",
          }}
        />
      </motion.div>
    </div>
  );
}
