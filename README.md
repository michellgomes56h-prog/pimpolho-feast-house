# Pimpolho Feast House — site

Next.js (App Router) + TypeScript + Tailwind + GSAP (ScrollTrigger/SplitText) + Lenis + Leaflet.

## Rodar
```bash
npm install
npm run dev        # desenvolvimento
npm run build && npm start   # produção
```

## Onde editar (sem mexer em componentes)
| Arquivo | Conteúdo |
|---|---|
| `src/data/contato.ts` | WhatsApp, Instagram, endereço, horário, **latitude/longitude** |
| `src/data/site.ts` | menu, hero (fotos), faixa de eventos, "O espaço" (números), CTA final, footer, SEO |
| `src/data/eventos.ts` | cards de eventos |
| `src/data/galeria.ts` | fotos e legendas da galeria |
| `src/data/estrutura.ts` | comodidades (`confirmado: true` remove o selo [CONFIRMAR]) |
| `src/data/reservar.ts` | passos "Como reservar" |
| `src/data/depoimentos.ts` | depoimentos **reais** |
| `src/data/faq.ts` | perguntas frequentes |
| `src/data/assistente.ts` | assistente "Tire suas dúvidas" (respostas, palavras-chave, fluxo de orçamento) |
| `src/app/globals.css` | cores (`--bg-deep`, `--pp-P`… cores das letras do wordmark) |

## Fotos
Troque os arquivos em `public/images/{hero,sobre,eventos,galeria}/` mantendo o mesmo nome
(ou altere o caminho no `src/data`). `node scripts/gen-placeholders.mjs` recria os placeholders.

Logo em SVG: salve em `public/brand/pimpolho.svg` e defina `logoSvg: "/brand/pimpolho.svg"` em `src/data/site.ts`.

## Regras
- Nenhum preço/valor no site (inclusive no assistente).
- Placeholders entre colchetes (`[WHATSAPP]`, `[CAPACIDADE]`…) devem ser trocados por dados reais.
