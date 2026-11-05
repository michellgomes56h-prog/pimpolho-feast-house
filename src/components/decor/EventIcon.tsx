/** Ícones dos tipos de evento (traço, sem personagens). */
export function EventIcon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    balao: (
      <>
        <path {...p} d="M12 3c-3.6 0-6 2.8-6 6.3 0 4 3.3 7.2 6 8 2.7-.8 6-4 6-8C18 5.8 15.6 3 12 3z" />
        <path {...p} d="M11 17.3l-.6 1.6h3.2l-.6-1.6M12 19c-.6 1.2.8 1.8 0 3" />
        <path {...p} d="M9.2 7.4c.4-.9 1.1-1.5 2-1.8" />
      </>
    ),
    taca: (
      <>
        <path {...p} d="M5 3h5l-.3 4.5A2.3 2.3 0 017.5 10a2.3 2.3 0 01-2.2-2.5L5 3zM7.5 10v8M5.5 18h4" />
        <path {...p} d="M14 3h5l-.3 4.5a2.3 2.3 0 01-2.2 2.5 2.3 2.3 0 01-2.2-2.5L14 3zM16.5 10v8M14.5 18h4" />
        <path {...p} d="M12 2v1.5M10.5 5.5L9.6 4.6M13.5 5.5l.9-.9" />
      </>
    ),
    capelo: (
      <>
        <path {...p} d="M2.5 9L12 4.5 21.5 9 12 13.5 2.5 9z" />
        <path {...p} d="M6.5 11v4.2c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8V11M21.5 9v5.5" />
        <circle cx="21.5" cy="15.5" r="1" fill="currentColor" />
      </>
    ),
    coroa: (
      <>
        <path {...p} d="M3.5 8l4 3.5L12 5l4.5 6.5 4-3.5-1.8 9.5H5.3L3.5 8z" />
        <path {...p} d="M5.5 20h13" />
        <circle cx="12" cy="13.5" r="1.2" fill="currentColor" />
      </>
    ),
    chupeta: (
      <>
        <circle {...p} cx="12" cy="15" r="5" />
        <path {...p} d="M8.5 11.5L7 10a2.8 2.8 0 113.9-3.9l1.6 1.5M15.5 11.5L17 10a2.8 2.8 0 10-3.9-3.9" />
        <circle {...p} cx="12" cy="15" r="1.6" />
      </>
    ),
    maleta: (
      <>
        <rect {...p} x="3" y="7" width="18" height="12.5" rx="2.2" />
        <path {...p} d="M9 7V5.3c0-.7.6-1.3 1.3-1.3h3.4c.7 0 1.3.6 1.3 1.3V7M3 12.5h18M10.5 12.5v1.8h3v-1.8" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {paths[name] ?? paths.balao}
    </svg>
  );
}
