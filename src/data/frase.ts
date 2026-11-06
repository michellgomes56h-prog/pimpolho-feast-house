/**
 * Frase do cartão "escrito à mão" (entre o FAQ e o CTA final).
 * destaque: "grande" (palavra em evidência, com risquinhos), "sublinhado" (traço amarelo embaixo).
 * Em `sublinhar`, só o trecho indicado da linha ganha o traço.
 */
export const frase = {
  rotulo: "Uma frase que a gente leva a sério",
  linhas: [
    { texto: "Dinheiro a gente recupera." },
    { texto: "Tempo e momentos," },
    { texto: "não.", destaque: "grande" },
    { texto: "Celebre.", gap: true },
    { texto: "Registre." },
    { texto: "Viva cada detalhe.", destaque: "sublinhado" },
    { texto: "Porque um dia, tudo o que", gap: true },
    { texto: "vai restar serão as" },
    { texto: "lembranças.", destaque: "sublinhado" },
  ],
} as const;
