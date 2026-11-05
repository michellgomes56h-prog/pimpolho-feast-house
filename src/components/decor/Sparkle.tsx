import type { CSSProperties } from "react";

/** Estrelinha de 4 pontas. */
export function Sparkle({ className = "", color = "#fff", style }: { className?: string; color?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" fill={color} />
    </svg>
  );
}

export type Star = { top: string; left: string; size: number; d: number; delay: number; color?: string };

/** Estrelinhas brilhando espalhadas (posição em %). */
export function Starfield({ stars, className = "" }: { stars: Star[]; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {stars.map((s, i) => (
        <span key={i} data-star className="absolute" style={{ top: s.top, left: s.left }}>
          <Sparkle
            className="twinkle block"
            color={s.color}
            style={{ width: s.size, height: s.size, ["--d" as string]: `${s.d}s`, ["--delay" as string]: `${s.delay}s` }}
          />
        </span>
      ))}
    </div>
  );
}
