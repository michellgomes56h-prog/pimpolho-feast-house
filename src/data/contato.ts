/**
 * Contatos e localização do Pimpolho Feast House.
 * Troque os valores entre colchetes pelos dados reais.
 * WhatsApp: só números, com DDI + DDD (ex.: "5511999999999").
 */
export const contato = {
  nome: "Pimpolho Feast House",
  whatsapp: "[WHATSAPP]",
  instagram: "[INSTAGRAM]", // ex.: "pimpolhofeasthouse" (sem @)
  instagramUrl: "[INSTAGRAM_URL]",
  endereco: "[ENDEREÇO]",
  cidade: "[CIDADE]",
  uf: "[UF]",
  cep: "[CEP]",
  horario: "[HORÁRIO]",
  /** Capacidade máxima do espaço (pessoas). */
  capacidade: 76,
  latitude: "[LATITUDE]",
  longitude: "[LONGITUDE]",
  /**
   * Centro provisório do mapa enquanto LATITUDE/LONGITUDE forem placeholders (centro do Brasil).
   * Assim que tiver as coordenadas reais, preencha latitude/longitude acima (ex.: "-23.5505").
   */
  mapaProvisorio: { lat: -15.7939, lng: -47.8828 },
  /** Mensagem padrão dos botões "Fazer orçamento". */
  mensagemOrcamento: "Olá! Vim pelo site e quero um orçamento do Pimpolho Feast House 🎉",
  /** Textos da seção "Onde estamos". */
  secao: {
    eyebrow: "Onde estamos",
    titulo: "Vem fazer festa com a gente.",
    labels: { endereco: "Endereço", horario: "Atendimento", whatsapp: "WhatsApp", instagram: "Instagram" },
    googleMaps: "Abrir no Google Maps",
    waze: "Como chegar (Waze)",
    dicaZoom: "Use Ctrl + rolagem (ou clique no mapa) para dar zoom",
    coordenadasPendentes: "Localização provisória — [LATITUDE] / [LONGITUDE] pendentes",
  },
} as const;
