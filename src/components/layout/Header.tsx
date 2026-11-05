"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { PimpolhoWordmark } from "@/components/brand/PimpolhoWordmark";
import { CtaButton } from "@/components/ui/CtaButton";
import { useLenis, useScrollTo } from "@/components/providers/SmoothScroll";
import { header, nav, site } from "@/data/site";
import { contato } from "@/data/contato";
import { whatsappLink } from "@/lib/whatsapp";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { ScrollProgress } from "./ScrollProgress";

function Brand({ onClick }: { onClick?: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a href="#topo" onClick={onClick} className="group flex items-center gap-2.5 leading-none">
      <PimpolhoWordmark className="text-[1.65rem] sm:text-[1.85rem]" />
      <span className="mt-1 flex flex-col text-[0.6rem] font-semibold uppercase leading-[1.15] tracking-[0.32em] text-[var(--text-muted)] transition-colors group-hover:text-white">
        <span>{site.subMarca.split(" ")[0]}</span>
        <span>{site.subMarca.split(" ").slice(1).join(" ")}</span>
      </span>
    </a>
  );
}

/** Link com texto que "rola" para cima no hover. */
function RollLink({ label, href, onClick }: { label: string; href: string; onClick: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <a href={href} onClick={onClick} className="group relative block overflow-hidden px-1 py-1 text-[0.9rem] font-medium text-white/80 hover:text-white">
      <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full">{label}</span>
      <span
        aria-hidden
        className="text-grad absolute inset-x-1 top-full block py-0 transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-full"
      >
        {label}
      </span>
    </a>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const scrollTo = useScrollTo();
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // timeline do menu mobile
  useGSAP(
    () => {
      const m = menuRef.current;
      if (!m) return;
      const reduce = prefersReducedMotion();
      gsap.set(m, { autoAlpha: 0 });
      const t = gsap.timeline({ paused: true });
      t.to(m, { autoAlpha: 1, duration: 0.01 })
        .fromTo(
          m.querySelector("[data-menu-bg]"),
          { clipPath: "circle(0% at 92% 4%)" },
          { clipPath: "circle(150% at 92% 4%)", duration: reduce ? 0.2 : 0.8, ease: "power3.inOut" },
        )
        .from(
          m.querySelectorAll("[data-menu-item]"),
          { yPercent: 110, rotate: 4, autoAlpha: 0, duration: 0.7, ease: "power4.out", stagger: 0.07 },
          reduce ? 0 : "-=0.35",
        )
        .from(m.querySelectorAll("[data-menu-foot]"), { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, "-=0.45");
      tl.current = t;
    },
    { scope: menuRef },
  );

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      tl.current.timeScale(1.8).reverse();
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setOpen(false);
    if (href === "#topo") {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // espera o menu começar a fechar para rolar
    setTimeout(() => scrollTo(href), open ? 250 : 0);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled ? "glass !border-x-0 !border-t-0 border-b-white/10" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
          <Brand onClick={go("#topo")} />

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7 xl:gap-9">
              {nav.map((l) => (
                <li key={l.href}>
                  <RollLink label={l.label} href={l.href} onClick={go(l.href)} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <CtaButton href={whatsappLink()} variant="ghost" size="sm">
                {header.cta}
              </CtaButton>
            </div>
            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? header.menuFechar : header.menuAbrir}
              className="relative z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-[2px] w-5 rounded bg-white transition-transform duration-500 ease-[var(--ease-out)] ${open ? "translate-y-[5px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[2px] rounded bg-white transition-all duration-500 ease-[var(--ease-out)] ${open ? "w-5 -translate-y-[5px] -rotate-45" : "w-3.5"}`}
                />
              </span>
            </button>
          </div>
        </div>
        <ScrollProgress />
      </header>

      {/* Menu mobile em tela cheia */}
      <div ref={menuRef} id="menu-mobile" className="invisible fixed inset-0 z-40 lg:hidden" aria-hidden={!open} inert={!open}>
        <div data-menu-bg className="section-bg noise absolute inset-0" />
        <div className="relative flex h-full flex-col px-6 pb-10 pt-[calc(var(--header-h)+2rem)]">
          <p className="eyebrow mb-6" data-menu-foot>
            ✦ Menu
          </p>
          <nav aria-label="Menu mobile">
            <ul className="space-y-1">
              {nav.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <a
                    href={l.href}
                    onClick={go(l.href)}
                    data-menu-item
                    className="flex items-baseline gap-4 py-1.5 text-[2.6rem] font-extrabold leading-tight tracking-[-0.03em] text-white"
                  >
                    <span className="w-7 text-xs font-semibold tracking-widest text-[var(--text-muted)]">0{i + 1}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-5">
            <div data-menu-foot>
              <CtaButton href={whatsappLink()}>{header.cta}</CtaButton>
            </div>
            <p data-menu-foot className="text-sm text-[var(--text-muted)]">
              {contato.endereco} · @{contato.instagram}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
