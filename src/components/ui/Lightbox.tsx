"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useLenis } from "@/components/providers/SmoothScroll";

type Item = { src: string; alt: string; legenda: string };
type Props = {
  items: Item[];
  index: number;
  /** Retângulo da miniatura clicada (de onde a foto "voa"). */
  from: DOMRect | null;
  /** Retângulo da miniatura de um índice, se estiver visível (para "voltar" ao fechar). */
  getRect: (i: number) => DOMRect | null;
  labels: { fechar: string; anterior: string; proxima: string };
  onClose: () => void;
};

const RADIUS = 28;

/** Calcula o tamanho final da foto, cabendo na tela com a proporção original. */
function targetBox(ratio: number) {
  const maxW = Math.min(window.innerWidth * (window.innerWidth < 640 ? 0.94 : 0.86), 1400);
  const maxH = window.innerHeight * (window.innerWidth < 640 ? 0.62 : 0.76);
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }
  return { w, h, left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2 - (window.innerWidth < 640 ? 20 : 10) };
}

/** Transformação que faz a foto (no tamanho final) coincidir com a miniatura — FLIP sem distorção. */
function flipFrom(rect: DOMRect, box: ReturnType<typeof targetBox>) {
  const s = Math.max(rect.width / box.w, rect.height / box.h);
  const visW = rect.width / s;
  const visH = rect.height / s;
  const ix = (box.w - visW) / 2;
  const iy = (box.h - visH) / 2;
  return {
    x: rect.left + rect.width / 2 - (box.left + box.w / 2),
    y: rect.top + rect.height / 2 - (box.top + box.h / 2),
    scale: s,
    clipPath: `inset(${iy}px ${ix}px ${iy}px ${ix}px round ${RADIUS / s}px)`,
  };
}

export function Lightbox({ items, index, from, getRect, labels, onClose }: Props) {
  const [idx, setIdx] = useState(index);
  const overlay = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const closing = useRef(false);
  const lenis = useLenis();
  const item = items[idx];

  // proporção da foto: lida da miniatura já carregada (o lightbox só existe no cliente)
  const ratio = useMemo(() => {
    const thumb = document.querySelectorAll<HTMLImageElement>("#galeria [data-frame] img")[idx];
    return thumb && thumb.naturalWidth ? thumb.naturalWidth / thumb.naturalHeight : 4 / 3;
  }, [idx]);
  const box = useMemo(() => targetBox(ratio), [ratio]);

  // abertura (voo da miniatura até o centro)
  const opened = useRef(false);
  useLayoutEffect(() => {
    if (!box || opened.current) return;
    opened.current = true;
    lastFocus.current = document.activeElement;
    const reduce = prefersReducedMotion();
    gsap.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0.2 : 0.5, ease: "power2.out" });
    if (from && !reduce) {
      gsap.fromTo(frame.current, flipFrom(from, box), {
        x: 0,
        y: 0,
        scale: 1,
        clipPath: `inset(0px 0px 0px 0px round ${RADIUS}px)`,
        duration: 0.85,
        ease: "expo.inOut",
      });
    }
    gsap.from(overlay.current!.querySelectorAll("[data-ui]"), { autoAlpha: 0, y: 14, duration: 0.5, delay: 0.45, stagger: 0.05 });
    closeBtn.current?.focus();
  }, [box, from]);

  // trava a rolagem da página
  useEffect(() => {
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [lenis]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const rect = getRect(idx);
    const reduce = prefersReducedMotion();
    const done = () => {
      onClose();
      (lastFocus.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
    const tl = gsap.timeline({ onComplete: done });
    tl.to(overlay.current!.querySelectorAll("[data-ui]"), { autoAlpha: 0, duration: 0.2 }, 0);
    if (rect && box && !reduce) {
      tl.to(frame.current, { ...flipFrom(rect, box), duration: 0.7, ease: "expo.inOut" }, 0).to(overlay.current, { autoAlpha: 0, duration: 0.35 }, 0.4);
    } else {
      tl.to(frame.current, { scale: 0.9, autoAlpha: 0, duration: 0.3 }, 0).to(overlay.current, { autoAlpha: 0, duration: 0.3 }, 0.1);
    }
  }, [box, getRect, idx, onClose]);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = (idx + dir + items.length) % items.length;
      gsap.to(imgWrap.current, {
        x: -60 * dir,
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setIdx(next);
          gsap.fromTo(imgWrap.current, { x: 60 * dir, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out", delay: 0.05 });
        },
      });
    },
    [idx, items.length],
  );

  // teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Tab" && overlay.current) {
        const f = overlay.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, go]);

  // swipe
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => (start.current = { x: e.clientX, y: e.clientY });
  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label={item.legenda}
      className="invisible fixed inset-0 z-[80] touch-pan-y select-none"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="absolute inset-0 bg-[#0b0626]/85 backdrop-blur-xl" onClick={close} />

      {box && (
        <div
          ref={frame}
          className="absolute overflow-hidden rounded-[28px] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          style={{ left: box.left, top: box.top, width: box.w, height: box.h }}
        >
          <div ref={imgWrap} className="absolute inset-0">
            <Image key={item.src} src={item.src} alt={item.alt} fill sizes="90vw" className="object-cover" priority />
          </div>
        </div>
      )}

      {/* legenda + contador */}
      <div data-ui className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-1 px-6 text-center sm:bottom-8">
        <p className="text-lg font-bold">{item.legenda}</p>
        <p className="text-xs font-semibold tracking-[0.3em] text-[var(--text-muted)]">
          {String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>

      <button
        ref={closeBtn}
        data-ui
        type="button"
        onClick={close}
        aria-label={labels.fechar}
        className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition-colors hover:bg-white hover:text-[#160c45] sm:right-8 sm:top-8"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      {(
        [
          [-1, labels.anterior, "left-3 sm:left-8", "M15 5l-7 7 7 7"],
          [1, labels.proxima, "right-3 sm:right-8", "M9 5l7 7-7 7"],
        ] as const
      ).map(([dir, label, pos, d]) => (
        <button
          key={dir}
          data-ui
          type="button"
          onClick={() => go(dir)}
          aria-label={label}
          className={`absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition-colors hover:bg-[var(--lime-cta)] hover:text-[#160c45] sm:h-14 sm:w-14 ${pos}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d={d} />
          </svg>
        </button>
      ))}
    </div>,
    document.body,
  );
}
