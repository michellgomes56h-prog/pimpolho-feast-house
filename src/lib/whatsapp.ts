import { contato } from "@/data/contato";

/** Monta o link do WhatsApp. Enquanto o número for placeholder, abre o wa.me sem número. */
export function whatsappLink(mensagem: string = contato.mensagemOrcamento) {
  const numero = contato.whatsapp.replace(/\D/g, "");
  const texto = encodeURIComponent(mensagem);
  return numero ? `https://wa.me/${numero}?text=${texto}` : `https://wa.me/?text=${texto}`;
}
