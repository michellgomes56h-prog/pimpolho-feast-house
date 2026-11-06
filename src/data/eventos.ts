/**
 * Eventos que o espaço recebe (cards da seção "Eventos").
 * cor: uma das cores do wordmark (CSS variable).
 * icone: "balao" | "taca" | "capelo" | "coroa" | "chupeta" | "maleta"
 * destaque: texto do selo (opcional) — o card ganha destaque e ocupa duas colunas
 */
export const eventosSecao = {
  eyebrow: "Eventos que recebemos",
  titulo: "Cada festa com a sua cara.",
  texto: "Festa infantil é a nossa especialidade — e o espaço também recebe chá de bebê, formaturas e outros eventos.",
  botao: "Quero esse evento",
  /** Versão curta do botão (celular). */
  botaoCurto: "Orçamento",
};

export const eventos = [
  {
    titulo: "Aniversário infantil",
    descricao: "Piscina de bolinhas, jogos e muita diversão para a criançada. É a nossa especialidade!",
    destaque: "Nosso foco ✦",
    icone: "balao",
    cor: "var(--pp-P)",
    foto: { src: "/images/eventos/aniversario-infantil.jpg", alt: "Playground com piscina de bolinhas, túnel e escorregador", pos: "50% 45%" },
  },
  {
    titulo: "Chá de bebê / revelação",
    descricao: "O momento mais esperado, com família e amigos por perto.",
    icone: "chupeta",
    cor: "var(--pp-i)",
    foto: { src: "/images/eventos/cha-revelacao.jpg", alt: "Decoração de chá de bebê com ursinhos em tons de azul e bege", pos: "50% 45%" },
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
    titulo: "Corporativo",
    descricao: "Confraternizações e encontros da sua equipe.",
    icone: "maleta",
    cor: "var(--pp-h)",
    foto: { src: "/images/eventos/corporativo.jpg", alt: "[FOTO: evento corporativo]" },
  },
] as const;

export type Evento = (typeof eventos)[number];
