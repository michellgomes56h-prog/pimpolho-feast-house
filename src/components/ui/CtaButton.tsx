"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { burstConfetti } from "./confetti";

type Common = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  className?: string;
  /** Desliga o confete no clique. */
  noConfetti?: boolean;
  /** Atributos de dados extras (ex.: data-intro). */
  dataAttrs?: Record<`data-${string}`, string>;
};
type AsLink = Common & { href: string; external?: boolean; onClick?: (e: MouseEvent<HTMLAnchorElement>) => void };
type AsButton = Common & { href?: undefined; onClick?: (e: MouseEvent<HTMLButtonElement>) => void; type?: "button" | "submit" };
export type CtaButtonProps = AsLink | AsButton;

function Arrow({ className }: { className: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Botão de ação/orçamento: magnético, brilho em loop, borda cônica girando no hover,
 * seta que sai e volta e explosão de confetes no clique.
 */
export function CtaButton(props: CtaButtonProps) {
  const { children, variant = "primary", size = "md", className = "", noConfetti, dataAttrs } = props;
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  // efeito magnético (só em dispositivos com mouse e sem movimento reduzido)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
    const ixTo = innerRef.current ? gsap.quickTo(innerRef.current, "x", { duration: 0.6, ease: "power3.out" }) : null;
    const iyTo = innerRef.current ? gsap.quickTo(innerRef.current, "y", { duration: 0.6, ease: "power3.out" }) : null;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.28);
      yTo(dy * 0.38);
      ixTo?.(dx * 0.1);
      iyTo?.(dy * 0.1);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
      ixTo?.(0);
      iyTo?.(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  const handleClick = (e: MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => {
    if (!noConfetti) {
      const r = e.currentTarget.getBoundingClientRect();
      const x = e.clientX || r.left + r.width / 2;
      const y = e.clientY || r.top + r.height / 2;
      burstConfetti(x, y);
    }
    (props.onClick as ((e: MouseEvent<HTMLAnchorElement & HTMLButtonElement>) => void) | undefined)?.(e);
  };

  const classes = `cta cta--${variant} ${size === "sm" ? "cta--sm" : ""} ${className}`;
  const content = (
    <>
      <span className="cta__shine" aria-hidden />
      <span ref={innerRef} className="relative inline-flex items-center gap-[inherit]">
        <span>{children}</span>
        <span className="cta__icon" aria-hidden>
          <Arrow className="cta__arrow cta__arrow--a" />
          <Arrow className="cta__arrow cta__arrow--b" />
        </span>
      </span>
    </>
  );

  if ("href" in props && props.href) {
    const ext = props.external ?? /^https?:/.test(props.href);
    return (
      <a
        ref={ref}
        href={props.href}
        className={classes}
        onClick={handleClick}
        data-cursor="hover"
        {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...dataAttrs}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type={(props as AsButton).type ?? "button"} className={classes} onClick={handleClick} data-cursor="hover" {...dataAttrs}>
      {content}
    </button>
  );
}
