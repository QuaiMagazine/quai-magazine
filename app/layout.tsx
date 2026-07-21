import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ParticleCanvas from "@/components/ParticleCanvas";
import ThemeProvider from "@/components/ThemeProvider";
import { ViewCountsProvider } from "@/components/ViewCounts";

export const metadata: Metadata = {
  title: "QUAI Network",
  description:
    "A multi-threaded blockchain with 13 parallel chains, merged mining consensus, and a hash-denominated currency. Decentralized at scale.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="relative min-h-screen overflow-x-hidden bg-background text-foreground"
        style={{ fontFamily: "Inter, sans-serif" }}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ViewCountsProvider>
            <ParticleCanvas />

          <div
            className="fixed inset-x-0 top-0 h-28 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, var(--fade-top) 0%, transparent 100%)",
              zIndex: 3,
            }}
          />

          <Header />

            <main style={{ position: "relative", zIndex: 2 }}>{children}</main>
          </ViewCountsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
