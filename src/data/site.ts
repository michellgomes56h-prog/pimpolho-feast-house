import { contato } from "./contato";

/**
 * Textos gerais do site (header, hero, SEO).
 * Edite aqui sem mexer nos componentes.
 */
export const site = {
  nome: "Pimpolho Feast House",
  wordmark: "Pimpolho",
  subMarca: "Feast House",
  /** Se você colocar o logo em /public/brand/pimpolho.svg, troque para "/brand/pimpolho.svg". */
  logoSvg: null as string | null,
  url: "https://[DOMINIO].com.br",
  creditos: { texto: "Site por VOID DEV", url: "#" },
  seo: {
    title: "Pimpolho Feast House — Espaço para festas e eventos",
    description: `Espaço de festas com foco no público infantil: aniversários infantis, festas personalizadas, chá de bebê e chá revelação. Até ${contato.capacidade} convidados. Peça seu orçamento pelo WhatsApp.`,
    ogImage: "/og-image.jpg",
  },
};

export const nav = [
  { label: "O espaço", href: "#o-espaco" },
  { label: "Eventos", href: "#eventos" },
  { label: "Galeria", href: "#galeria" },
  { label: "Onde estamos", href: "#onde-estamos" },
  { label: "Dúvidas", href: "#duvidas" },
];

export const header = {
  cta: "Fazer orçamento",
  menuAbrir: "Abrir menu",
  menuFechar: "Fechar menu",
};

export const hero = {
  eyebrow: "O espaço da sua festa",
  tituloLinha1: "Sua festa.",
  tituloLinha2Antes: "No",
  tituloLinha2Depois: ".",
  subtitulo:
    "Um espaço completo para festas infantis, chá de bebê e todos os momentos que merecem ser celebrados. Você traz os convidados, a gente entrega o cenário.",
  ctaPrincipal: "Fazer orçamento",
  ctaSecundario: { label: "Conhecer o espaço", href: "#galeria" },
  tiposEvento: ["Festas infantis", "Chá de bebê", "Festa personalizada"],
  /** Ordem: [grande central, superior direita, inferior esquerda, inferior direita]. `pos` = enquadramento (object-position). */
  fotos: [
    { src: "/images/hero/piscina-de-bolinhas.jpg", alt: "Criança brincando na piscina de bolinhas do Pimpolho", pos: "50% 40%" },
    { src: "/images/hero/sinuca.jpg", alt: "Criança jogando sinuca no espaço de jogos", pos: "50% 45%" },
    { src: "/images/hero/aero-hockey.jpg", alt: "Criança jogando aero hockey", pos: "30% 50%" },
    { src: "/images/hero/recepcao-personagem.jpg", alt: "Equipe do Pimpolho com personagem em festa", pos: "50% 30%" },
  ],
  etiquetas: {
    capacidade: `Até ${contato.capacidade} convidados`,
    clima: "Espaço climatizado",
    momentos: "Momentos para sempre",
  },
  rodape: {
    rolar: "Role para descobrir",
    tipos: "Festas infantis • Chá de bebê • Personalizadas",
  },
};

export const sobre = {
  eyebrow: "O espaço",
  titulo: "Um lugar pensado para celebrar.",
  texto: [
    "[TEXTO SOBRE O ESPAÇO — 2 a 3 frases contando a história do Pimpolho, o clima das festas e o cuidado da equipe.]",
    "Brinquedos, jogos e ambientes para todas as idades: enquanto a criançada se diverte, os adultos aproveitam a festa com tranquilidade.",
  ],
  foto: { src: "/images/sobre/salao-principal.jpg", alt: "Salão principal com playground, piscina de bolinhas e escorregador" },
  selo: "Feito para festejar",
  /** valor: número para o contador animado. Enquanto for null, mostra o placeholder. */
  numeros: [
    { valor: contato.capacidade as number | null, placeholder: "[CAPACIDADE]", prefixo: "até", sufixo: "", label: "convidados" },
    { valor: null as number | null, placeholder: "[ANOS]", prefixo: "", sufixo: "", label: "anos de festas" },
    { valor: null as number | null, placeholder: "[EVENTOS]", prefixo: "", sufixo: "+", label: "eventos realizados" },
    { valor: null as number | null, placeholder: "[AMBIENTES]", prefixo: "", sufixo: "", label: "ambientes" },
  ],
};

export const ctaFinal = {
  eyebrow: "Sua data pode ser a próxima",
  titulo: "Bora fazer a festa acontecer?",
  texto: "Conta pra gente a data, o tipo de festa e quantos convidados. A equipe responde com um orçamento sob medida, sem compromisso.",
  cta: "Fazer orçamento agora",
};

export const footer = {
  frase: "O espaço da sua festa.",
  colunas: { navegar: "Navegar", contato: "Contato", visite: "Visite" },
  direitos: "© Pimpolho Feast House",
  topo: "Voltar ao topo",
};
