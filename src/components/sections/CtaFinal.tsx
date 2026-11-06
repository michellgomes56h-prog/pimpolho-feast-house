"use client";

import { useRef } from "react";
import { ctaFinal } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";
import { useReveal } from "@/lib/useReveal";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { CtaButton } from "@/components/ui/CtaButton";
import { PimpolhoWordmark } from "@/components/brand/PimpolhoWordmark";
import { ConfettiBits } from "@/components/decor/ConfettiBits";
import { Starfield } from "@/components/decor/Sparkle";
import { Sparkle } from "@/components/decor/Sparkle";
import { burstConfetti } from "@/components/ui/confetti";

const BITS = [
  { top: "12%", left: "8%", color: "#FFD21F", shape: "rect", size: 18, r: 20, d: 7, delay: 0 },
  { top: "22%", left: "88%", color: "#7ED957", shape: "squiggle", size: 34, r: -14, d: 8, delay: 0.6 },
  { top: "70%", left: "6%", color: "#3A8DFF", shape: "squiggle", size: 30, r: 10, d: 9, delay: 1.2 },
  { top: "80%", left: "92%", color: "#FF8A1F", shape: "circle", size: 16, r: 0, d: 6, delay: 0.3 },
  { top: "8%", left: "60%", color: "#B36BFF", shape: "tri", size: 16, r: 30, d: 7.5, delay: 1.6 },
  { top: "88%", left: "40%", color: "#FF4B4B", shape: "rect", size: 14, r: -25, d: 6.5, delay: 0.9 },
  { top: "45%", left: "96%", color: "#FF3EA5", shape: "circle", size: 10, r: 0, d: 8, delay: 2 },
  { top: "40%", left: "2%", color: "#8BE04E", shape: "tri", size: 14, r: -10, d: 7, delay: 1.4 },
] as const;

export function CtaFinal() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    const box = q("[data-box]")[0];
    if (prefersReducedMotion()) return;
    gsap.fromTo(box, { scale: 0.88 }, { scale: 1, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "top 35%", scrub: true } });
    gsap.from(q("[data-wm]"), {
      scale: 0.4,
      autoAlpha: 0,
      rotate: -8,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: { trigger: box, start: "top 55%", once: true },
    });
    // uma explosão de confete quando o bloco chega na tela
    ScrollTrigger.create({
      trigger: box,
      start: "top 45%",
      once: true,
      onEnter: () => {
        const r = box.getBoundingClientRect();
        burstConfetti(r.left + r.width * 0.25, r.top + r.height * 0.35, 40);
        setTimeout(() => burstConfetti(r.left + r.width * 0.75, r.top + r.height * 0.35, 40), 220);
      },
    });
  });

  return (
    <section ref={root} data-loop-zone aria-labelledby="cta-title" className="relative px-3 py-16 sm:px-6 sm:py-24">
      <div data-box className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[40px] px-6 py-24 text-center sm:px-12 sm:py-32">
        {/* gradiente animado (camadas girando devagar — só transform) */}
        <div aria-hidden className="absolute inset-0 bg-[var(--bg-mid)]" />
        <div aria-hidden className="absolute -inset-1/2 [animation:orbit_28s_linear_infinite]">
          <div className="absolute left-[18%] top-[22%] h-[45%] w-[45%] rounded-full bg-[var(--pink-hot)] opacity-70 blur-[110px]" />
          <div className="absolute bottom-[20%] right-[18%] h-[45%] w-[45%] rounded-full bg-[var(--glow-orange)] opacity-80 blur-[110px]" />
        </div>
        <div aria-hidden className="absolute -inset-1/2 [animation:orbit_40s_linear_infinite_reverse]">
          <div className="absolute right-[25%] top-[25%] h-[35%] w-[35%] rounded-full bg-[var(--glow-amber)] opacity-70 blur-[100px]" />
          <div className="absolute bottom-[28%] left-[28%] h-[25%] w-[25%] rounded-full bg-[var(--peach)] opacity-40 blur-[90px]" />
        </div>
        <div aria-hidden className="noise absolute inset-0" />
        <div aria-hidden className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
        <ConfettiBits bits={[...BITS]} />
        <Starfield
          stars={[
            { top: "18%", left: "22%", size: 12, d: 3, delay: 0 },
            { top: "30%", left: "78%", size: 14, d: 3.6, delay: 0.7, color: "#FFD21F" },
            { top: "75%", left: "18%", size: 10, d: 2.8, delay: 1.2 },
            { top: "68%", left: "84%", size: 12, d: 3.2, delay: 0.4, color: "#D6F55B" },
          ]}
        />

        <div className="relative">
          <p data-reveal="fade-up" className="eyebrow flex items-center justify-center gap-2 !text-white/80">
            <Sparkle className="h-3 w-3" color="var(--lime-cta)" />
            {ctaFinal.eyebrow}
          </p>
          <h2
            id="cta-title"
            data-reveal="chars"
            className="mx-auto mt-6 max-w-4xl text-[clamp(2.5rem,7vw,6.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em]"
          >
            {ctaFinal.titulo}
          </h2>
          <div data-wm className="mt-6 flex justify-center">
            <PimpolhoWordmark className="text-[clamp(3.2rem,9vw,7.5rem)]" />
          </div>
          <p data-reveal="lines" className="mx-auto mt-8 max-w-xl text-base font-medium leading-relaxed text-white sm:text-lg">
            {ctaFinal.texto}
          </p>
          <div data-reveal="fade-up" className="mt-10 flex justify-center">
            <CtaButton href={whatsappLink()}>{ctaFinal.cta}</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
