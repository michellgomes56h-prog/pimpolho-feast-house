"use client";

import { useRef, type CSSProperties } from "react";
import { depoimentos, depoimentosSecao } from "@/data/depoimentos";
import { useReveal } from "@/lib/useReveal";
import { gsap } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Depoimentos() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    const cards = q("[data-quote]");
    gsap.from(cards, {
      y: 120,
      rotate: (i) => [-8, 0, 8][i % 3],
      autoAlpha: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.12,
      scrollTrigger: { trigger: cards[0], start: "top 88%", once: true },
    });
  });

  return (
    <section ref={root} aria-labelledby="depo-title" className="bg-glow-c relative overflow-hidden py-28 sm:py-36">
      <div data-exit className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading id="depo-title" eyebrow={depoimentosSecao.eyebrow} title={depoimentosSecao.titulo} reveal="words" align="center" />
        <ul className="mt-16 grid gap-6 md:grid-cols-3 md:items-start">
          {depoimentos.map((d, i) => (
            <li
              key={i}
              data-quote
              className={`relative overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.04] p-8 backdrop-blur-sm ${i === 1 ? "md:mt-12" : ""}`}
              style={{ "--c": d.cor } as CSSProperties}
            >
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--c)] opacity-20 blur-3xl" />
              <svg viewBox="0 0 48 36" className="relative h-9 w-12 text-[var(--c)]" aria-hidden>
                <path
                  fill="currentColor"
                  d="M0 36V22.4C0 9.6 6.4 2.1 19.2 0l2 5.2C14 7 10.6 11 10.4 17H19v19H0zm26.8 0V22.4C26.8 9.6 33.2 2.1 46 0l2 5.2C40.8 7 37.4 11 37.2 17h8.6v19H26.8z"
                />
              </svg>
              <blockquote className="relative mt-6 text-lg font-medium leading-relaxed text-white/90">
                <p className="rounded-xl border border-dashed border-white/25 p-4 text-center text-sm font-semibold tracking-wide text-[var(--lime-cta)]">
                  {d.texto}
                </p>
              </blockquote>
              <footer className="relative mt-8 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--c)] text-sm font-extrabold text-[var(--ink)]" aria-hidden>
                  ✦
                </span>
                <span>
                  <span className="block font-bold">{d.nome}</span>
                  <span className="block text-sm text-[var(--text-muted)]">{d.evento}</span>
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
