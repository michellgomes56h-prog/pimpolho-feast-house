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
    <section ref={root} aria-labelledby="depo-title" className="bg-glow-c relative overflow-hidden py-16 sm:py-36">
      <div data-exit className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading id="depo-title" eyebrow={depoimentosSecao.eyebrow} title={depoimentosSecao.titulo} reveal="words" align="center" />
        <ul className="-mx-5 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:mt-16 sm:px-0 md:grid md:grid-cols-3 md:items-start md:gap-6 md:overflow-visible">
          {depoimentos.map((d, i) => (
            <li
              key={i}
              data-quote
              className={`relative w-[62vw] max-w-[300px] shrink-0 snap-center overflow-hidden rounded-[18px] border border-white/12 bg-white/[0.04] p-4 backdrop-blur-sm md:w-auto md:max-w-none md:rounded-[30px] md:p-8 ${i === 1 ? "md:mt-12" : ""}`}
              style={{ "--c": d.cor } as CSSProperties}
            >
              <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--c)] opacity-20 blur-3xl" />
              <svg viewBox="0 0 48 36" className="relative h-6 w-8 text-[var(--c)] md:h-9 md:w-12" aria-hidden>
                <path
                  fill="currentColor"
                  d="M0 36V22.4C0 9.6 6.4 2.1 19.2 0l2 5.2C14 7 10.6 11 10.4 17H19v19H0zm26.8 0V22.4C26.8 9.6 33.2 2.1 46 0l2 5.2C40.8 7 37.4 11 37.2 17h8.6v19H26.8z"
                />
              </svg>
              <blockquote className="relative mt-3 text-lg md:mt-6 font-medium leading-relaxed text-white/90">
                <p className="rounded-xl border border-dashed border-white/25 p-3 text-center text-xs md:p-4 md:text-sm font-semibold tracking-wide text-[var(--lime-cta)]">
                  {d.texto}
                </p>
              </blockquote>
              <footer className="relative mt-4 flex items-center gap-3 md:mt-8">
                <span
                  className="grid h-9 w-9 place-items-center rounded-full md:h-11 md:w-11 bg-[var(--c)] text-sm font-extrabold text-[var(--ink)]"
                  aria-hidden
                >
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
