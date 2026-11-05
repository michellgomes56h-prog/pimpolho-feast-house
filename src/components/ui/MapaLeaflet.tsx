"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

export type MapaProps = {
  lat: number;
  lng: number;
  nome: string;
  endereco: string;
  googleUrl: string;
  wazeUrl: string;
  labels: { googleMaps: string; waze: string; dicaZoom: string };
  /** Dispara o voo (flyTo) até o endereço. */
  fly: boolean;
};

const pin = L.divIcon({
  className: "",
  html: '<div class="pp-pin"><span class="pp-pin__ring"></span><span class="pp-pin__ring"></span><span class="pp-pin__ring"></span><span class="pp-pin__shadow"></span><span class="pp-pin__head"></span></div>',
  iconSize: [64, 64],
  iconAnchor: [32, 32],
  popupAnchor: [0, -30],
});

/** Voo suave até o ponto + zoom com Ctrl/clique (sem travar a rolagem da página). */
function Behaviour({ lat, lng, fly, hintRef }: { lat: number; lng: number; fly: boolean; hintRef: React.RefObject<HTMLDivElement | null> }) {
  const map = useMap();
  const flown = useRef(false);

  useEffect(() => {
    if (!fly || flown.current) return;
    flown.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) map.setView([lat, lng], 16);
    else map.flyTo([lat, lng], 16, { duration: 3.2, easeLinearity: 0.15 });
  }, [fly, lat, lng, map]);

  useEffect(() => {
    const el = map.getContainer();
    let hintTimer: ReturnType<typeof setTimeout>;
    const showHint = () => {
      const h = hintRef.current;
      if (!h) return;
      h.style.opacity = "1";
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => (h.style.opacity = "0"), 1400);
    };
    const onWheel = (e: WheelEvent) => {
      if (map.scrollWheelZoom.enabled()) return;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        map.setZoom(map.getZoom() + (e.deltaY < 0 ? 1 : -1));
      } else showHint();
    };
    const activate = () => {
      map.scrollWheelZoom.enable();
      el.setAttribute("data-lenis-prevent", "");
    };
    const deactivate = () => {
      map.scrollWheelZoom.disable();
      el.removeAttribute("data-lenis-prevent");
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("click", activate);
    el.addEventListener("mouseleave", deactivate);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("click", activate);
      el.removeEventListener("mouseleave", deactivate);
      clearTimeout(hintTimer);
    };
  }, [map, hintRef]);

  return null;
}

export default function MapaLeaflet({ lat, lng, nome, endereco, googleUrl, wazeUrl, labels, fly }: MapaProps) {
  const hint = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (!fly) return;
    const t = setTimeout(() => markerRef.current?.openPopup(), 3400);
    return () => clearTimeout(t);
  }, [fly]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[lat, lng]}
        zoom={4}
        scrollWheelZoom={false}
        dragging
        zoomControl
        attributionControl
        className="h-full w-full"
        aria-label={`Mapa: ${nome}`}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />
        <Marker position={[lat, lng]} icon={pin} ref={markerRef} title={nome}>
          <Popup className="pp-popup" closeButton>
            <div className="min-w-[220px]">
              <p className="font-display text-xl font-extrabold text-[var(--pp-m)]">{nome}</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{endereco}</p>
              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--lime-cta)] px-4 py-2 text-center text-sm font-bold !text-[#160c45]"
                >
                  {labels.googleMaps} ↗
                </a>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/25 px-4 py-2 text-center text-sm font-bold !text-white"
                >
                  {labels.waze} ↗
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
        <Behaviour lat={lat} lng={lng} fly={fly} hintRef={hint} />
      </MapContainer>
      <div
        ref={hint}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[500] grid place-items-center bg-[#120a3a]/55 text-sm font-semibold opacity-0 backdrop-blur-[2px] transition-opacity duration-300"
      >
        <span className="rounded-full border border-white/20 bg-[#120a3a]/80 px-5 py-2.5">{labels.dicaZoom}</span>
      </div>
    </div>
  );
}
