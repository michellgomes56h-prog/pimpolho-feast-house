/**
 * Contatos e localização da Pimpolho Feast House.
 * Troque os valores entre colchetes pelos dados reais.
 * WhatsApp: só números, com DDI + DDD (ex.: "5511999999999").
 */
export const contato = {
  nome: "Pimpolho Feast House",
  whatsapp: "555591751519",
  /** Como o número aparece escrito no site. */
  whatsappExibicao: "(55) 9175-1519",
  instagram: "pimpolhofeasthouse",
  instagramUrl: "https://www.instagram.com/pimpolhofeasthouse",
  endereco: "R. Porto Alegre, 725 - Fritsch",
  cidade: "Panambi",
  uf: "RS",
  cep: "98280-000",
  horario: "[HORÁRIO]",
  /** Capacidade máxima do espaço (pessoas). */
  capacidade: 76,
  /** Data de abertura — os "anos de festas" são calculados a partir dela. */
  inicio: "2022-07-15",
  latitude: "-28.2674",
  longitude: "-53.4969",
  /**
   * Centro provisório do mapa enquanto LATITUDE/LONGITUDE forem placeholders (centro do Brasil).
   * Assim que tiver as coordenadas reais, preencha latitude/longitude acima (ex.: "-23.5505").
   */
  mapaProvisorio: { lat: -15.7939, lng: -47.8828 },
  /** Mensagem padrão dos botões "Fazer orçamento". */
  mensagemOrcamento: "Olá! Vim pelo site e quero um orçamento da Pimpolho Feast House 🎉",
  /** Textos da seção "Onde estamos". */
  secao: {
    eyebrow: "Onde estamos",
    titulo: "Vem fazer festa com a gente.",
    labels: { endereco: "Endereço", horario: "Atendimento", whatsapp: "WhatsApp", instagram: "Instagram" },
    dicaZoom: "Use Ctrl + rolagem (ou clique no mapa) para dar zoom",
    coordenadasPendentes: "Localização provisória — coordenadas pendentes",
  },
} as const;
