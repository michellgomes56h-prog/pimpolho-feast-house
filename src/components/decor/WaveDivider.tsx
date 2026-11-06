"use client";

import { useId, useRef, type CSSProperties } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Transição ondulada entre seções: a seção de baixo "sobe" na de cima com uma borda líquida,
 * uma crista com brilho nas cores do wordmark e uma onda translúcida atrás dando profundidade.
 * As ondas deslizam devagar (só transform) e "respiram" com a rolagem.
 */

const TILE = 1440; // largura de um período completo da onda (px) — repete sem emenda
const VB_H = 160; // altura do viewBox

/** Soma de senos com número inteiro de ciclos por tile → começa e termina igual (emenda perfeita). */
function wavePath(seed: number, amp = 1, closeTo = VB_H) {
  const comps = [
    { k: 2, a: 26, p: seed * 1.7 },
    { k: 3, a: 16, p: seed * 0.9 + 1 },
    { k: 5, a: 9, p: seed * 2.3 + 2 },
    { k: 7, a: 4, p: seed * 0.4 + 3 },
  ];
  const base = 70;
  const y = (x: number) => base + amp * comps.reduce((s, c) => s + c.a * Math.sin((2 * Math.PI * c.k * x) / TILE + c.p), 0);
  let d = `M0 ${closeTo} L0 ${y(0).toFixed(1)}`;
  for (let x = 8; x <= TILE * 2; x += 8) d += ` L${x} ${y(x).toFixed(1)}`;
  d += ` L${TILE * 2} ${closeTo} Z`;
  // linha da crista (sem fechar)
  let line = `M0 ${y(0).toFixed(1)}`;
  for (let x = 8; x <= TILE * 2; x += 8) line += ` L${x} ${y(x).toFixed(1)}`;
  return { d, line };
}

type Props = {
  /** Cor da seção de baixo (preenchimento da onda). */
  fill?: string;
  /** Cor da onda translúcida de trás. */
  tint?: string;
  /** Formato da onda (muda as fases). */
  seed?: number;
  /** Inverte o sentido do movimento. */
  reverse?: boolean;
  /** "lg" para a transição do hero, "md" para as demais. */
  size?: "md" | "lg";
  className?: string;
};

export function WaveDivider({ fill = "var(--bg-deep)", tint = "var(--pink-hot)", seed = 1, reverse = false, size = "md", className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const front = wavePath(seed, size === "lg" ? 1.15 : 0.85);
  const back = wavePath(seed + 2.4, size === "lg" ? 1.25 : 0.95);

  // a onda "respira" com a rolagem: entra mais alta e assenta ao chegar no meio da tela
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = root.current!;
      gsap.fromTo(
        el.querySelectorAll("[data-wave-scale]"),
        { scaleY: size === "lg" ? 1.15 : 1.45 },
        { scaleY: 0.75, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 25%", scrub: true } },
      );
    },
    { scope: root, dependencies: [size] },
  );

  // altura = onda + faixa de fade que entra na seção de baixo (evita emenda de cor)
  const h = size === "lg" ? "h-[120px] sm:h-[160px] lg:h-[200px]" : "h-[90px] sm:h-[120px] lg:h-[150px]";
  const waveBox = "absolute inset-x-0 top-0 bottom-[30px] origin-bottom sm:bottom-[40px] lg:bottom-[50px]";
  const anim = (dur: number, rev: boolean) => ({ animation: `wave-slide ${dur}s linear infinite ${rev ? "reverse" : "normal"}` }) as CSSProperties;

  return (
    <div
      ref={root}
      aria-hidden
      data-loop-zone
      className={`pointer-events-none relative z-20 -mb-[30px] w-full overflow-x-clip sm:-mb-[40px] lg:-mb-[50px] ${h} ${size === "lg" ? "-mt-[90px] sm:-mt-[120px] lg:-mt-[150px]" : "-mt-[60px] sm:-mt-[80px] lg:-mt-[100px]"} ${className}`}
    >
      {/* onda de trás (translúcida, sentido oposto) */}
      <div data-wave-scale className={waveBox}>
        <div className="absolute inset-y-0 left-0 w-[2880px] will-change-transform" style={anim(size === "lg" ? 34 : 40, !reverse)}>
          <svg viewBox={`0 0 ${TILE * 2} ${VB_H}`} preserveAspectRatio="none" className="h-full w-full">
            <path d={back.d} fill={tint} opacity="0.32" />
          </svg>
        </div>
      </div>
      {/* onda da frente: cor da próxima seção + crista brilhante */}
      <div data-wave-scale className={waveBox}>
        <div className="absolute inset-y-0 left-0 w-[2880px] will-change-transform" style={anim(size === "lg" ? 24 : 30, reverse)}>
          <svg viewBox={`0 0 ${TILE * 2} ${VB_H}`} preserveAspectRatio="none" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id={`crest-${uid}`} x1="0" x2={TILE} y1="0" y2="0" gradientUnits="userSpaceOnUse" spreadMethod="repeat">
                <stop offset="0" stopColor="#FFD21F" />
                <stop offset="0.25" stopColor="#FF3EA5" />
                <stop offset="0.5" stopColor="#3A8DFF" />
                <stop offset="0.75" stopColor="#B36BFF" />
                <stop offset="1" stopColor="#FFD21F" />
              </linearGradient>
              <filter id={`glow-${uid}`} x="-5%" y="-50%" width="110%" height="200%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <path d={front.d} fill={fill} />
            <path d={front.line} fill="none" stroke={`url(#crest-${uid})`} strokeWidth="10" opacity="0.55" filter={`url(#glow-${uid})`} />
            <path d={front.line} fill="none" stroke={`url(#crest-${uid})`} strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
      {/* fade: a cor da onda se dissolve no topo da próxima seção */}
      <div
        className="absolute inset-x-0 bottom-0 h-[31px] sm:h-[41px] lg:h-[51px]"
        style={{ background: `linear-gradient(to bottom, ${fill}, color-mix(in oklab, ${fill} 0%, transparent))` }}
      />
    </div>
  );
}
