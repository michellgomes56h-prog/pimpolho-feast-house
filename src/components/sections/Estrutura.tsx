"use client";

import { useRef, type CSSProperties } from "react";
import { estrutura, estruturaSecao } from "@/data/estrutura";
import { useReveal } from "@/lib/useReveal";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AmenityIcon } from "@/components/decor/AmenityIcon";

const COLORS = ["var(--pp-P)", "var(--pp-i)", "var(--pp-m)", "var(--pp-p)", "var(--pp-o1)", "var(--pp-l)", "var(--pp-h)", "var(--pp-o2)"];

export function Estrutura() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    const grid = q("[data-amenities]")[0];
    const reduce = prefersReducedMotion();
    if (!reduce) {
      gsap.from(q("[data-amenity]"), {
        scale: 0.82,
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        ease: "back.out(1.6)",
        stagger: { each: 0.07, grid: "auto", from: "center" },
        scrollTrigger: { trigger: grid, start: "top 82%", once: true },
      });
    }
    // ícones desenham o traço
    q("[data-amenity]").forEach((card, i) => {
      const paths = card.querySelectorAll("[data-draw]");
      gsap.fromTo(
        paths,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: reduce ? 0.01 : 1.4,
          ease: "power2.inOut",
          stagger: 0.12,
          delay: reduce ? 0 : 0.25 + i * 0.07,
          scrollTrigger: { trigger: grid, start: "top 82%", once: true },
        },
      );
    });
  });

  return (
    <section ref={root} aria-labelledby="estrutura-title" className="bg-glow-a relative overflow-hidden py-16 sm:py-36">
      <div data-exit className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          id="estrutura-title"
          eyebrow={estruturaSecao.eyebrow}
          title={estruturaSecao.titulo}
          text={estruturaSecao.texto}
          reveal="chars"
          align="center"
        />
        <ul data-amenities className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {estrutura.map((item, i) => (
            <li
              key={item.titulo}
              data-amenity
              className="group relative flex basis-[calc((100%-1rem)/3)] flex-col items-center gap-1.5 overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.035] px-1.5 py-3 text-center sm:block sm:rounded-[26px] sm:text-left transition-[border-color,background-color] duration-500 hover:border-[color-mix(in_oklab,var(--c)_55%,transparent)] hover:bg-white/[0.06] sm:p-7"
              style={{ "--c": COLORS[i % COLORS.length] } as CSSProperties}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--c)] opacity-10 blur-2xl transition-opacity duration-500 group-hover:opacity-35"
              />
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl sm:h-14 sm:w-14 sm:rounded-2xl border border-white/10 bg-[color-mix(in_oklab,var(--c)_14%,transparent)] text-[var(--c)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:rotate-[-6deg] sm:h-16 sm:w-16">
                <AmenityIcon name={item.icone} className="h-5 w-5 sm:h-9 sm:w-9" />
              </span>
              <span className="relative min-w-0">
                <h3 className="text-[0.7rem] font-bold leading-tight tracking-[-0.01em] sm:mt-6 sm:text-xl">{item.titulo}</h3>
                <p className="mt-1.5 hidden text-sm leading-relaxed text-[var(--text-muted)] sm:block">{item.texto}</p>
                {!item.confirmado && (
                  <span className="mt-1 inline-block rounded-full border border-dashed border-[var(--lime-cta)]/60 px-1.5 py-px text-[0.55rem] font-bold tracking-wider text-[var(--lime-cta)] sm:mt-3 sm:px-2 sm:py-0.5 sm:text-[0.62rem]">
                    {estruturaSecao.selo}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
