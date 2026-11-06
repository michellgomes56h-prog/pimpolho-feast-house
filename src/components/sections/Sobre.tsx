"use client";

import Image from "next/image";
import { useRef } from "react";
import { sobre } from "@/data/site";
import { useReveal } from "@/lib/useReveal";
import { gsap } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sparkle } from "@/components/decor/Sparkle";

function RotatingBadge({ text }: { text: string }) {
  const label = `${text} ✦ ${text} ✦ `;
  return (
    <div className="relative grid h-32 w-32 place-items-center rounded-full bg-[var(--lime-cta)] text-[var(--ink)] shadow-[0_20px_50px_-15px_var(--lime-cta)] sm:h-36 sm:w-36">
      <div aria-hidden className="absolute inset-0 [animation:orbit_18s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <defs>
            <path id="badge-circle" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" />
          </defs>
          <text className="fill-current text-[18.4px] font-bold uppercase tracking-[0.2em]">
            <textPath href="#badge-circle">{label}</textPath>
          </text>
        </svg>
      </div>
      <Sparkle className="h-8 w-8" color="var(--ink)" />
    </div>
  );
}

export function Sobre() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    // contadores
    q("[data-count]").forEach((n) => {
      const valor = Number(n.dataset.count);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: valor,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: n, start: "top 88%", once: true },
        onUpdate: () => (n.textContent = Math.round(obj.v).toLocaleString("pt-BR")),
      });
    });
    q("[data-stat]").forEach((n, i) =>
      gsap.from(n, { y: 40, autoAlpha: 0, duration: 0.9, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 90%", once: true } }),
    );
    // arco: revela de baixo para cima + parallax da foto
    const arch = q("[data-arch]")[0];
    if (arch) {
      const img = arch.querySelector("img");
      gsap
        .timeline({ scrollTrigger: { trigger: arch, start: "top 80%", once: true } })
        .fromTo(arch, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" })
        .from(img, { scale: 1.4, duration: 2, ease: "expo.out" }, 0.3);
      gsap.to(img, { yPercent: 8, ease: "none", scrollTrigger: { trigger: arch, start: "top bottom", end: "bottom top", scrub: true } });
    }
    gsap.from(q("[data-badge]"), {
      scale: 0,
      rotate: -120,
      duration: 1.2,
      ease: "back.out(1.8)",
      scrollTrigger: { trigger: q("[data-badge]")[0], start: "top 90%", once: true },
    });
  });

  return (
    <section ref={root} data-loop-zone id="o-espaco" aria-labelledby="sobre-title" className="bg-glow-a relative overflow-hidden py-28 sm:py-36">
      <div data-exit className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-12">
        <div>
          <SectionHeading id="sobre-title" eyebrow={sobre.eyebrow} title={sobre.titulo} reveal="words" />
          <div className="mt-8 max-w-xl space-y-4 text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
            {sobre.texto.map((t, i) => (
              <p key={i} data-reveal="lines">
                {t}
              </p>
            ))}
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10">
            {sobre.numeros.map((n, i) => (
              <div key={n.label} data-stat className="border-t border-white/15 pt-5">
                <dt className="sr-only">{n.label}</dt>
                <dd className="flex items-baseline gap-1 text-[clamp(1.9rem,4.2vw,3.6rem)] font-extrabold leading-none tracking-[-0.04em]">
                  {n.valor !== null ? (
                    <>
                      {n.prefixo && <span className="mr-1 text-[0.4em] font-bold tracking-normal text-[var(--text-muted)]">{n.prefixo}</span>}
                      <span data-count={n.valor}>0</span>
                      <span className="text-grad">{n.sufixo}</span>
                    </>
                  ) : (
                    <span className="break-all text-[0.62em] tracking-[-0.02em] text-[var(--lime-cta)]">{n.placeholder}</span>
                  )}
                </dd>
                <dd className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ["var(--pp-P)", "var(--pp-m)", "var(--pp-p)", "var(--pp-i)"][i % 4] }} />
                  {n.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div aria-hidden className="absolute -inset-10 rounded-full bg-[var(--pink-hot)] opacity-25 blur-[100px]" />
          <div
            data-arch
            data-cursor="hover"
            className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[32px] border border-white/15 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
          >
            <Image src={sobre.foto.src} alt={sobre.foto.alt} fill sizes="(min-width:1024px) 520px, 90vw" className="scale-110 object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/60 to-transparent" />
          </div>
          {/* arco de contorno */}
          <div aria-hidden className="pointer-events-none absolute -inset-4 rounded-t-[999px] rounded-b-[44px] border border-dashed border-white/15" />
          <div data-badge className="absolute -bottom-10 -left-4 sm:-left-12">
            <RotatingBadge text={sobre.selo} />
          </div>
        </div>
      </div>
    </section>
  );
}
