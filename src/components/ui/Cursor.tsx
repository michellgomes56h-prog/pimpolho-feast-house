"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HOVER_SEL = 'a, button, [role="button"], [data-cursor="hover"], img, label, summary';

/** Cursor custom: ponto + anel que cresce sobre links/fotos. Desligado em touch. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-custom-cursor");
    const d = dot.current;
    const r = ring.current;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(d, "x", { duration: 0.08 });
    const dy = gsap.quickTo(d, "y", { duration: 0.08 });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3.out" });
    let shown = false;
    let hovering = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        gsap.to([d, r], { autoAlpha: 1, duration: 0.3 });
        shown = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const over = !!(e.target as Element | null)?.closest?.(HOVER_SEL);
      if (over !== hovering) {
        hovering = over;
        gsap.to(r, { scale: over ? 1.9 : 1, duration: 0.35, ease: "power3.out" });
        gsap.to(d, { scale: over ? 0 : 1, duration: 0.25 });
        r.classList.toggle("is-hover", over);
      }
    };
    const leave = () => {
      gsap.to([d, r], { autoAlpha: 0, duration: 0.2 });
      shown = false;
    };
    const down = () => gsap.to(r, { scale: hovering ? 1.7 : 0.75, duration: 0.15 });
    const up = () => gsap.to(r, { scale: hovering ? 1.9 : 1, duration: 0.3, ease: "back.out(3)" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10000] h-9 w-9 rounded-full border border-white/70 opacity-0 transition-[background-color,border-color] duration-300 [&.is-hover]:border-[var(--lime-cta)] [&.is-hover]:bg-[color-mix(in_oklab,var(--lime-cta)_10%,transparent)]"
      />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-[var(--lime-cta)] opacity-0" />
    </>
  );
}
