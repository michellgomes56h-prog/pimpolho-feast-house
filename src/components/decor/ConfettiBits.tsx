type Bit = { top: string; left: string; color: string; shape: "rect" | "circle" | "squiggle" | "tri"; size: number; r: number; d: number; delay: number };

/** Confetes estáticos flutuando devagar (decoração). */
export function ConfettiBits({ bits, className = "" }: { bits: Bit[]; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      {bits.map((b, i) => {
        const style = {
          top: b.top,
          left: b.left,
          width: b.size,
          height: b.size,
          "--r": `${b.r}deg`,
          "--d": `${b.d}s`,
          "--delay": `${b.delay}s`,
        } as React.CSSProperties;
        return (
          <span key={i} data-confetti className="floaty floaty-lg absolute block" style={style}>
            {b.shape === "rect" && <span className="block h-full w-[45%] rounded-[2px]" style={{ background: b.color }} />}
            {b.shape === "circle" && <span className="block h-[70%] w-[70%] rounded-full" style={{ background: b.color }} />}
            {b.shape === "tri" && (
              <svg viewBox="0 0 10 10" className="h-full w-full">
                <path d="M5 0l5 9H0z" fill={b.color} />
              </svg>
            )}
            {b.shape === "squiggle" && (
              <svg viewBox="0 0 24 10" className="h-full w-full overflow-visible">
                <path d="M1 5c2.5-5 5-5 7.3 0s4.8 5 7.3 0 4.8-5 7.3 0" stroke={b.color} strokeWidth="2.6" strokeLinecap="round" fill="none" />
              </svg>
            )}
          </span>
        );
      })}
    </div>
  );
}
