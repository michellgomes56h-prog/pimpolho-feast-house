"use client";

import Image from "next/image";
import { useRef } from "react";
import { personalizado } from "@/data/personalizado";
import { whatsappLink } from "@/lib/whatsapp";
import { useReveal } from "@/lib/useReveal";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/ui/CtaButton";
import { Sparkle } from "@/components/decor/Sparkle";

const CORES = ["var(--pp-m)", "var(--pp-P)", "var(--pp-p)"];

export function Personalizado() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    if (prefersReducedMotion()) return;
    const photo = q("[data-photo]")[0];
    gsap.from(photo, {
      y: 80,
      rotation: 10,
      scale: 0.85,
      autoAlpha: 0,
      duration: 1.2,
      ease: "back.out(1.4)",
      scrollTrigger: { trigger: photo, start: "top 85%", once: true },
    });
    gsap.from(q("[data-heart]"), {
      scale: 0,
      duration: 0.6,
      ease: "back.out(3)",
      stagger: 0.12,
      delay: 0.6,
      scrollTrigger: { trigger: photo, start: "top 85%", once: true },
    });
    gsap.from(q("[data-item]"), {
      x: 30,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: q("[data-itens]")[0], start: "top 90%", once: true },
    });
  });

  return (
    <section ref={root} data-loop-zone aria-labelledby="personalizado-title" className="bg-glow-c relative overflow-hidden py-16 sm:py-36">
      <div data-exit className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-20 lg:gap-y-8 lg:px-12">
        {/* texto (no celular vem primeiro) */}
        <div className="lg:col-start-2 lg:row-start-1 lg:self-end">
          <SectionHeading id="personalizado-title" eyebrow={personalizado.eyebrow} title={personalizado.titulo} text={personalizado.texto} reveal="chars" />
        </div>

        {/* foto + itens: lado a lado no celular, foto sozinha à esquerda no desktop */}
        <div className="grid grid-cols-[44%_minmax(0,1fr)] items-center gap-x-4 gap-y-5 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:block">
          <div data-photo className="relative mx-auto w-full max-w-[460px] -rotate-3">
            {/* moldura tipo foto revelada */}
            <div className="rounded-[10px] bg-white p-1.5 pb-6 shadow-[0_24px_50px_-20px_rgba(0,0,0,0.8)] sm:rounded-[14px] sm:p-3 sm:pb-14">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] sm:rounded-[8px]" data-cursor="hover">
                <Image
                  quality={90}
                  src={personalizado.foto.src}
                  alt={personalizado.foto.alt}
                  fill
                  sizes="(min-width:1024px) 460px, 44vw"
                  className="object-cover"
                  style={{ objectPosition: "50% 30%" }}
                />
              </div>
              <p className="absolute inset-x-0 bottom-1 text-center font-[family-name:var(--font-hand)] text-[0.62rem] font-semibold text-[#c2185b] sm:bottom-3 sm:text-2xl">
                {personalizado.legenda}
              </p>
            </div>
            {/* coraçõezinhos */}
            <span data-heart aria-hidden className="absolute -right-2 -top-2 text-lg text-[var(--pink-hot)] drop-shadow sm:-right-5 sm:-top-5 sm:text-4xl">
              ♥
            </span>
            <span data-heart aria-hidden className="absolute -left-2 top-1/3 text-sm text-[var(--pp-P)] drop-shadow sm:-left-5 sm:text-2xl">
              ♥
            </span>
          </div>

          <div className="min-w-0 lg:hidden">
            <ul data-itens className="space-y-1.5">
              {personalizado.itens.map((t, i) => (
                <li
                  key={t}
                  data-item
                  className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-2.5 py-1.5 text-[0.7rem] font-semibold leading-tight"
                >
                  <Sparkle className="h-3 w-3 shrink-0" color={CORES[i % CORES.length]} />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 flex justify-center lg:hidden">
            <CtaButton href={whatsappLink(personalizado.mensagem)} size="sm">
              {personalizado.cta}
            </CtaButton>
          </div>
        </div>

        {/* itens + CTA no desktop (abaixo do texto) */}
        <div className="hidden lg:col-start-2 lg:row-start-2 lg:block lg:self-start">
          <ul data-itens className="flex flex-wrap gap-3">
            {personalizado.itens.map((t, i) => (
              <li key={t} data-item className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-semibold">
                <Sparkle className="h-3.5 w-3.5" color={CORES[i % CORES.length]} />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <CtaButton href={whatsappLink(personalizado.mensagem)}>{personalizado.cta}</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
