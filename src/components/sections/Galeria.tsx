"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { galeria, galeriaSecao } from "@/data/galeria";
import { useReveal } from "@/lib/useReveal";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import dynamic from "next/dynamic";

const Lightbox = dynamic(() => import("@/components/ui/Lightbox").then((m) => m.Lightbox), { ssr: false });

const total = galeria.length;
const pad = (n: number) => String(n).padStart(2, "0");

/** Tamanho de cada foto no trilho (desktop usa vh para caber na seção pinada). */
const SHAPE: Record<string, string> = {
  alta: "w-[72vw] sm:w-[46vw] lg:w-auto lg:h-[min(52vh,560px)] aspect-[4/5]",
  larga: "w-[84vw] sm:w-[60vw] lg:w-auto lg:h-[min(40vh,430px)] aspect-[4/3]",
  quadrada: "w-[76vw] sm:w-[50vw] lg:w-auto lg:h-[min(44vh,470px)] aspect-square",
};
/** Deslocamento vertical alternado (só desktop). */
const OFFSET = ["lg:-translate-y-[3vh]", "lg:translate-y-[5vh]", "lg:-translate-y-[1vh]", "lg:translate-y-[3vh]"];

export function Galeria() {
  const root = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const current = useRef(0);
  const [open, setOpen] = useState<{ index: number; from: DOMRect | null } | null>(null);

  const setCounter = useCallback((i: number) => {
    if (i === current.current || !counterRef.current) return;
    const dir = i > current.current ? 1 : -1;
    current.current = i;
    const el = counterRef.current;
    gsap.fromTo(el, { yPercent: 100 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out", overwrite: true });
    el.textContent = pad(i + 1);
  }, []);

  useReveal(root, (q) => {
    const section = root.current!;
    const track = q("[data-track]")[0];
    const items = q("[data-item]");
    const mm = gsap.matchMedia();

    /* ---------- desktop: seção pinada, rolagem vertical → horizontal ---------- */
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const h = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: q("[data-pin]")[0],
          pin: true,
          scrub: 0.8,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
        // contador segue a posição real do trilho (já suavizada pelo scrub): 01 no início, 08 no fim
        onUpdate() {
          setCounter(Math.round(this.progress() * (total - 1)));
        },
      });

      items.forEach((it, i) => {
        const frame = it.querySelector<HTMLElement>("[data-frame]")!;
        const img = it.querySelector<HTMLElement>("[data-parallax]")!;
        const caption = it.querySelector<HTMLElement>("[data-caption]")!;
        const initiallyVisible = it.offsetLeft < window.innerWidth;
        // entrada: clip-path abrindo
        const reveal = gsap.timeline(
          initiallyVisible
            ? { scrollTrigger: { trigger: section, start: "top 65%", once: true }, delay: i * 0.12 }
            : { scrollTrigger: { trigger: it, containerAnimation: h, start: "left 92%", once: true } },
        );
        reveal
          .fromTo(frame, { clipPath: "inset(12% 100% 12% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.3, ease: "expo.out" })
          .from(img, { scale: 1.3, duration: 1.6, ease: "expo.out" }, 0)
          .from(caption, { y: 20, autoAlpha: 0, duration: 0.7, ease: "power3.out" }, 0.4);
        // parallax interno (a foto anda dentro da moldura)
        gsap.fromTo(
          img,
          { xPercent: -7 },
          { xPercent: 7, ease: "none", scrollTrigger: { trigger: it, containerAnimation: h, start: "left right", end: "right left", scrub: true } },
        );
      });

      // contador grande desliza junto
      gsap.to(q("[data-progress]"), {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: q("[data-pin]")[0], start: "top top", end: () => `+=${distance()}`, scrub: true, invalidateOnRefresh: true },
      });
    });

    /* ---------- mobile/tablet: carrossel com snap ---------- */
    mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
      const scroller = q("[data-scroller]")[0];
      const onScroll = () => {
        const mid = scroller.scrollLeft + scroller.clientWidth / 2;
        let best = 0;
        let bestD = Infinity;
        items.forEach((it, i) => {
          const dd = Math.abs(it.offsetLeft + it.offsetWidth / 2 - mid);
          if (dd < bestD) {
            bestD = dd;
            best = i;
          }
        });
        setCounter(best);
        const prog = scroller.scrollLeft / Math.max(1, scroller.scrollWidth - scroller.clientWidth);
        gsap.set(q("[data-progress]"), { scaleX: prog });
      };
      scroller.addEventListener("scroll", onScroll, { passive: true });
      gsap.from(items, {
        x: 80,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: scroller, start: "top 85%", once: true },
      });
      return () => scroller.removeEventListener("scroll", onScroll);
    });

    ScrollTrigger.refresh();
  });

  const openAt = (i: number, el: HTMLElement) => setOpen({ index: i, from: el.getBoundingClientRect() });

  const getRect = useCallback((i: number) => {
    const el = root.current?.querySelectorAll<HTMLElement>("[data-frame]")[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight ? r : null;
  }, []);

  return (
    <section ref={root} id="galeria" aria-labelledby="galeria-title" className="bg-glow-c relative pb-[60px] sm:pb-[80px] lg:pb-[100px]">
      <div data-pin className="relative flex flex-col justify-center overflow-hidden py-24 lg:h-[100svh] lg:pb-6 lg:pt-[calc(var(--header-h)+1rem)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col justify-between gap-6 px-5 sm:px-8 lg:flex-row lg:items-end lg:px-12">
          <SectionHeading id="galeria-title" eyebrow={galeriaSecao.eyebrow} title={galeriaSecao.titulo} reveal="skew" size="sm" />
          <div data-reveal="fade-up" className="flex items-end gap-4 lg:pb-2" aria-live="polite">
            <p className="flex items-baseline font-extrabold leading-none tracking-[-0.05em]">
              <span className="relative inline-block overflow-hidden text-[clamp(3.5rem,6vw,5.5rem)]">
                <span ref={counterRef} className="text-grad inline-block">
                  01
                </span>
              </span>
              <span className="ml-2 text-xl text-[var(--text-muted)] sm:text-2xl">/ {pad(total)}</span>
            </p>
          </div>
        </div>

        {/* trilho */}
        <div
          data-scroller
          className="mt-10 snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] lg:mt-[4vh] lg:snap-none lg:overflow-visible"
        >
          <ul data-track className="flex w-max items-center gap-5 px-5 sm:gap-8 sm:px-8 lg:gap-14 lg:pl-12 lg:pr-[20vw]">
            {galeria.map((f, i) => (
              <li key={f.src} data-item className={`shrink-0 snap-center ${OFFSET[i % OFFSET.length]}`}>
                <button
                  type="button"
                  onClick={(e) => openAt(i, e.currentTarget.querySelector("[data-frame]") as HTMLElement)}
                  className="group block text-left"
                  data-cursor="hover"
                >
                  <span data-frame className={`relative block overflow-hidden rounded-[28px] border border-white/12 bg-[var(--bg-indigo)] ${SHAPE[f.forma]}`}>
                    <span data-parallax className="absolute inset-y-0 -left-[9%] -right-[9%] block">
                      <Image
                        src={f.src}
                        alt={f.alt}
                        fill
                        sizes="(min-width:1024px) 40vw, 80vw"
                        className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-105"
                      />
                    </span>
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#120a3a]/75 via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 grid h-10 w-10 scale-75 place-items-center rounded-full bg-white/90 text-[#160c45] opacity-0 transition-all duration-500 ease-[var(--ease-spring)] group-hover:scale-100 group-hover:opacity-100">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                        <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
                      </svg>
                    </span>
                  </span>
                  <span data-caption className="mt-4 flex items-center gap-3 text-sm font-semibold text-white/90">
                    <span className="text-xs font-bold tracking-widest text-[var(--lime-cta)]">{pad(i + 1)}</span>
                    <span className="h-px w-6 bg-white/30" />
                    {f.legenda}
                    <span className="sr-only"> — {galeriaSecao.dica}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* barra de progresso da galeria */}
        <div className="mx-auto mt-10 w-full max-w-[1440px] px-5 sm:px-8 lg:mt-[5vh] lg:px-12">
          <div className="h-px w-full bg-white/12">
            <div data-progress className="h-[2px] w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--pp-P),var(--pp-m),var(--pp-p),var(--pp-o2))]" />
          </div>
        </div>
      </div>

      {open && (
        <Lightbox
          items={galeria.map((g) => ({ src: g.src, alt: g.alt, legenda: g.legenda }))}
          index={open.index}
          from={open.from}
          getRect={getRect}
          labels={galeriaSecao}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
