import Image from "next/image";
import type { CSSProperties } from "react";
import { site } from "@/data/site";

/** Cor de cada letra — mesma ordem da fachada. Ajuste as cores em globals.css (--pp-*). */
const LETTER_VARS = ["--pp-P", "--pp-i", "--pp-m", "--pp-p", "--pp-o1", "--pp-l", "--pp-h", "--pp-o2"];

type Props = {
  className?: string;
  /** Letras entram uma a uma, quicando (CSS puro). */
  intro?: boolean;
  /** Atraso da entrada (s). */
  delay?: number;
  /** Intervalo entre letras (s). */
  step?: number;
  /** Texto acessível (padrão: "Pimpolho"). */
  label?: string;
  /** Esconde dos leitores de tela (quando o texto já existe ao lado). */
  decorative?: boolean;
};

export function PimpolhoWordmark({ className = "", intro = false, delay = 0, step = 0.075, label = site.wordmark, decorative = false }: Props) {
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label };

  if (site.logoSvg) {
    return (
      <span className={`inline-block align-baseline ${intro ? "a-pop" : ""} ${className}`} style={{ "--delay": `${delay}s` } as CSSProperties}>
        <Image src={site.logoSvg} alt={decorative ? "" : label} width={480} height={140} className="h-[1em] w-auto" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-baseline font-display font-extrabold leading-none tracking-[-0.01em] ${intro ? "pp-intro" : ""} ${className}`}
      {...a11y}
    >
      {Array.from(label).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="pp-letter"
          style={
            {
              "--c": `var(${LETTER_VARS[i % LETTER_VARS.length]})`,
              "--delay": `${delay + i * step}s`,
              "--tilt": `${i % 2 ? 10 : -10}deg`,
            } as CSSProperties
          }
        >
          {ch}
        </span>
      ))}
    </span>
  );
}
