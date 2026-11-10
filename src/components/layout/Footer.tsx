"use client";

import type { MouseEvent } from "react";
import { footer, nav, site } from "@/data/site";
import { contato } from "@/data/contato";
import { whatsappLink } from "@/lib/whatsapp";
import { PimpolhoWordmark } from "@/components/brand/PimpolhoWordmark";
import { useLenis, useScrollTo } from "@/components/providers/SmoothScroll";

export function Footer() {
  const scrollTo = useScrollTo();
  const lenis = useLenis();
  const go = (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(href);
  };
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0, { duration: 1.8 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const ano = new Date().getFullYear();
  const link = "text-white/80 transition-colors hover:text-white";

  return (
    <footer data-loop-zone className="relative overflow-hidden border-t border-white/10 bg-[var(--bg-darkest)] pt-12 sm:pt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-[var(--glow-amber)] opacity-10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 text-sm sm:gap-12 sm:text-base lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <a href="#topo" onClick={toTop} className="inline-flex items-end gap-3">
              <PimpolhoWordmark className="text-4xl sm:text-5xl" />
              <span className="mb-1 text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.32em] text-[var(--text-muted)]">
                Feast
                <br />
                House
              </span>
            </a>
            <p className="mt-3 max-w-xs text-[var(--text-muted)] sm:mt-5">{footer.frase}</p>
          </div>

          <nav aria-label="Rodapé">
            <p className="eyebrow mb-3 sm:mb-5">{footer.colunas.navegar}</p>
            <ul className="space-y-2 sm:space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={go(l.href)} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-3 sm:mb-5">{footer.colunas.contato}</p>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp · {contato.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={contato.instagramUrl} target="_blank" rel="noopener noreferrer" className={link}>
                  Instagram · @{contato.instagram}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow mb-3 sm:mb-5">{footer.colunas.visite}</p>
            <address className="space-y-1 not-italic text-white/80">
              <p>{contato.endereco}</p>
              <p>
                {contato.cidade} - {contato.uf}
              </p>
            </address>
          </div>
        </div>

        {/* wordmark gigante */}
        <div aria-hidden className="mt-10 flex select-none sm:mt-20 justify-center overflow-hidden opacity-90">
          <PimpolhoWordmark decorative className="translate-y-[18%] text-[clamp(5rem,22vw,22rem)] leading-[0.8]" />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-5 pb-28 pt-6 text-sm text-[var(--text-muted)] sm:flex-row sm:px-8 sm:pb-6 sm:pr-[280px] lg:pl-12">
          <p>
            {footer.direitos} · {ano}
          </p>
          <a href="#topo" onClick={toTop} className={link}>
            {footer.topo} ↑
          </a>
          <a href={site.creditos.url} className="text-xs tracking-wide text-white/75 transition-colors hover:text-white">
            {site.creditos.texto}
          </a>
        </div>
      </div>
    </footer>
  );
}
