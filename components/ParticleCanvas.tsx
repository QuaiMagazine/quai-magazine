"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 68 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.4 + 0.4,
      ph: Math.random() * Math.PI * 2,
      a: Math.random() * 0.5 + 0.3,
    }));

    function tick() {
      const W = canvas!.width;
      const H = canvas!.height;
      if (W <= 0 || H <= 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x = ((p.x + p.vx) % W + W) % W;
        p.y = ((p.y + p.vy) % H + H) % H;
        p.ph += 0.012;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(255,107,0,${(1 - d / 150) * 0.26})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      pts.forEach((p) => {
        if (!isFinite(p.x) || !isFinite(p.y) || !isFinite(p.r)) return;
        const pulse = Math.sin(p.ph) * 0.25 + 0.75;
        const glowR = Math.max(p.r * 6, 0.01);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(255,107,0,${p.a * pulse * 0.65})`);
        g.addColorStop(1, "rgba(255,107,0,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,155,55,${p.a * pulse})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
