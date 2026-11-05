"use client";

import { useId, useRef, useState } from "react";
import { faq, faqSecao } from "@/data/faq";
import { whatsappLink } from "@/lib/whatsapp";
import { useReveal } from "@/lib/useReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/ui/CtaButton";

export function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();
  useReveal(root);

  return (
    <section ref={root} id="duvidas" aria-labelledby="faq-title" className="bg-glow-a relative overflow-x-clip py-28 sm:py-36">
      <div data-exit className="mx-auto grid max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20 lg:px-12">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+4rem)] lg:self-start">
          <SectionHeading id="faq-title" eyebrow={faqSecao.eyebrow} title={faqSecao.titulo} text={faqSecao.texto} reveal="words" />
          <div data-reveal="fade-up" className="mt-10">
            <CtaButton href={whatsappLink()} variant="ghost">
              {faqSecao.cta}
            </CtaButton>
          </div>
        </div>

        <ul data-reveal="stagger" className="space-y-3">
          {faq.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${uid}-p${i}`;
            const btnId = `${uid}-b${i}`;
            return (
              <li
                key={item.pergunta}
                className={`rounded-[24px] border transition-[background-color,border-color] duration-500 ${
                  isOpen ? "border-white/20 bg-white/[0.07]" : "border-white/10 bg-white/[0.025] hover:border-white/20"
                }`}
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold sm:px-8 sm:py-6 sm:text-lg"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs font-bold tracking-widest text-[var(--lime-cta)]">{String(i + 1).padStart(2, "0")}</span>
                      {item.pergunta}
                    </span>
                    <span
                      aria-hidden
                      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full transition-all duration-500 ease-[var(--ease-spring)] ${
                        isOpen ? "rotate-[135deg] bg-[var(--lime-cta)] text-[#160c45]" : "bg-white/10"
                      }`}
                    >
                      <span className="absolute h-[2px] w-4 rounded bg-current" />
                      <span className="absolute h-4 w-[2px] rounded bg-current" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`px-6 pb-6 leading-relaxed text-[var(--text-muted)] transition-[opacity,transform] duration-500 sm:px-8 sm:pb-7 sm:pl-[4.25rem] ${
                        isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                      }`}
                    >
                      {item.resposta}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
