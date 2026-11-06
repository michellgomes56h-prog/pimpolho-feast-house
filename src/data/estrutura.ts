/**
 * Comodidades do espaço.
 * confirmado: false mostra o selo "[CONFIRMAR]" (todos já confirmados pelo cliente).
 * icone: "neve" | "cozinha" | "som" | "kids" | "jogos" | "carro" | "banheiro" | "mesa"
 */
export const estruturaSecao = {
  eyebrow: "Estrutura",
  titulo: "Tudo pronto para a sua festa.",
  texto: "Uma estrutura completa para você se preocupar só com os convidados.",
  selo: "[CONFIRMAR]",
};

export const estrutura = [
  { titulo: "Climatização", texto: "Ambiente fresquinho o ano todo.", icone: "neve", confirmado: true },
  { titulo: "Área kids", texto: "Piscina de bolinhas e brinquedos.", icone: "kids", confirmado: true },
  { titulo: "Jogos", texto: "Sinuca, aero hockey e basquete.", icone: "jogos", confirmado: true },
  { titulo: "Som e iluminação", texto: "Para a festa ganhar vida.", icone: "som", confirmado: true },
  { titulo: "Cozinha de apoio", texto: "Suporte para o seu buffet.", icone: "cozinha", confirmado: true },
  { titulo: "Mesas e cadeiras", texto: "Para acomodar seus convidados.", icone: "mesa", confirmado: true },
  { titulo: "Banheiros", texto: "Limpos e bem localizados.", icone: "banheiro", confirmado: true },
  { titulo: "Estacionamento", texto: "Mais praticidade na chegada.", icone: "carro", confirmado: true },
] as const;
