"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { eventos, eventosSecao, type Evento } from "@/data/eventos";
import { whatsappLink } from "@/lib/whatsapp";
import { useReveal } from "@/lib/useReveal";
import { gsap } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventIcon } from "@/components/decor/EventIcon";
import { burstConfetti } from "@/components/ui/confetti";

function EventCard({ evento, index }: { evento: Evento; index: number }) {
  const destaque = "destaque" in evento ? evento.destaque : null;
  const card = useRef<HTMLDivElement>(null);

  // tilt 3D seguindo o mouse
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rx(-py * 14);
      ry(px * 16);
      el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    };
    const leave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const msg = `Olá! Vim pelo site e quero um orçamento para ${evento.titulo.toLowerCase()} no Pimpolho Feast House 🎉`;
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => burstConfetti(e.clientX, e.clientY, 50);

  return (
    <li data-card className={`group relative [perspective:1100px] ${destaque ? "sm:col-span-2" : ""}`} style={{ "--accent": evento.cor } as CSSProperties}>
      {/* glow por trás */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-6 rounded-[32px] bg-[var(--accent)] opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-50"
      />
      <div
        ref={card}
        className="relative flex h-full flex-col overflow-hidden rounded-[30px] border border-white/12 bg-white/[0.04] p-3 backdrop-blur-sm transition-[border-color] duration-500 [transform-style:preserve-3d] group-hover:border-[color-mix(in_oklab,var(--accent)_60%,transparent)]"
      >
        {/* brilho que segue o mouse */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%)",
          }}
        />
        <div className={`relative overflow-hidden rounded-[22px] ${destaque ? "aspect-[4/3] sm:aspect-[11/4]" : "aspect-[4/3]"}`} data-cursor="hover">
          <Image
            src={evento.foto.src}
            alt={evento.foto.alt}
            fill
            sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
            className="object-cover transition-transform duration-[1.1s] ease-[var(--ease-out)] group-hover:scale-110"
            style={{ objectPosition: "pos" in evento.foto ? evento.foto.pos : undefined }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/70 via-transparent to-transparent" />
          <span className="absolute right-4 top-4 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[0.7rem] font-semibold tracking-widest text-white/90 backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
          {destaque && (
            <span className="absolute left-4 top-4 rounded-full bg-[var(--accent)] px-3.5 py-1.5 text-xs font-bold tracking-wide text-[var(--ink)] shadow-[0_8px_24px_-6px_var(--accent)]">
              {destaque}
            </span>
          )}
        </div>
        <div className="relative flex flex-1 flex-col px-3 pb-3 pt-6 [transform:translateZ(30px)]">
          <span
            className="absolute -top-7 left-4 grid h-14 w-14 place-items-center rounded-2xl text-[var(--ink)] shadow-[0_10px_30px_-8px_var(--accent)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110"
            style={{ background: "var(--accent)" }}
          >
            <EventIcon name={evento.icone} className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-[1.45rem] font-bold tracking-[-0.02em]">{evento.titulo}</h3>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--text-muted)]">{evento.descricao}</p>
          <a
            href={whatsappLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 py-2 pl-4 pr-2 text-sm font-semibold text-white transition-[background-color,color,border-color] duration-300 hover:border-transparent hover:bg-[var(--accent)] hover:text-[var(--ink)]"
          >
            {eventosSecao.botao}
            <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-white/10">
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-45" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </li>
  );
}

export function Eventos() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    gsap.from(q("[data-card]"), {
      y: 90,
      rotationX: -28,
      autoAlpha: 0,
      transformOrigin: "50% 0%",
      duration: 1.1,
      ease: "power3.out",
      stagger: { each: 0.1, grid: "auto", from: "start" },
      scrollTrigger: { trigger: q("[data-grid]")[0], start: "top 82%", once: true },
    });
  });

  return (
    <section ref={root} id="eventos" aria-labelledby="eventos-title" className="bg-glow-b noise relative overflow-hidden py-28 sm:py-36">
      <div data-exit className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="eventos-title" eyebrow={eventosSecao.eyebrow} title={eventosSecao.titulo} reveal="flip" />
          <p data-reveal="fade-up" className="max-w-sm text-base leading-relaxed text-[var(--text-muted)] sm:text-lg lg:pb-3">
            {eventosSecao.texto}
          </p>
        </div>
        <ul data-grid className="mt-16 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {eventos.map((e, i) => (
            <EventCard key={e.titulo} evento={e} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
