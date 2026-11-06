"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { assistente, fluxoOrcamento, respostas } from "@/data/assistente";
import { whatsappLink } from "@/lib/whatsapp";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { burstConfetti } from "@/components/ui/confetti";
import { match } from "./logic";

type Msg = { id: number; from: "bot" | "user"; text: string; kind?: "resumo" };
type Campo = (typeof fluxoOrcamento.passos)[number]["campo"];

let uid = 0;
const nextId = () => ++uid;

const WhatsIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.8 11.9 11.9 0 004.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.4-.2z" />
  </svg>
);

export function Assistente() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: nextId(), from: "bot", text: assistente.boasVindas }]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [step, setStep] = useState<number | null>(null); // passo do fluxo de orçamento
  const [dados, setDados] = useState<Partial<Record<Campo, string>>>({});
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  // animação de abertura (escala + mola)
  useEffect(() => {
    const p = panel.current;
    if (!p) return;
    const reduce = prefersReducedMotion();
    gsap.set(p, { autoAlpha: 0, scale: 0.6, y: 30, transformOrigin: "100% 100%" });
    tl.current = gsap
      .timeline({ paused: true })
      .to(p, { autoAlpha: 1, duration: 0.2 })
      .to(p, { scale: 1, y: 0, duration: reduce ? 0.2 : 0.75, ease: reduce ? "none" : "elastic.out(1, 0.75)" }, 0)
      .from(p.querySelectorAll("[data-anim]"), { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.05 }, 0.15);
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
    } else tl.current.timeScale(2.2).reverse();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        fab.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // rola para a última mensagem
  useEffect(() => {
    const l = listRef.current;
    if (l) l.scrollTo({ top: l.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [msgs, typing, step, done]);

  const botSay = useCallback((text: string, extra?: Partial<Msg>, delay = 650) => {
    setTyping(true);
    return new Promise<void>((res) =>
      setTimeout(() => {
        setTyping(false);
        setMsgs((m) => [...m, { id: nextId(), from: "bot", text, ...extra }]);
        res();
      }, delay),
    );
  }, []);

  const startFlow = useCallback(async () => {
    setDados({});
    setDone(false);
    await botSay(respostas.find((r) => r.id === "orcamento")!.resposta);
    await botSay(fluxoOrcamento.passos[0].pergunta, undefined, 500);
    setStep(0);
  }, [botSay]);

  const answerFlow = useCallback(
    async (valor: string) => {
      if (step === null) return;
      const passo = fluxoOrcamento.passos[step];
      const shown = "sufixoOpcao" in passo && passo.sufixoOpcao && /^\d+$/.test(valor) ? `${valor}${passo.sufixoOpcao}` : valor;
      setMsgs((m) => [...m, { id: nextId(), from: "user", text: shown }]);
      const novos = { ...dados, [passo.campo]: valor.replace(/\s*horas?$/i, "") };
      setDados(novos);
      const prox = step + 1;
      if (prox < fluxoOrcamento.passos.length) {
        setStep(null);
        await botSay(fluxoOrcamento.passos[prox].pergunta);
        setStep(prox);
      } else {
        setStep(null);
        await botSay(fluxoOrcamento.final);
        setDone(true);
      }
    },
    [botSay, dados, step],
  );

  const ask = useCallback(
    async (pergunta: string, id?: string) => {
      setMsgs((m) => [...m, { id: nextId(), from: "user", text: pergunta }]);
      const r = id ? respostas.find((x) => x.id === id) : match(pergunta);
      if (!r) return botSay(assistente.naoEntendi);
      if (r.id === "orcamento") return startFlow();
      await botSay(r.resposta);
    },
    [botSay, startFlow],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const v = input.trim();
    if (!v) return;
    setInput("");
    if (step !== null) answerFlow(v);
    else ask(v);
  };

  const mensagemFinal = fluxoOrcamento.modeloMensagem.replace(/\{(\w+)\}/g, (_, k: Campo) => dados[k] ?? "-");
  const passoAtual = step !== null ? fluxoOrcamento.passos[step] : null;

  return (
    <>
      {/* botão flutuante */}
      <button
        ref={fab}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="assistente"
        aria-label={open ? assistente.fechar : assistente.botao}
        className="group fixed bottom-4 right-4 z-[70] flex h-14 items-center gap-3 rounded-full sm:bottom-7 sm:right-7 sm:h-16 bg-[linear-gradient(135deg,var(--pink-hot),var(--glow-amber))] pl-4 pr-4 text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-[var(--ease-spring)] hover:scale-105 sm:pr-6"
      >
        <span className="relative grid h-9 w-9 place-items-center">
          <svg
            viewBox="0 0 24 24"
            className={`absolute h-7 w-7 transition-all duration-500 ${open ? "rotate-90 scale-0 opacity-0" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v8a2.5 2.5 0 01-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 014 14.5v-9z" />
            <path d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" strokeWidth="2.6" strokeLinecap="round" />
          </svg>
          <svg
            viewBox="0 0 24 24"
            className={`absolute h-6 w-6 transition-all duration-500 ${open ? "" : "-rotate-90 scale-0 opacity-0"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </span>
        <span className="hidden text-sm font-bold sm:block">{assistente.botao}</span>
        {!open && (
          <span aria-hidden className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--lime-cta)] opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-[var(--bg-deep)] bg-[var(--lime-cta)]" />
          </span>
        )}
      </button>

      {/* janela */}
      <div
        ref={panel}
        id="assistente"
        role="dialog"
        aria-label={assistente.titulo}
        aria-hidden={!open}
        inert={!open}
        className="invisible fixed bottom-24 right-3 z-[70] flex h-[min(620px,calc(100svh-120px))] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[28px] border border-white/15 bg-[var(--ink)]/80 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:bottom-28 sm:right-7 sm:w-[400px]"
      >
        {/* cabeçalho */}
        <div data-anim className="relative flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(80% 140% at 0% 0%, rgba(255,62,165,.35), transparent 60%), radial-gradient(80% 140% at 100% 0%, rgba(255,138,61,.35), transparent 60%)",
            }}
          />
          <span className="relative grid h-11 w-11 place-items-center rounded-full bg-[linear-gradient(135deg,var(--pp-P),var(--pink-hot),var(--glow-amber))] font-display text-xl font-extrabold text-white">
            P
          </span>
          <div className="relative flex-1">
            <p className="font-bold leading-tight">{assistente.titulo}</p>
            <p className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--pp-i)]" />
              {assistente.status}
            </p>
          </div>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-110"
            aria-label={assistente.whatsapp}
            title={assistente.whatsapp}
          >
            <WhatsIcon className="h-5 w-5" />
          </a>
        </div>

        {/* mensagens */}
        <div ref={listRef} data-lenis-prevent className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <p
                className={`max-w-[85%] whitespace-pre-line rounded-[20px] px-4 py-2.5 text-[0.92rem] leading-relaxed [animation:in-fade-up_.45s_var(--ease-out)_both] ${
                  m.from === "user"
                    ? "rounded-br-md bg-[var(--lime-cta)] font-medium text-[var(--ink)]"
                    : "rounded-bl-md border border-white/10 bg-white/[0.08] text-white"
                }`}
              >
                {m.text}
              </p>
            </div>
          ))}
          {typing && (
            <div className="flex">
              <span className="flex gap-1 rounded-[20px] rounded-bl-md border border-white/10 bg-white/[0.08] px-4 py-3.5" aria-label="digitando">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </div>
          )}

          {/* resumo + envio */}
          {done && (
            <div className="rounded-[20px] border border-white/15 bg-white/[0.06] p-4 [animation:in-fade-up_.5s_var(--ease-out)_both]">
              <dl className="space-y-1.5 text-sm">
                {fluxoOrcamento.passos.map((p) => (
                  <div key={p.campo} className="flex justify-between gap-4">
                    <dt className="text-[var(--text-muted)]">{fluxoOrcamento.rotulos[p.campo]}</dt>
                    <dd className="text-right font-semibold">
                      {dados[p.campo]}
                      {p.campo === "duracao" && dados.duracao && /^\d+$/.test(dados.duracao) ? " horas" : ""}
                    </dd>
                  </div>
                ))}
              </dl>
              <a
                href={whatsappLink(mensagemFinal)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => burstConfetti(e.clientX, e.clientY, 60)}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              >
                <WhatsIcon />
                {fluxoOrcamento.botaoEnviar}
              </a>
              <button type="button" onClick={startFlow} className="mt-2 w-full py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-white">
                {fluxoOrcamento.recomecar}
              </button>
            </div>
          )}
        </div>

        {/* chips */}
        <div data-anim className="border-t border-white/10 px-4 pt-3">
          {!typing && (
            <div className="flex max-h-[104px] flex-wrap gap-2 overflow-y-auto pb-3" data-lenis-prevent>
              {passoAtual
                ? passoAtual.opcoes.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => answerFlow(o)}
                      className="rounded-full border border-[var(--lime-cta)]/50 px-3 py-1.5 text-xs font-semibold text-[var(--lime-cta)] transition-colors hover:bg-[var(--lime-cta)] hover:text-[var(--ink)]"
                    >
                      {o}
                      {"sufixoOpcao" in passoAtual ? passoAtual.sufixoOpcao : ""}
                    </button>
                  ))
                : respostas.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => ask(r.pergunta, r.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        r.id === "orcamento"
                          ? "border-transparent bg-[var(--lime-cta)] text-[var(--ink)] hover:brightness-110"
                          : "border-white/20 text-white/90 hover:border-white/50 hover:bg-white/10"
                      }`}
                    >
                      {r.pergunta}
                    </button>
                  ))}
            </div>
          )}
        </div>

        {/* campo */}
        <form data-anim onSubmit={onSubmit} className="flex items-center gap-2 px-4 pb-4 pt-1">
          <label htmlFor="assistente-input" className="sr-only">
            {passoAtual?.pergunta ?? assistente.placeholderInput}
          </label>
          <input
            ref={inputRef}
            id="assistente-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={passoAtual?.placeholder ?? assistente.placeholderInput}
            autoComplete="off"
            className="h-12 flex-1 rounded-full border border-white/15 bg-white/[0.06] px-5 text-[0.95rem] text-white placeholder:text-white/40 focus:border-[var(--lime-cta)] focus:outline-none"
          />
          <button
            type="submit"
            aria-label={assistente.enviar}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--lime-cta)] text-[var(--ink)] transition-transform hover:scale-105"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
