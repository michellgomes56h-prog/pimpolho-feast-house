"use client";

import { useRef, type CSSProperties } from "react";
import { frase } from "@/data/frase";
import { useReveal } from "@/lib/useReveal";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Balloon } from "@/components/decor/Balloon";
import { Sparkle } from "@/components/decor/Sparkle";

/** Cores do cartão (iguais à referência: tinta azul + marca-texto amarelo). */
const INK = "#1E3FA6";
const MARKER = "#F7C52B";

function Paw({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill={INK} aria-hidden>
      <ellipse cx="11" cy="20" rx="5" ry="6.5" transform="rotate(-20 11 20)" />
      <ellipse cx="19.5" cy="11" rx="5" ry="6.8" transform="rotate(-6 19.5 11)" />
      <ellipse cx="30" cy="11" rx="5" ry="6.8" transform="rotate(8 30 11)" />
      <ellipse cx="38" cy="20.5" rx="5" ry="6.5" transform="rotate(22 38 20.5)" />
      <path d="M24.5 22c-6.5 0-13 7.5-13 13.2 0 4.6 3.6 6.3 7 5.3 2.3-.7 3.8-1.6 6-1.6s3.7.9 6 1.6c3.4 1 7-.7 7-5.3 0-5.7-6.5-13.2-13-13.2z" />
    </svg>
  );
}

/** Traço de marca-texto (desenha com a rolagem). */
function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 16" preserveAspectRatio="none" className={`pointer-events-none absolute ${className}`} aria-hidden>
      <path data-stroke d="M4 10 C 50 4, 110 13, 196 6" stroke={MARKER} strokeWidth="6" strokeLinecap="round" fill="none" pathLength={1} />
    </svg>
  );
}

/** Risquinhos em volta do "não." */
function Sparks({ side }: { side: "l" | "r" }) {
  const flip = side === "l" ? "scale(-1,1) translate(-40,0)" : undefined;
  return (
    <svg
      viewBox="0 0 40 40"
      className={`absolute top-1/2 h-[0.7em] w-[0.7em] -translate-y-1/2 ${side === "l" ? "-left-[0.75em]" : "-right-[0.75em]"}`}
      aria-hidden
    >
      <g transform={flip} stroke={MARKER} strokeWidth="4.5" strokeLinecap="round" data-sparks>
        <path d="M8 8 L18 14" />
        <path d="M6 22 L20 22" />
        <path d="M8 36 L18 30" />
      </g>
    </svg>
  );
}

export function Frase() {
  const root = useRef<HTMLElement>(null);

  useReveal(root, (q) => {
    const card = q("[data-card]")[0];
    const lines = q("[data-line]");
    const strokes = q("[data-stroke]");
    const sparks = q("[data-sparks]");
    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    if (prefersReducedMotion()) {
      gsap.set(strokes, { strokeDashoffset: 0 });
      return;
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 72%", once: true } });
    // o cartão chega girando, como se alguém mostrasse para a câmera
    tl.from(card, { y: 140, rotation: -12, scale: 0.88, autoAlpha: 0, duration: 1.2, ease: "power3.out" })
      // cada linha é "escrita" da esquerda para a direita
      .fromTo(
        lines,
        { clipPath: "inset(-20% 100% -20% 0%)" },
        { clipPath: "inset(-20% 0% -20% 0%)", duration: 0.55, ease: "power1.inOut", stagger: 0.32 },
        0.55,
      )
      .from(q("[data-big]"), { scale: 0.6, duration: 0.6, ease: "back.out(3)" }, 0.55 + 0.32 * 2)
      .from(sparks, { scale: 0, transformOrigin: "50% 50%", duration: 0.4, ease: "back.out(3)", stagger: 0.08 }, 0.55 + 0.32 * 2 + 0.3);
    // marca-texto: cada traço desenha logo depois da sua linha
    strokes.forEach((s) => {
      const line = s.closest("[data-line]");
      const idx = lines.indexOf(line as HTMLElement);
      tl.to(s, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 0.55 + 0.32 * idx + 0.45);
    });
    // leve balanço com a rolagem
    gsap.fromTo(
      q("[data-tilt]"),
      { rotation: -2 },
      { rotation: 2, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
    );
  });

  return (
    <section ref={root} data-loop-zone aria-label={frase.rotulo} className="bg-glow-c relative overflow-hidden py-16 sm:py-36">
      <p data-reveal="fade-up" className="eyebrow mb-8 flex items-center sm:mb-14 justify-center gap-2 px-5 text-center">
        <Sparkle className="h-3 w-3" color="var(--lime-cta)" />
        {frase.rotulo}
      </p>

      <div className="relative mx-auto w-[66vw] max-w-[500px] sm:w-[86vw]">
        {/* balões em volta (vermelho, amarelo e azul, como na foto) */}
        <div aria-hidden className="pointer-events-none absolute -left-[16%] -top-[10%] w-[24%] sm:-left-[26%]">
          <Balloon color="#E8262B" className="floaty floaty-lg w-full" style={{ "--d": "8s", "--r": "-8deg" } as CSSProperties} />
        </div>
        <div aria-hidden className="pointer-events-none absolute -left-[4%] -top-[16%] hidden w-[15%] sm:-left-[12%] sm:block">
          <Balloon color="#FFC928" className="floaty w-full" style={{ "--d": "9s", "--r": "6deg", "--delay": "1s" } as CSSProperties} />
        </div>
        <div aria-hidden className="pointer-events-none absolute -bottom-[10%] -right-[14%] w-[22%] sm:-right-[24%]">
          <Balloon color="#1F4FD1" className="floaty floaty-lg w-full" style={{ "--d": "7.5s", "--r": "8deg", "--delay": "0.5s" } as CSSProperties} />
        </div>
        <div aria-hidden className="pointer-events-none absolute -right-[4%] bottom-[2%] hidden w-[14%] sm:-right-[11%] sm:block">
          <Balloon color="#E8262B" className="floaty w-full" style={{ "--d": "10s", "--r": "-5deg", "--delay": "2s" } as CSSProperties} />
        </div>

        {/* inclinação fixa no wrapper; o GSAP anima só o cartão */}
        <div className="rotate-[-6deg]">
          <div data-tilt>
            <blockquote
              data-card
              className="relative rounded-[6px] px-[9%] pb-[12%] pt-[13%] text-center shadow-[0_24px_50px_-20px_rgba(0,0,0,0.75),0_2px_0_rgba(255,255,255,0.6)_inset] sm:shadow-[0_40px_80px_-25px_rgba(0,0,0,0.75),0_2px_0_rgba(255,255,255,0.6)_inset]"
              style={{ background: "linear-gradient(160deg, #FFFDF6 0%, #FBF5E6 100%)", color: INK }}
            >
              {/* textura sutil de papel */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[6px] opacity-[0.35] mix-blend-multiply"
                style={{
                  background:
                    "radial-gradient(120% 80% at 20% 0%, transparent 60%, rgba(160,130,90,.18)), radial-gradient(90% 70% at 100% 100%, transparent 55%, rgba(160,130,90,.16))",
                }}
              />
              <Paw className="absolute left-[7%] top-[6%] h-5 w-5 -rotate-12 sm:h-11 sm:w-11" />
              <Paw className="absolute bottom-[6%] right-[8%] h-5 w-5 rotate-12 sm:h-11 sm:w-11" />

              <div className="relative font-[family-name:var(--font-hand)] text-[clamp(0.98rem,4.1vw,2.35rem)] font-semibold leading-[1.08]">
                {frase.linhas.map((l, i) => {
                  const big = "destaque" in l && l.destaque === "grande";
                  const under = "destaque" in l && l.destaque === "sublinhado";
                  const gap = "gap" in l && l.gap;
                  return (
                    <p key={i} data-line className={`${gap ? "mt-[0.55em]" : ""}`}>
                      {big ? (
                        <span data-big className="relative my-[0.05em] inline-block text-[2.05em] font-bold leading-[1]">
                          <Sparks side="l" />
                          {l.texto}
                          <Sparks side="r" />
                          <Underline className="-bottom-[0.02em] left-[-6%] h-[0.22em] w-[112%]" />
                        </span>
                      ) : under ? (
                        <span className="relative inline-block">
                          {l.texto}
                          <Underline className="-bottom-[0.18em] left-[-4%] h-[0.32em] w-[108%]" />
                        </span>
                      ) : (
                        l.texto
                      )}
                    </p>
                  );
                })}
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
