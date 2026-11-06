"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { contato } from "@/data/contato";
import { whatsappLink } from "@/lib/whatsapp";
import { useReveal } from "@/lib/useReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaButton } from "@/components/ui/CtaButton";

const MapaLeaflet = dynamic(() => import("@/components/ui/MapaLeaflet"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-white/[0.04]" />,
});

const num = (v: string) => (/^-?\d+(\.\d+)?$/.test(v.trim()) ? Number(v) : null);

function Info({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:gap-4 sm:border-t sm:border-white/10 sm:py-5 sm:first:border-t-0 sm:first:pt-0">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-[var(--lime-cta)] sm:h-11 sm:w-11 sm:rounded-xl">{icon}</span>
      <div className="min-w-0">
        <p className="eyebrow !text-[0.6rem] sm:!text-[0.66rem]">{label}</p>
        <div className="mt-0.5 break-words text-[0.8rem] font-semibold leading-snug sm:mt-1 sm:text-base">{children}</div>
      </div>
    </div>
  );
}

const ic = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function OndeEstamos() {
  const root = useRef<HTMLElement>(null);
  const mapBox = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);
  const [fly, setFly] = useState(false);

  useReveal(root);

  // carrega o mapa perto da tela e dispara o voo quando ele aparece
  useEffect(() => {
    const el = mapBox.current;
    if (!el) return;
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: "600px" });
    const seen = new IntersectionObserver(([e]) => e.isIntersecting && setFly(true), { threshold: 0.45 });
    near.observe(el);
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  const lat = num(contato.latitude);
  const lng = num(contato.longitude);
  const provisorio = lat === null || lng === null;
  const pos = provisorio ? contato.mapaProvisorio : { lat: lat!, lng: lng! };
  const enderecoCompleto = `${contato.endereco}, ${contato.cidade} - ${contato.uf}`;
  const googleUrl = provisorio
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`
    : `https://www.google.com/maps/search/?api=1&query=${pos.lat},${pos.lng}`;
  const wazeUrl = provisorio
    ? `https://waze.com/ul?q=${encodeURIComponent(enderecoCompleto)}&navigate=yes`
    : `https://waze.com/ul?ll=${pos.lat},${pos.lng}&navigate=yes`;
  const s = contato.secao;

  return (
    <section ref={root} id="onde-estamos" aria-labelledby="mapa-title" className="bg-glow-b relative overflow-hidden py-16 sm:py-36">
      <div data-exit className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading id="mapa-title" eyebrow={s.eyebrow} title={s.titulo} reveal="chars" />
        <div className="mt-8 grid gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div
            ref={mapBox}
            data-reveal="clip"
            className="relative h-[280px] overflow-hidden rounded-[22px] sm:rounded-[30px] border border-white/12 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.8)] sm:h-[520px]"
          >
            {load && (
              <MapaLeaflet
                lat={pos.lat}
                lng={pos.lng}
                nome={contato.nome}
                endereco={enderecoCompleto}
                googleUrl={googleUrl}
                wazeUrl={wazeUrl}
                labels={s}
                fly={fly}
              />
            )}
            {provisorio && (
              <p className="pointer-events-none absolute right-4 top-4 z-[600] max-w-[calc(100%-5rem)] rounded-full border border-dashed border-[var(--lime-cta)]/70 bg-[var(--bg-deep)]/85 px-3 py-1.5 text-[0.7rem] font-bold text-[var(--lime-cta)] backdrop-blur">
                {s.coordenadasPendentes}
              </p>
            )}
          </div>

          <div
            data-reveal="fade-up"
            className="flex flex-col rounded-[22px] border border-white/12 bg-white/[0.04] p-5 backdrop-blur-sm sm:rounded-[30px] sm:p-9"
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:block">
              <Info
                label={s.labels.endereco}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ic} aria-hidden>
                    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0114 0C19 14.8 12 21 12 21z" />
                    <circle cx="12" cy="9.5" r="2.5" />
                  </svg>
                }
              >
                {contato.endereco}
                <br />
                <span className="text-[var(--text-muted)]">
                  {contato.cidade} - {contato.uf} · {contato.cep}
                </span>
              </Info>
              <Info
                label={s.labels.horario}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ic} aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>
                }
              >
                {contato.horario}
              </Info>
              <Info
                label={s.labels.whatsapp}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ic} aria-hidden>
                    <path d="M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z" />
                    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 01-1.8-1.8l.8-1-1-2L9 9.5z" />
                  </svg>
                }
              >
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  {contato.whatsappExibicao}
                </a>
              </Info>
              <Info
                label={s.labels.instagram}
                icon={
                  <svg viewBox="0 0 24 24" className="h-5 w-5" {...ic} aria-hidden>
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
                  </svg>
                }
              >
                <a href={contato.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
                  @{contato.instagram}
                </a>
              </Info>
            </div>
            <div className="mt-auto flex flex-wrap gap-2 pt-4 sm:gap-3 sm:pt-6">
              <CtaButton href={googleUrl} size="sm" variant="ghost" noConfetti>
                {s.googleMaps}
              </CtaButton>
              <CtaButton href={wazeUrl} size="sm" variant="ghost" noConfetti>
                {s.waze}
              </CtaButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
