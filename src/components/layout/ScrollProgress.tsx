"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/** Barra de progresso da página (3px) com gradiente do wordmark e glow na ponta. */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!bar.current || !tip.current) return;
    const setBar = gsap.quickSetter(bar.current, "scaleX");
    const setTip = gsap.quickSetter(tip.current, "x", "px");
    const update = (p: number) => {
      setBar(p);
      setTip(p * window.innerWidth);
      tip.current!.style.opacity = p > 0.002 && p < 0.998 ? "1" : "0";
    };
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => update(self.progress),
      onRefresh: (self) => update(self.progress),
    });
    return () => st.kill();
  });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px]">
      <div className="absolute inset-0 bg-white/[0.06]" />
      <div
        ref={bar}
        className="absolute inset-0 origin-left scale-x-0"
        style={{ background: "linear-gradient(90deg, var(--pp-P), var(--pp-m), var(--pp-p), var(--pp-o2))" }}
      />
      <div ref={tip} className="absolute -left-2 top-1/2 -mt-2 h-4 w-4 opacity-0 transition-opacity duration-300">
        <span className="absolute inset-0 rounded-full bg-[var(--pp-o2)] blur-[6px]" />
        <span className="absolute inset-[5px] rounded-full bg-white" />
      </div>
    </div>
  );
}
