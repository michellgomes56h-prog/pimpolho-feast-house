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
  const largo = "largo" in evento && evento.largo;
  const destaque = "selo" in evento ? (evento.selo as string) : null;
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

  const msg = `Olá! Vim pelo site e quero um orçamento para ${evento.titulo.toLowerCase()} na Pimpolho Feast House 🎉`;
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => burstConfetti(e.clientX, e.clientY, 50);

  return (
    <li data-card className={`group relative [perspective:1100px] ${largo ? "col-span-2" : ""}`} style={{ "--accent": evento.cor } as CSSProperties}>
      {/* glow por trás */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-6 hidden rounded-[32px] bg-[var(--accent)] opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-50 sm:block"
      />
      <div
        ref={card}
        className="relative flex h-full flex-col overflow-hidden rounded-[14px] border border-white/12 bg-white/[0.04] p-1.5 backdrop-blur-sm transition-[border-color] duration-500 [transform-style:preserve-3d] group-hover:border-[color-mix(in_oklab,var(--accent)_60%,transparent)] sm:rounded-[30px] sm:p-3"
      >
        {/* brilho que segue o mouse */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%)",
          }}
        />
        {/* celular: foto pequena (quadrada / larga no destaque) · desktop: foto grande */}
        <div
          className={`relative overflow-hidden rounded-[10px] sm:rounded-[22px] ${largo ? "aspect-[2.1/1] sm:aspect-[11/4]" : "aspect-square sm:aspect-[4/3]"}`}
          data-cursor="hover"
        >
          <Image
            quality={90}
            src={evento.foto.src}
            alt={evento.foto.alt}
            fill
            sizes={largo ? "(min-width:1024px) 62vw, (min-width:640px) 92vw, 64vw" : "(min-width:1024px) 30vw, (min-width:640px) 45vw, 32vw"}
            className="object-cover transition-transform duration-[1.1s] ease-[var(--ease-out)] group-hover:scale-110"
            style={{ objectPosition: "pos" in evento.foto ? evento.foto.pos : undefined }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--bg-deep)]/70 via-transparent to-transparent" />
          <span className="absolute right-4 top-4 hidden rounded-full border border-white/25 bg-black/25 px-3 py-1 text-[0.7rem] font-semibold tracking-widest text-white/90 backdrop-blur sm:inline">
            {String(index + 1).padStart(2, "0")}
          </span>
          {destaque && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-[var(--accent)] px-2 py-0.5 text-[0.58rem] font-bold tracking-wide text-[var(--ink)] shadow-[0_8px_24px_-6px_var(--accent)] sm:left-4 sm:top-4 sm:px-3.5 sm:py-1.5 sm:text-xs">
              {destaque}
            </span>
          )}
          {/* ícone pequeno sobre a foto (celular) */}
          <span
            className="absolute bottom-1.5 left-1.5 grid h-6 w-6 place-items-center rounded-lg text-[var(--ink)] sm:hidden"
            style={{ background: "var(--accent)" }}
          >
            <EventIcon name={evento.icone} className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="relative flex flex-1 flex-col px-1 pb-0.5 pt-1.5 sm:px-3 sm:pb-3 sm:pt-6 sm:[transform:translateZ(30px)]">
          <span
            className="absolute -top-7 left-4 hidden h-14 w-14 place-items-center rounded-2xl text-[var(--ink)] shadow-[0_10px_30px_-8px_var(--accent)] transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110 sm:grid"
            style={{ background: "var(--accent)" }}
          >
            <EventIcon name={evento.icone} className="h-7 w-7" />
          </span>
          <h3 className="text-[0.85rem] font-bold leading-tight tracking-[-0.01em] sm:mt-4 sm:text-[1.45rem] sm:tracking-[-0.02em]">{evento.titulo}</h3>
          <p className="mt-2 hidden text-[0.95rem] leading-relaxed text-[var(--text-muted)] sm:block">{evento.descricao}</p>
          <a
            href={whatsappLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick}
            aria-label={`${eventosSecao.botao}: ${evento.titulo}`}
            className="mt-auto inline-flex w-fit items-center gap-1 pt-1.5 text-[0.66rem] font-semibold text-white transition-[background-color,color,border-color] duration-300 sm:mt-6 sm:gap-2 sm:rounded-full sm:border sm:border-white/20 sm:py-2 sm:pl-4 sm:pr-2 sm:text-sm sm:text-white sm:hover:border-transparent sm:hover:bg-[var(--accent)] sm:hover:text-[var(--ink)]"
          >
            <span className="sm:hidden">{eventosSecao.botaoCurto}</span>
            <span className="hidden sm:inline">{eventosSecao.botao}</span>
            <span className="grid h-4 w-4 place-items-center overflow-hidden rounded-full sm:h-7 sm:w-7 sm:bg-white/10">
              <svg viewBox="0 0 16 16" className="h-3 w-3 transition-transform duration-500 group-hover:rotate-45 sm:h-3.5 sm:w-3.5" fill="none" aria-hidden>
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
    <section ref={root} id="eventos" aria-labelledby="eventos-title" className="bg-glow-b noise relative overflow-hidden py-16 sm:py-36">
      <div data-exit className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-3 sm:gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="eventos-title" eyebrow={eventosSecao.eyebrow} title={eventosSecao.titulo} reveal="flip" />
          <p data-reveal="fade-up" className="max-w-sm text-[0.95rem] leading-relaxed text-[var(--text-muted)] sm:text-lg lg:pb-3">
            {eventosSecao.texto}
          </p>
        </div>
        <ul data-grid className="mt-6 grid grid-cols-2 gap-2 sm:mt-16 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {eventos.map((e, i) => (
            <EventCard key={e.titulo} evento={e} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
