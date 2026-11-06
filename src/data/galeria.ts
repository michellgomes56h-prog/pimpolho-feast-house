/**
 * Fotos da galeria (pasta /public/images/galeria/).
 * forma: controla tamanho/altura no carrossel horizontal ("alta" | "larga" | "quadrada").
 */
export const galeriaSecao = {
  eyebrow: "Galeria do espaço",
  titulo: "Dá uma volta pelo Pimpolho.",
  dica: "Clique para ampliar",
  fechar: "Fechar",
  anterior: "Foto anterior",
  proxima: "Próxima foto",
};

export const galeria = [
  { src: "/images/galeria/piscina-de-bolinhas.jpg", alt: "Piscina de bolinhas", legenda: "Área kids", forma: "alta" },
  { src: "/images/galeria/salao-principal.jpg", alt: "Salão principal com playground, piscina de bolinhas e escorregador", legenda: "Salão principal", forma: "larga" },
  { src: "/images/galeria/sinuca.jpg", alt: "Mesa de sinuca", legenda: "Jogos · sinuca", forma: "quadrada" },
  { src: "/images/galeria/mesa-do-bolo.jpg", alt: "[FOTO: mesa do bolo]", legenda: "Mesa do bolo", forma: "alta" },
  { src: "/images/galeria/area-externa.jpg", alt: "[FOTO: área externa]", legenda: "Área externa", forma: "larga" },
  { src: "/images/galeria/aero-hockey.jpg", alt: "Mesa de aero hockey", legenda: "Jogos · aero hockey", forma: "quadrada" },
  { src: "/images/galeria/pista-iluminacao.jpg", alt: "[FOTO: pista/iluminação]", legenda: "Pista e iluminação", forma: "alta" },
  { src: "/images/galeria/fachada.jpg", alt: "[FOTO: fachada]", legenda: "Fachada", forma: "quadrada" },
] as const;
