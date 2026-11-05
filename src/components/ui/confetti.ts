/**
 * Explosão de confetes em canvas — leve, sem dependências.
 * Um único canvas fixo é criado sob demanda e removido quando a animação termina.
 */
const COLORS = ["#FFD21F", "#7ED957", "#FF3EA5", "#3A8DFF", "#FF4B4B", "#8BE04E", "#FF8A1F", "#B36BFF", "#D6F55B"];

type P = { x: number; y: number; vx: number; vy: number; r: number; vr: number; w: number; h: number; c: string; life: number; shape: 0 | 1 };

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let parts: P[] = [];
let raf = 0;

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "9999" });
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
}

function resize() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function teardown() {
  cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener("resize", resize);
  canvas?.remove();
  canvas = null;
  ctx = null;
}

function tick() {
  if (!ctx) return;
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vx *= 0.985;
    p.vy = p.vy * 0.985 + 0.32;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life -= 1;
    ctx.save();
    ctx.globalAlpha = Math.min(1, p.life / 30);
    ctx.translate(p.x, p.y);
    ctx.rotate(p.r);
    ctx.fillStyle = p.c;
    if (p.shape === 0) ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
    else {
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
  if (parts.length) raf = requestAnimationFrame(tick);
  else teardown();
}

export function burstConfetti(x: number, y: number, amount = 70) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  ensureCanvas();
  for (let i = 0; i < amount; i++) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
    const s = 6 + Math.random() * 9;
    parts.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.35,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      life: 90 + Math.random() * 50,
      shape: Math.random() > 0.7 ? 1 : 0,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}
