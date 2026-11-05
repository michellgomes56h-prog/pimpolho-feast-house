/**
 * Eventos que o espaço recebe (cards da seção "Eventos").
 * cor: uma das cores do wordmark (CSS variable).
 * icone: "balao" | "taca" | "capelo" | "coroa" | "chupeta" | "maleta"
 */
export const eventosSecao = {
  eyebrow: "Eventos que recebemos",
  titulo: "Cada festa com a sua cara.",
  texto: "Do primeiro aninho à formatura: o espaço se adapta ao seu evento.",
  botao: "Quero esse evento",
};

export const eventos = [
  {
    titulo: "Aniversário infantil",
    descricao: "Brinquedos, jogos e muita diversão para a criançada.",
    icone: "balao",
    cor: "var(--pp-P)",
    foto: { src: "/images/eventos/aniversario-infantil.jpg", alt: "Criança jogando aero hockey em festa infantil" },
  },
  {
    titulo: "Aniversário adulto",
    descricao: "Clima de festa para comemorar com quem você ama.",
    icone: "taca",
    cor: "var(--pp-m)",
    foto: { src: "/images/eventos/aniversario-adulto.jpg", alt: "[FOTO: aniversário adulto]" },
  },
  {
    titulo: "Formatura",
    descricao: "Celebre a conquista com a turma toda reunida.",
    icone: "capelo",
    cor: "var(--pp-p)",
    foto: { src: "/images/eventos/formatura.jpg", alt: "[FOTO: formatura]" },
  },
  {
    titulo: "15 anos",
    descricao: "Uma noite especial, do jeitinho que você sonhou.",
    icone: "coroa",
    cor: "var(--pp-o2)",
    foto: { src: "/images/eventos/15-anos.jpg", alt: "[FOTO: 15 anos]" },
  },
  {
    titulo: "Chá revelação / bebê",
    descricao: "O momento mais esperado, com família e amigos por perto.",
    icone: "chupeta",
    cor: "var(--pp-i)",
    foto: { src: "/images/eventos/cha-revelacao.jpg", alt: "[FOTO: chá revelação]" },
  },
  {
    titulo: "Corporativo",
    descricao: "Confraternizações e encontros da sua equipe.",
    icone: "maleta",
    cor: "var(--pp-h)",
    foto: { src: "/images/eventos/corporativo.jpg", alt: "[FOTO: evento corporativo]" },
  },
] as const;

export type Evento = (typeof eventos)[number];
