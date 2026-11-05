"use client";

import { Fragment, useRef } from "react";
import { marquee } from "@/data/site";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Sparkle } from "@/components/decor/Sparkle";

function Row({ items, big }: { items: string[]; big?: boolean }) {
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
          {[...items, ...items].map((item, i) => (
            <Fragment key={i}>
              <span
                className={
                  big
                    ? `px-6 text-[clamp(2.6rem,7vw,6.5rem)] font-extrabold uppercase leading-none tracking-[-0.03em] sm:px-10 ${
                        i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)]" : "text-white"
                      }`
                    : "px-5 text-sm font-bold uppercase tracking-[0.25em] text-[#160c45] sm:text-base"
                }
              >
                {item}
              </span>
              {big ? (
                <Sparkle className="h-[clamp(1.5rem,3.5vw,3rem)] w-[clamp(1.5rem,3.5vw,3rem)] shrink-0" color={i % 2 ? "var(--lime-cta)" : "var(--pp-P)"} />
              ) : (
                <span className="text-[#160c45]">✦</span>
              )}
            </Fragment>
          ))}
        </div>
      ))}
    </>
  );
}

/**
 * Faixas infinitas inclinadas. A velocidade acompanha a velocidade da rolagem
 * e a direção inverte quando a página sobe.
 */
export function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) return;
      const tracks = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-track]"));
      const state = tracks.map((t) => ({
        t,
        x: 0,
        half: t.scrollWidth / 2,
        base: Number(t.dataset.speed),
        dir: Number(t.dataset.dir),
        set: gsap.quickSetter(t, "x", "px"),
      }));
      let scrollDir = 1;
      let boost = 0;
      let active = false;

      const tick = (_t: number, dt: number) => {
        if (!active) return;
        boost *= 0.93;
        const sec = dt / 1000;
        state.forEach((s) => {
          s.x -= s.base * (1 + boost) * scrollDir * s.dir * sec;
          s.x = gsap.utils.wrap(-s.half, 0, s.x);
          s.set(s.x);
        });
      };
      const measure = () => state.forEach((s) => (s.half = s.t.scrollWidth / 2));
      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          active = self.isActive;
          if (active) gsap.ticker.add(tick);
          else gsap.ticker.remove(tick);
        },
        onUpdate: (self) => {
          scrollDir = self.direction;
          boost = Math.max(boost, Math.min(Math.abs(self.getVelocity()) / 220, 14));
        },
        onRefresh: measure,
      });

      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Tipos de evento" className="relative z-10 -my-6 overflow-hidden py-24 sm:py-32">
      <p className="sr-only">{marquee.itens.join(", ")}</p>
      {/* faixa fina (lime) cruzando atrás */}
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[3deg] bg-[var(--lime-cta)] py-3 shadow-[0_0_60px_-10px_var(--lime-cta)]">
        <div data-track data-speed="45" data-dir="-1" className="flex w-max will-change-transform">
          <Row items={marquee.itens2} />
        </div>
      </div>
      {/* faixa principal */}
      <div
        className="relative -rotate-[3deg] py-5 shadow-[0_30px_80px_-20px_rgba(255,62,165,0.55)] sm:py-7"
        style={{ background: "linear-gradient(90deg, var(--blue-electric), var(--purple-neon) 35%, var(--pink-hot) 70%, var(--pp-h))" }}
      >
        <div data-track data-speed="70" data-dir="1" className="flex w-max will-change-transform">
          <Row items={marquee.itens} big />
        </div>
      </div>
    </section>
  );
}
