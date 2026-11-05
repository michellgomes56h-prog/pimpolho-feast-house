"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/** Rola suavemente até um seletor (#id). Usa Lenis quando disponível. */
export function useScrollTo() {
  const lenis = useLenis();
  return (target: string) => {
    const el = document.querySelector<HTMLElement>(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
}

/** Lenis integrado ao ScrollTrigger (desligado com prefers-reduced-motion). */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  // pausa animações CSS em loop das seções fora da tela
  useEffect(() => {
    const zones = document.querySelectorAll<HTMLElement>("[data-loop-zone]");
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.target.toggleAttribute("data-paused", !e.isIntersecting)), {
      rootMargin: "80px 0px",
    });
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Smooth scroll só com mouse/trackpad; no toque a rolagem nativa é melhor (e mais leve).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const instance = new Lenis({ duration: 1.15, smoothWheel: true, autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- instância externa criada no cliente
    setLenis(instance);
    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
