import { useId } from "react";

/** Balão estilizado em SVG (cor da marca). */
export function Balloon({ color, className = "", style }: { color: string; className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 120" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`bh${id}`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.18" stopColor={color} stopOpacity="1" />
          <stop offset="1" stopColor={color} stopOpacity="1" />
        </radialGradient>
        <linearGradient id={`bs${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      <path d="M30 76c-2 8 4 14-1 22s3 14-1 22" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" fill="none" />
      <path d="M30 2C14 2 4 16 4 32c0 20 15 38 26 42 11-4 26-22 26-42C56 16 46 2 30 2z" fill={`url(#bh${id})`} />
      <path d="M30 2C14 2 4 16 4 32c0 20 15 38 26 42 11-4 26-22 26-42C56 16 46 2 30 2z" fill={`url(#bs${id})`} />
      <path d="M26 74h8l-2 5h-4z" fill={color} />
      <ellipse cx="19" cy="20" rx="4" ry="7" fill="#fff" opacity=".45" transform="rotate(-25 19 20)" />
    </svg>
  );
}
