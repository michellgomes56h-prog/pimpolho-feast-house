import { respostas } from "@/data/assistente";

/** minúsculas, sem acento */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Encontra a resposta pela pontuação de palavras-chave (frases mais longas valem mais). */
export function match(texto: string) {
  const t = ` ${normalize(texto)} `;
  let best: (typeof respostas)[number] | null = null;
  let bestScore = 0;
  for (const r of respostas) {
    let score = 0;
    for (const p of r.palavras) {
      const k = normalize(p);
      if (t.includes(` ${k} `) || (k.length > 4 && t.includes(k))) score += k.split(" ").length * 2 + k.length / 10;
    }
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }
  return best;
}
