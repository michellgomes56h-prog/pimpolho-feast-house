"use client";

import Image from "next/image";
import { Fragment, useRef, type CSSProperties, type MouseEvent } from "react";
import { PimpolhoWordmark } from "@/components/brand/PimpolhoWordmark";
import { CtaButton } from "@/components/ui/CtaButton";
import { useScrollTo } from "@/components/providers/SmoothScroll";
import { Balloon } from "@/components/decor/Balloon";
import { ConfettiBits } from "@/components/decor/ConfettiBits";
import { Sparkle, Starfield, type Star } from "@/components/decor/Sparkle";
import { hero, site } from "@/data/site";
import { whatsappLink } from "@/lib/whatsapp";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/* ---------- decoração (posições em %) ---------- */
const STARS: Star[] = [
  { top: "14%", left: "6%", size: 12, d: 3.2, delay: 0 },
  { top: "22%", left: "44%", size: 9, d: 2.6, delay: 0.8 },
  { top: "9%", left: "62%", size: 14, d: 3.8, delay: 1.2, color: "#FFD21F" },
  { top: "36%", left: "96%", size: 10, d: 2.9, delay: 0.4 },
  { top: "72%", left: "3%", size: 9, d: 3.4, delay: 1.6, color: "#C79BFF" },
  { top: "84%", left: "40%", size: 12, d: 3, delay: 0.2 },
  { top: "62%", left: "50%", size: 7, d: 2.4, delay: 1 },
  { top: "90%", left: "88%", size: 11, d: 3.6, delay: 0.6, color: "#FF3EA5" },
  { top: "48%", left: "30%", size: 6, d: 2.2, delay: 1.9 },
];

const BITS = [
  { top: "4%", left: "18%", color: "#FFD21F", shape: "rect", size: 16, r: 24, d: 7, delay: 0 },
  { top: "12%", left: "90%", color: "#7ED957", shape: "squiggle", size: 30, r: -18, d: 8, delay: 1 },
  { top: "40%", left: "-4%", color: "#FF3EA5", shape: "tri", size: 14, r: 30, d: 6.5, delay: 0.5 },
  { top: "86%", left: "12%", color: "#3A8DFF", shape: "circle", size: 14, r: 0, d: 7.5, delay: 1.4 },
  { top: "94%", left: "60%", color: "#FF8A1F", shape: "squiggle", size: 28, r: 12, d: 9, delay: 0.3 },
  { top: "58%", left: "98%", color: "#B36BFF", shape: "rect", size: 15, r: -30, d: 6, delay: 2 },
  { top: "-2%", left: "52%", color: "#FF4B4B", shape: "circle", size: 10, r: 0, d: 8, delay: 0.9 },
  { top: "70%", left: "46%", color: "#8BE04E", shape: "tri", size: 12, r: -12, d: 7, delay: 1.7 },
] as const;

/** Molduras da composição: posição, rotação e profundidade (parallax). */
const FRAMES: { cls: string; rot: number; depth: number; glow: string; sizes: string; priority?: boolean }[] = [
  {
    cls: "left-[20%] top-[9%] w-[52%] aspect-[4/5] z-[2]",
    rot: -3,
    depth: 0.5,
    glow: "var(--pink-hot)",
    sizes: "(min-width:1024px) 28vw, 52vw",
    priority: true,
  },
  { cls: "right-[0%] top-[1%] w-[38%] aspect-[4/3] z-[1]", rot: 5, depth: 1, glow: "var(--blue-electric)", sizes: "(min-width:1024px) 20vw, 38vw" },
  { cls: "left-[0%] bottom-[11%] w-[34%] aspect-square z-[3]", rot: 6, depth: 1.4, glow: "var(--pp-P)", sizes: "(min-width:1024px) 18vw, 34vw" },
  { cls: "right-[3%] bottom-[2%] w-[37%] aspect-[5/6] z-[3]", rot: -5, depth: 1.8, glow: "var(--purple-neon)", sizes: "(min-width:1024px) 20vw, 37vw" },
];

function PillIcon({ kind }: { kind: "people" | "snow" | "spark" }) {
  if (kind === "people")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 19c.8-3.3 3.2-5 6-5s5.2 1.7 6 5" />
        <path d="M16 5.2a3 3 0 010 5.6M18 14.4c1.6.7 2.6 2.2 3 4.6" />
      </svg>
    );
  if (kind === "snow")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M12 2v20M4.2 6.5l15.6 11M4.2 17.5l15.6-11M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />
      </svg>
    );
  return <Sparkle className="h-4 w-4" color="currentColor" />;
}

function Pill({
  label,
  icon,
  color,
  className,
  d,
  delay,
}: {
  label: string;
  icon: "people" | "snow" | "spark";
  color: string;
  className: string;
  d: number;
  delay: number;
}) {
  return (
    <div className={`a-pop absolute z-[5] ${className}`} style={{ "--delay": `${delay}s` } as CSSProperties}>
      <div
        className="floaty floaty-sm flex items-center border border-white/15 bg-[#1b1052]/90 gap-2.5 rounded-full py-2 pl-2 pr-4 text-[0.78rem] font-semibold text-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] sm:text-sm"
        style={{ "--d": `${d}s` } as CSSProperties}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full text-[#160c45] sm:h-8 sm:w-8" style={{ background: color }}>
          <PillIcon kind={icon} />
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </div>
    </div>
  );
}

/** Divide o texto em letras com máscara (renderizado no servidor, animado por CSS). */
function RiseChars({ text, delay, step = 0.028 }: { text: string; delay: number; step?: number }) {
  let n = 0;
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 && " "}
          <span className="mask whitespace-nowrap">
            {Array.from(word).map((ch, ci) => (
              <span key={ci} className="a-rise" style={{ "--delay": `${delay + n++ * step}s` } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
    </>
  );
}

const d = (s: number) => ({ "--delay": `${s}s` }) as CSSProperties;

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const scrollTo = useScrollTo();

  // A entrada é CSS. O GSAP cuida só do parallax (mouse + rolagem) e da saída da seção.
  useGSAP(
    () => {
      const el = root.current!;
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(el);

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      let onMove: ((e: PointerEvent) => void) | undefined;
      if (fine) {
        const layers = q<HTMLElement>("[data-mouse]").map((node) => {
          const depth = Number(node.dataset.mouse) || 1;
          return {
            depth,
            x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3.out" }),
            y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3.out" }),
          };
        });
        onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => {
            l.x(nx * 22 * l.depth);
            l.y(ny * 18 * l.depth);
          });
        };
        el.addEventListener("pointermove", onMove);
      }

      const st = { trigger: el, start: "top top", end: "bottom top", scrub: true };
      q<HTMLElement>("[data-scroll]").forEach((node) => {
        gsap.to(node, { yPercent: -Number(node.dataset.scroll) * 14, ease: "none", scrollTrigger: st });
      });
      gsap.to(q("[data-exit]"), { y: -80, scale: 0.94, autoAlpha: 0.15, ease: "none", scrollTrigger: { ...st, start: "top+=10% top" } });
      gsap.to(q("[data-exit-visual]"), { scale: 0.9, autoAlpha: 0.3, ease: "none", scrollTrigger: { ...st, start: "top+=15% top" } });

      return () => {
        if (onMove) el.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root },
  );

  const onSecondary = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(hero.ctaSecundario.href);
  };

  return (
    <section
      ref={root}
      id="topo"
      data-loop-zone
      aria-labelledby="hero-title"
      className="section-bg noise relative overflow-hidden pt-[calc(var(--header-h)+1.5rem)] lg:min-h-[100svh] lg:pt-[var(--header-h)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-[var(--purple-neon)] opacity-25 blur-[140px]"
      />
      <Starfield stars={STARS} />

      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 pb-[150px] sm:px-8 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1.02fr_1fr] lg:gap-8 lg:px-12 lg:pb-[190px]">
        {/* ---------- texto ---------- */}
        <div data-exit className="relative z-10 max-w-[640px] origin-top-left">
          <p className="a-fade-up eyebrow mb-6 flex items-center gap-2 text-[0.72rem] sm:text-xs" style={{ ...d(0.1), "--from-y": "16px" } as CSSProperties}>
            <Sparkle className="h-3 w-3" color="var(--lime-cta)" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="text-[clamp(2.9rem,7.2vw,6rem)] font-extrabold leading-[0.98] tracking-[-0.045em]">
            <span className="sr-only">
              {hero.tituloLinha1} {hero.tituloLinha2Antes} {site.wordmark}
              {hero.tituloLinha2Depois}
            </span>
            <span aria-hidden className="block">
              <span className="block">
                <RiseChars text={hero.tituloLinha1} delay={0.15} />
              </span>
              <span className="mt-1 flex flex-wrap items-baseline gap-x-[0.24em]">
                <span>
                  <RiseChars text={hero.tituloLinha2Antes} delay={0.42} />
                </span>
                <span className="inline-flex items-baseline">
                  <PimpolhoWordmark intro decorative delay={0.55} className="text-[1.06em] tracking-[0]" />
                  <span className="a-pop inline-block text-[var(--pp-o2)]" style={d(1.25)}>
                    {hero.tituloLinha2Depois}
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <p className="a-fade-up mt-7 max-w-[34rem] text-[1.02rem] leading-relaxed text-[var(--text-muted)] sm:text-lg" style={d(0.7)}>
            {hero.subtitulo}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-5">
            <div className="a-fade-up" style={d(0.95)}>
              <CtaButton href={whatsappLink()}>{hero.ctaPrincipal}</CtaButton>
            </div>
            <a
              href={hero.ctaSecundario.href}
              onClick={onSecondary}
              className="a-fade-up group inline-flex items-center gap-3 font-semibold text-white"
              style={d(1.05)}
            >
              <span className="relative grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-white/5 backdrop-blur transition-colors duration-300 group-hover:border-transparent group-hover:bg-white group-hover:text-[#160c45]">
                <span aria-hidden className="absolute inset-0 rounded-full border border-white/40 [animation:pulse-ring_2.2s_var(--ease-out)_infinite]" />
                <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" aria-hidden>
                  <path d="M7 4.5v15l12-7.5z" fill="currentColor" />
                </svg>
              </span>
              <span className="relative">
                {hero.ctaSecundario.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-white transition-transform duration-500 ease-[var(--ease-out)] group-hover:origin-left group-hover:scale-x-100" />
              </span>
            </a>
          </div>

          <p className="a-fade-up mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.82rem] text-[var(--text-muted)]" style={d(1.15)}>
            <Sparkle className="h-3 w-3" color="var(--pp-P)" />
            {hero.tiposEvento.map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {i > 0 && <span className="opacity-50">·</span>}
                {t}
              </span>
            ))}
          </p>
        </div>

        {/* ---------- composição visual ---------- */}
        <div data-exit-visual className="relative mx-auto w-full max-w-[640px] lg:mr-0">
          <div className="relative aspect-[1/1.02] w-full">
            <div
              aria-hidden
              className="a-fade pointer-events-none absolute left-[10%] top-[18%] h-[70%] w-[70%] rounded-full bg-[var(--pink-hot)] opacity-35 blur-[90px]"
            />
            <div
              aria-hidden
              className="a-fade pointer-events-none absolute right-0 top-0 h-[55%] w-[55%] rounded-full bg-[var(--blue-electric)] opacity-45 blur-[100px]"
            />

            {/* anel orbital */}
            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2">
              <div className="a-ring absolute inset-0">
                <div className="absolute inset-0 rounded-full border border-white/[0.14]" />
                <div className="absolute inset-[9%] rounded-full border border-dashed border-white/[0.09]" />
                <div className="absolute inset-0 [animation:orbit_26s_linear_infinite]">
                  <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lime-cta)] shadow-[0_0_18px_4px_var(--lime-cta)]" />
                </div>
                <div className="absolute inset-[9%] [animation:orbit_40s_linear_infinite_reverse]">
                  <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-[var(--pink-hot)] shadow-[0_0_14px_3px_var(--pink-hot)]" />
                </div>
              </div>
            </div>

            {/* fotos */}
            {hero.fotos.map((f, i) => {
              const fr = FRAMES[i];
              return (
                <div key={f.src} data-scroll={fr.depth} className={`absolute ${fr.cls}`}>
                  <div data-mouse={fr.depth} className="h-full w-full" style={{ rotate: `${fr.rot}deg` }}>
                    <div
                      data-cursor="hover"
                      className="a-clip relative h-full w-full overflow-hidden rounded-[28px] border border-white/15 bg-[var(--bg-indigo)]"
                      style={{ ...d(0.1 + i * 0.12), boxShadow: `0 30px 60px -20px rgba(0,0,0,.7), 0 0 50px -14px ${fr.glow}` }}
                    >
                      <Image
                        src={f.src}
                        alt={f.alt}
                        fill
                        sizes={fr.sizes}
                        priority={fr.priority}
                        className="a-zoom object-cover"
                        style={{ ...d(0.1 + i * 0.12), objectPosition: f.pos }}
                      />
                      <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-t from-[#120a3a]/45 via-transparent to-transparent"
                      />
                      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/10" />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* etiquetas */}
            <div data-mouse="2.2" className="pointer-events-none absolute inset-0 z-[5]">
              <Pill
                label={hero.etiquetas.capacidade}
                icon="people"
                color="var(--lime-cta)"
                className="left-[-3%] top-[47%] sm:left-[-8%] sm:top-[42%]"
                d={6}
                delay={0.9}
              />
              <Pill
                label={hero.etiquetas.clima}
                icon="snow"
                color="#8EC5FF"
                className="right-[-2%] top-[30%] sm:right-[-5%] sm:top-[33%]"
                d={7.5}
                delay={1.02}
              />
              <Pill label={`${hero.etiquetas.momentos} ✦`} icon="spark" color="var(--pp-P)" className="bottom-[-3%] left-[24%]" d={6.8} delay={1.14} />
            </div>

            {/* balões + confetes */}
            <div data-mouse="2.8" aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
              <div className="a-balloon absolute -left-[6%] top-[-4%] w-[11%] sm:-left-[2%]" style={d(0.35)}>
                <Balloon color="#FF3EA5" className="floaty floaty-lg w-full" style={{ "--d": "8s", "--r": "-6deg" } as CSSProperties} />
              </div>
              <div className="a-balloon absolute left-[4%] top-[2%] w-[8%]" style={d(0.5)}>
                <Balloon color="#FFD21F" className="floaty w-full" style={{ "--d": "9.5s", "--r": "5deg", "--delay": "1s" } as CSSProperties} />
              </div>
              <div className="a-balloon absolute right-[-5%] top-[54%] w-[10%] sm:right-[-7%]" style={d(0.65)}>
                <Balloon color="#3A8DFF" className="floaty w-full" style={{ "--d": "7.5s", "--r": "7deg", "--delay": "0.5s" } as CSSProperties} />
              </div>
              <div className="a-balloon absolute right-[-1%] top-[64%] w-[7%]" style={d(0.8)}>
                <Balloon color="#B36BFF" className="floaty w-full" style={{ "--d": "10s", "--r": "-4deg", "--delay": "2s" } as CSSProperties} />
              </div>
              <div className="a-fade absolute inset-0" style={d(0.5)}>
                <ConfettiBits bits={[...BITS]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* rodapé do hero */}
      <div className="absolute inset-x-0 bottom-[104px] z-10 mx-auto flex max-w-[1440px] items-center justify-between px-5 sm:bottom-[136px] sm:px-8 lg:bottom-[168px] lg:px-12">
        <div className="a-fade-up eyebrow flex items-center gap-3 text-[0.68rem]" style={d(1.3)}>
          <span aria-hidden className="relative grid h-9 w-6 place-items-start justify-center rounded-full border border-white/40 pt-2">
            <span className="block h-1.5 w-1.5 rounded-full bg-white [animation:scroll-dot_1.8s_var(--ease-out)_infinite]" />
          </span>
          {hero.rodape.rolar}
        </div>
        <p className="a-fade-up eyebrow absolute left-1/2 hidden -translate-x-1/2 text-[0.68rem] lg:block" style={d(1.4)}>
          {hero.rodape.tipos}
        </p>
      </div>
    </section>
  );
}
