"use client";

import { useRef } from "react";
import { reservar } from "@/data/reservar";
import { whatsappLink } from "@/lib/whatsapp";
import { useReveal } from "@/lib/useReveal";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/ui/CtaButton";

export function ComoReservar() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    const list = q("[data-steps]")[0];
    const fill = q("[data-fill]")[0];
    const reduce = prefersReducedMotion();
    // linha gradiente "andando"
    gsap.fromTo(
      fill,
      { scaleY: reduce ? 1 : 0 },
      { scaleY: 1, ease: "none", scrollTrigger: reduce ? undefined : { trigger: list, start: "top 60%", end: "bottom 60%", scrub: 0.6 } },
    );
    // cada passo acende quando a linha chega nele
    q("[data-step]").forEach((step) => {
      gsap.from(step.querySelector("[data-step-body]"), {
        x: 40,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 80%", once: true },
      });
      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        onEnter: () => step.classList.add("is-on"),
        onLeaveBack: () => step.classList.remove("is-on"),
      });
    });
  });

  return (
    <section ref={root} aria-labelledby="reservar-title" className="bg-glow-b noise relative overflow-x-clip py-28 sm:py-36">
      <div data-exit className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24 lg:px-12">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+4rem)] lg:self-start">
          <SectionHeading id="reservar-title" eyebrow={reservar.eyebrow} title={reservar.titulo} reveal="skew" />
          <div data-reveal="fade-up" className="mt-10 hidden lg:block">
            <CtaButton href={whatsappLink()}>{reservar.cta}</CtaButton>
          </div>
        </div>

        <div>
          <ol data-steps className="relative">
            {/* trilho + preenchimento */}
            <span aria-hidden className="absolute bottom-10 left-[27px] top-10 w-[2px] rounded bg-white/10 sm:left-[35px]" />
            <span
              aria-hidden
              data-fill
              className="absolute bottom-10 left-[27px] top-10 w-[2px] origin-top rounded bg-[linear-gradient(180deg,var(--pp-P),var(--pp-m),var(--pp-p),var(--pp-o2))] shadow-[0_0_14px_var(--pink-hot)] sm:left-[35px]"
            />
            {reservar.passos.map((p, i) => (
              <li key={p.titulo} data-step className="group relative flex gap-6 pb-14 last:pb-0 sm:gap-10">
                <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/15 bg-[var(--bg-deep)] text-lg font-extrabold text-white/40 transition-all duration-700 ease-[var(--ease-spring)] group-[.is-on]:scale-110 group-[.is-on]:border-transparent group-[.is-on]:bg-[var(--lime-cta)] group-[.is-on]:text-[var(--ink)] group-[.is-on]:shadow-[0_0_0_8px_rgba(214,245,91,0.12),0_0_40px_var(--lime-cta)] sm:h-[72px] sm:w-[72px] sm:text-2xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div
                  data-step-body
                  className="flex-1 rounded-[26px] border border-white/10 bg-white/[0.03] p-6 transition-[border-color,background-color] duration-700 group-[.is-on]:border-white/20 group-[.is-on]:bg-white/[0.07] sm:p-8"
                >
                  <h3 className="text-xl font-bold tracking-[-0.02em] text-white/60 transition-colors duration-700 group-[.is-on]:text-white sm:text-2xl">
                    {p.titulo}
                  </h3>
                  <p className="mt-2 leading-relaxed text-[var(--text-muted)]">{p.texto}</p>
                </div>
              </li>
            ))}
          </ol>
          <div data-reveal="fade-up" className="mt-12 lg:pl-[106px]">
            <CtaButton href={whatsappLink()}>{reservar.cta}</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
