/** Ícones de comodidades — cada path usa pathLength=1 para o efeito de "desenhar" o traço. */
const ICONS: Record<string, string[]> = {
  neve: ["M24 4v40", "M6.7 14l34.6 20", "M6.7 34l34.6-20", "M18 6l6 5 6-5", "M18 42l6-5 6 5", "M5 21l7.8 1.7L10.4 30", "M43 27l-7.8-1.7 2.4-7.3"],
  cozinha: ["M10 22h28v16a4 4 0 01-4 4H14a4 4 0 01-4-4V22z", "M6 22h36", "M17 22v-3a7 7 0 0114 0v3", "M18 8c0 2 2 2 2 4M24 6c0 2 2 2 2 4M30 8c0 2 2 2 2 4"],
  som: [
    "M12 6h24a3 3 0 013 3v30a3 3 0 01-3 3H12a3 3 0 01-3-3V9a3 3 0 013-3z",
    "M24 34a6 6 0 100-12 6 6 0 000 12z",
    "M24 16a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
    "M24 30a2 2 0 100-4 2 2 0 000 4z",
  ],
  kids: [
    "M24 42a12 12 0 100-24 12 12 0 000 24z",
    "M14 12a5 5 0 1110 0 5 5 0 01-10 0z",
    "M30 9a4 4 0 118 0 4 4 0 01-8 0z",
    "M8 36a4 4 0 118 0 4 4 0 01-8 0z",
    "M18 27c2 3 10 3 12 0",
  ],
  jogos: ["M6 18h36v14a6 6 0 01-6 6H12a6 6 0 01-6-6V18z", "M12 18l-2-8M36 18l2-8", "M30 28a3 3 0 100-6 3 3 0 000 6z", "M17 25h-6M14 22v6", "M38 10L20 30"],
  carro: [
    "M8 30v-6l4-10a4 4 0 013.7-2.5h16.6A4 4 0 0136 14l4 10v6",
    "M6 30h36v6H6z",
    "M13 41a3 3 0 100-6 3 3 0 000 6zM35 41a3 3 0 100-6 3 3 0 000 6z",
    "M12 24h24",
  ],
  banheiro: [
    "M16 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
    "M32 9a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
    "M11 14h10l2 14h-4v16h-6V28H9l2-14z",
    "M27 14h10v14h-3v16h-4V28h-3V14z",
    "M24 12v34",
  ],
  mesa: ["M6 20h36", "M10 20v18M38 20v18", "M14 20l3-8h14l3 8", "M18 28h12", "M24 4v8"],
};

export function AmenityIcon({ name, className = "h-10 w-10" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {(ICONS[name] ?? ICONS.kids).map((d, i) => (
        <path key={i} d={d} pathLength={1} data-draw />
      ))}
    </svg>
  );
}
