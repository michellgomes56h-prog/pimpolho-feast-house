/**
 * Eventos que o espaço recebe (cards da seção "Eventos").
 * cor: uma das cores do wordmark (CSS variable).
 * icone: "balao" | "taca" | "capelo" | "coroa" | "chupeta" | "maleta"
 * largo: true — o card ganha destaque e ocupa duas colunas
 * selo: texto opcional de um selo sobre a foto
 */
export const eventosSecao = {
  eyebrow: "Eventos que recebemos",
  titulo: "Cada festa com a sua cara.",
  texto: "Festa infantil é a nossa especialidade — do primeiro aninho ao chá de bebê, tudo pensado para a criançada.",
  botao: "Quero esse evento",
  /** Versão curta do botão (celular). */
  botaoCurto: "Orçamento",
};

export const eventos = [
  {
    titulo: "Espaço Kids",
    descricao: "Playground completo com piscina de bolinhas, túnel, escorregador e jogos — a criançada brinca à vontade enquanto você aproveita a festa.",
    largo: true,
    icone: "balao",
    cor: "var(--pp-P)",
    foto: { src: "/images/eventos/espaco-kids.jpg", alt: "Playground com piscina de bolinhas, túnel e escorregador", pos: "50% 45%" },
  },
  {
    titulo: "Chá de bebê / revelação",
    descricao: "O momento mais esperado, com família e amigos por perto.",
    icone: "chupeta",
    cor: "var(--pp-i)",
    foto: { src: "/images/eventos/cha-revelacao.jpg", alt: "Decoração de chá de bebê com ursinhos em tons de azul e bege", pos: "50% 45%" },
  },
  {
    titulo: "Aniversário infantil",
    descricao: "Decoração temática do jeitinho do seu filho, com o personagem favorito dele.",
    icone: "coroa",
    cor: "var(--pp-m)",
    foto: { src: "/images/eventos/aniversario-infantil.jpg", alt: "Decoração de aniversário infantil temática em tons de azul", pos: "50% 40%" },
  },
] as const;

export type Evento = (typeof eventos)[number];
