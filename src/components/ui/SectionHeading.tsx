import { Sparkle } from "@/components/decor/Sparkle";

type Props = {
  eyebrow: string;
  title: string;
  text?: string;
  /** Tipo de entrada do título (varia entre seções). */
  reveal?: "words" | "chars" | "flip" | "skew";
  align?: "left" | "center";
  id?: string;
  className?: string;
  size?: "md" | "sm";
};

/** Eyebrow + título grande + texto. O título usa o gradiente da marca na última palavra. */
export function SectionHeading({ eyebrow, title, text, reveal = "words", align = "left", id, className = "", size = "md" }: Props) {
  const center = align === "center";
  const words = title.split(" ");
  const last = words.pop();
  return (
    <div className={`${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p data-reveal="fade-up" className={`eyebrow mb-3 flex sm:mb-5 items-center gap-2 ${center ? "justify-center" : ""}`}>
        <Sparkle className="h-3 w-3" color="var(--lime-cta)" />
        {eyebrow}
      </p>
      <h2
        id={id}
        data-reveal={reveal}
        className={`${size === "sm" ? "text-[clamp(1.8rem,4vw,3.4rem)]" : "text-[clamp(1.85rem,5.4vw,4.6rem)]"} font-extrabold leading-[1.02] tracking-[-0.04em]`}
      >
        {words.join(" ")} <span className="text-grad">{last}</span>
      </h2>
      {text && (
        <p
          data-reveal="lines"
          className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--text-muted)] sm:mt-6 sm:text-lg ${center ? "mx-auto" : ""}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}
