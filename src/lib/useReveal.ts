"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion, isCalm } from "./gsap";

/**
 * Animações de entrada por atributo, dentro de uma seção:
 *  data-reveal="words"   → palavras sobem com máscara
 *  data-reveal="chars"   → letras sobem com leve giro
 *  data-reveal="flip"    → letras viram em 3D (rotateX)
 *  data-reveal="skew"    → linhas sobem inclinadas
 *  data-reveal="lines"   → parágrafo por linha
 *  data-reveal="fade-up" → elemento sobe com fade
 *  data-reveal="stagger" → filhos diretos entram em sequência
 *  data-reveal="clip"    → foto abre com clip-path + escala
 * e data-exit → conteúdo se afasta (scale-down + fade) quando a seção sai da tela.
 */
/**
 * background-clip:text não atravessa filhos transformados. Depois do split,
 * cada pedaço dentro de .text-grad recebe o gradiente "fatiado" na posição certa.
 */
function fixGradient(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>(".text-grad").forEach((g) => {
    const gr = g.getBoundingClientRect();
    const leaves = Array.from(g.querySelectorAll<HTMLElement>("div, span")).filter((c) => !c.querySelector("div, span"));
    leaves.forEach((c) => {
      const r = c.getBoundingClientRect();
      Object.assign(c.style, {
        backgroundImage: "var(--grad-title)",
        backgroundSize: `${gr.width}px ${gr.height}px`,
        backgroundPosition: `${gr.left - r.left}px ${gr.top - r.top}px`,
        backgroundRepeat: "no-repeat",
        webkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      });
    });
  });
}

/** opts.always: roda o `extra` também no celular (lógica necessária: carrossel, contadores, confete). */
export function useReveal(scope: RefObject<HTMLElement | null>, extra?: (q: (s: string) => HTMLElement[]) => void, opts: { always?: boolean } = {}) {
  useGSAP(
    (_ctx, contextSafe) => {
      const el = scope.current;
      if (!el) return;
      // Só monta as animações quando a seção se aproxima da tela (alivia o carregamento inicial).
      const setup = contextSafe!(() => run(el));
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          setup();
        },
        { rootMargin: "120% 0px 120% 0px" },
      );
      io.observe(el);
      return () => io.disconnect();

      function run(el: HTMLElement) {
        const q = (s: string) => gsap.utils.toArray<HTMLElement>(el.querySelectorAll(s));
        const reduce = prefersReducedMotion();
        const st = (trigger: Element, start = "top 85%") => ({ trigger, start, once: true });

        if (reduce) {
          q("[data-reveal]").forEach((n) => gsap.from(n, { autoAlpha: 0, duration: 0.6, scrollTrigger: st(n, "top 95%") }));
          extra?.(q);
          return;
        }

        // celular: só um fade suave, sem letras voando nem efeitos extras
        if (isCalm()) {
          q("[data-reveal]").forEach((n) => gsap.from(n, { y: 16, autoAlpha: 0, duration: 0.6, ease: "power2.out", scrollTrigger: st(n, "top 92%") }));
          if (opts.always) extra?.(q);
          ScrollTrigger.refresh();
          return;
        }

        // ---- elementos (não dependem de fonte) ----
        q('[data-reveal="fade-up"]').forEach((n) =>
          gsap.from(n, { y: 40, autoAlpha: 0, duration: 1, ease: "power3.out", delay: Number(n.dataset.delay || 0), scrollTrigger: st(n) }),
        );
        q('[data-reveal="stagger"]').forEach((n) =>
          gsap.from(n.children, { y: 50, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.09, scrollTrigger: st(n) }),
        );
        q('[data-reveal="clip"]').forEach((n) => {
          const img = n.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: st(n, "top 80%") });
          tl.fromTo(n, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
          if (img) tl.from(img, { scale: 1.35, duration: 1.8, ease: "expo.out" }, 0.2);
        });

        // ---- textos (esperam as fontes para medir certo) ----
        const splitText = contextSafe!(() => {
          const aria = (n: HTMLElement) => (/^H\d$/.test(n.tagName) ? "auto" : "none");
          q('[data-reveal="words"]').forEach((n) => {
            const s = SplitText.create(n, { type: "words", mask: "words", aria: aria(n) });
            fixGradient(n);
            gsap.from(s.words, { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.06, scrollTrigger: st(n) });
          });
          q('[data-reveal="chars"]').forEach((n) => {
            const s = SplitText.create(n, { type: "words,chars", mask: "words", aria: aria(n) });
            fixGradient(n);
            gsap.from(s.chars, { yPercent: 115, rotate: 8, duration: 0.9, ease: "power4.out", stagger: 0.022, scrollTrigger: st(n) });
          });
          q('[data-reveal="flip"]').forEach((n) => {
            const s = SplitText.create(n, { type: "words,chars", aria: aria(n) });
            fixGradient(n);
            gsap.set(n, { perspective: 600 });
            gsap.from(s.chars, {
              rotateX: -90,
              yPercent: 40,
              autoAlpha: 0,
              transformOrigin: "50% 100% -20px",
              duration: 0.9,
              ease: "back.out(1.8)",
              stagger: 0.02,
              scrollTrigger: st(n),
            });
          });
          q('[data-reveal="skew"]').forEach((n) => {
            const s = SplitText.create(n, { type: "lines", mask: "lines", aria: aria(n) });
            fixGradient(n);
            gsap.from(s.lines, { yPercent: 120, skewY: 7, duration: 1.1, ease: "power4.out", stagger: 0.1, scrollTrigger: st(n) });
          });
          q('[data-reveal="lines"]').forEach((n) => {
            const s = SplitText.create(n, { type: "lines", mask: "lines", aria: "none" });
            gsap.from(s.lines, { yPercent: 105, duration: 0.9, ease: "power3.out", stagger: 0.08, delay: 0.15, scrollTrigger: st(n) });
          });
          ScrollTrigger.refresh();
        });
        document.fonts.ready.then(splitText);

        // ---- saída da seção ----
        q("[data-exit]").forEach((n) =>
          gsap.to(n, {
            scale: 0.95,
            y: -30,
            autoAlpha: 0.35,
            ease: "none",
            scrollTrigger: { trigger: el, start: "bottom 70%", end: "bottom top", scrub: true },
          }),
        );

        extra?.(q);
        ScrollTrigger.refresh();
      }
    },
    { scope },
  );
}
