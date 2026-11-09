/**
 * Fotos da galeria (pasta /public/images/galeria/).
 * forma: controla tamanho/altura no carrossel horizontal ("alta" | "larga" | "quadrada").
 */
export const galeriaSecao = {
  eyebrow: "Galeria do espaço",
  titulo: "Dá uma volta pela Pimpolho.",
  dica: "Clique para ampliar",
  fechar: "Fechar",
  anterior: "Foto anterior",
  proxima: "Próxima foto",
};

export const galeria = [
  { src: "/images/galeria/piscina-de-bolinhas.jpg", alt: "Piscina de bolinhas", legenda: "Área kids", forma: "alta" },
  {
    src: "/images/galeria/salao-principal.jpg",
    alt: "Salão principal com playground, piscina de bolinhas e escorregador",
    legenda: "Salão principal",
    forma: "larga",
  },
  {
    src: "/images/galeria/aniversario-1.jpg",
    alt: "Decoração de aniversário infantil com mesa temática em tons de azul",
    legenda: "Aniversário infantil",
    forma: "alta",
  },
  { src: "/images/galeria/sinuca.jpg", alt: "Mesa de sinuca", legenda: "Jogos · sinuca", forma: "quadrada" },
  {
    src: "/images/galeria/aniversario-2-anos.jpg",
    alt: "Decoração de aniversário de 2 anos com bonecas e balões em tons pastel",
    legenda: "Aniversário de 2 anos",
    forma: "alta",
  },
  { src: "/images/galeria/aero-hockey.jpg", alt: "Mesa de aero hockey", legenda: "Jogos · aero hockey", forma: "quadrada" },
  {
    src: "/images/galeria/aniversario-3.jpg",
    alt: "Decoração de aniversário infantil em vermelho, preto e branco",
    legenda: "Aniversário infantil",
    forma: "alta",
  },
  {
    src: "/images/galeria/aniversario-4.jpg",
    alt: "Decoração de aniversário infantil com balões rosa e azul e painel personalizado",
    legenda: "Aniversário infantil",
    forma: "alta",
  },
  { src: "/images/galeria/aniversario-teen.jpg", alt: "Decoração de aniversário teen com cores neon", legenda: "Aniversário teen", forma: "alta" },
] as const;
