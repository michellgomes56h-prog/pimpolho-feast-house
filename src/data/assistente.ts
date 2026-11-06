import { contato } from "./contato";

/**
 * Assistente "Tire suas dúvidas" — baseado em regras (sem IA, sem backend).
 * REGRA: nenhuma resposta mostra preços, valores ou faixas de preço.
 * palavras: termos (sem acento, minúsculos) que disparam a resposta no campo de texto livre.
 */
export const assistente = {
  botao: "Tire suas dúvidas",
  titulo: "Assistente Pimpolho",
  status: "Responde na hora",
  boasVindas: "Oi! 👋 Sou o assistente do Pimpolho. Posso te ajudar com dúvidas sobre o aluguel do espaço.",
  placeholderInput: "Digite sua dúvida…",
  enviar: "Enviar",
  fechar: "Fechar assistente",
  whatsapp: "Falar no WhatsApp",
  naoEntendi: "Hmm, essa eu não sei responder por aqui 😅 Escolha uma das opções abaixo ou fale direto com a equipe no WhatsApp — eles respondem rapidinho!",
  chipsTitulo: "Perguntas rápidas",
};

export const respostas = [
  {
    id: "preco",
    pergunta: "Quanto custa alugar o espaço?",
    palavras: ["preco", "valor", "custa", "custo", "quanto", "orcamento caro", "tabela", "pacote"],
    resposta:
      "O valor varia conforme a data, quantas horas você vai usar o espaço e o número de convidados. Me conta esses detalhes que a equipe te passa o orçamento certinho, sem compromisso 😉",
  },
  {
    id: "tempo",
    pergunta: "O valor muda pelo tempo de uso?",
    palavras: ["tempo de uso", "muda", "por hora", "hora a mais", "hora extra"],
    resposta:
      "Muda sim! A duração da locação é um dos fatores do orçamento, junto com a data e o número de convidados. Quer montar o seu? Leva menos de 1 minuto 🎉",
  },
  {
    id: "horas",
    pergunta: "Quantas horas posso alugar?",
    palavras: ["horas", "hora", "duracao", "quanto tempo", "periodo"],
    resposta:
      "A duração é combinada de acordo com a sua festa: [DURAÇÕES DISPONÍVEIS]. Me diz quantas horas você imagina que a equipe confirma a disponibilidade e te passa o orçamento.",
  },
  {
    id: "incluso",
    pergunta: "O que está incluso?",
    palavras: ["incluso", "inclui", "incluido", "vem com", "estrutura", "tem o que", "brinquedo", "jogos"],
    resposta:
      "A locação inclui o espaço e a estrutura: [LISTAR ITENS INCLUSOS]. Itens opcionais entram no orçamento conforme o que você escolher. Quer que eu monte o pedido pra você?",
  },
  {
    id: "fds",
    pergunta: "Tem valor diferente no fim de semana?",
    palavras: ["fim de semana", "final de semana", "sabado", "domingo", "feriado", "dia da semana", "durante a semana"],
    resposta:
      "O dia da semana influencia sim no orçamento — fins de semana e feriados costumam ser os mais procurados. Me fala a data que você quer e a equipe te passa as condições certinhas 😉",
  },
  {
    id: "buffet",
    pergunta: "Posso levar meu buffet/decoração?",
    palavras: ["buffet", "bufe", "decoracao", "decorar", "comida", "bebida", "bolo", "levar", "proprio", "fornecedor"],
    resposta: "[CONFIRMAR REGRA DE BUFFET/DECORAÇÃO PRÓPRIOS]. Conta pra equipe o que você está planejando que eles te orientam direitinho!",
  },
  {
    id: "orcamento",
    pergunta: "Quero um orçamento",
    palavras: ["orcamento", "reservar", "reserva", "alugar", "agendar", "data disponivel", "disponibilidade"],
    resposta: "Oba! Vou te fazer 5 perguntinhas rápidas e já deixo a mensagem pronta para o WhatsApp 🎈",
  },
];

/** Fluxo de orçamento dentro do chat (perguntas em sequência). */
export const fluxoOrcamento = {
  passos: [
    {
      campo: "evento",
      pergunta: "Qual é o tipo de evento?",
      opcoes: ["Aniversário infantil", "Chá de bebê/revelação", "Festa personalizada", "Outro"],
      placeholder: "Ou digite o tipo de evento…",
    },
    { campo: "data", pergunta: "Qual a data desejada?", opcoes: [], placeholder: "Ex.: 14/03 ou março", tipo: "texto" },
    {
      campo: "duracao",
      pergunta: "Quantas horas você pretende usar o espaço?",
      opcoes: ["3", "4", "5", "6"],
      placeholder: "Número de horas",
      sufixoOpcao: " horas",
    },
    {
      campo: "convidados",
      pergunta: `Quantos convidados, aproximadamente? (o espaço comporta até ${contato.capacidade} pessoas)`,
      opcoes: ["Até 30", "30 a 50", `50 a ${contato.capacidade}`],
      placeholder: "Número aproximado",
    },
    { campo: "nome", pergunta: "Pra fechar: qual é o seu nome?", opcoes: [], placeholder: "Seu nome" },
  ],
  final: "Prontinho! Confere o resumo e é só enviar pelo WhatsApp 👇",
  botaoEnviar: "Enviar pelo WhatsApp",
  recomecar: "Recomeçar",
  /** Modelo da mensagem — {evento}, {data}, {duracao}, {convidados}, {nome} são substituídos. */
  modeloMensagem:
    "Olá! Quero um orçamento do Pimpolho Feast House. Evento: {evento} | Data: {data} | Duração: {duracao} horas | Convidados: {convidados} | Nome: {nome}",
  rotulos: { evento: "Evento", data: "Data", duracao: "Duração", convidados: "Convidados", nome: "Nome" },
} as const;
