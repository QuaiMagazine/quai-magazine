import type { CSSProperties } from "react";

export const glass: CSSProperties = {
  background: "var(--glass-bg, rgba(8, 8, 18, 0.78))",
  border: "1px solid rgba(255, 107, 0, 0.11)",
  backdropFilter: "blur(16px)",
};

export const orangeGlow: CSSProperties = {
  background: "linear-gradient(135deg, #FF6B00, #FF8C3A)",
  boxShadow:
    "0 0 32px rgba(255, 107, 0, 0.45), 0 0 80px rgba(255, 107, 0, 0.15)",
};
