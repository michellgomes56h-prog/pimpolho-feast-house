// Gera fotos placeholder (substitua pelos arquivos reais com o MESMO nome).
// Uso: node scripts/gen-placeholders.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const palette = ["#FFD21F", "#7ED957", "#FF3EA5", "#3A8DFF", "#FF4B4B", "#8BE04E", "#FF8A1F", "#B36BFF"];

function rand(seed) {
  let s = seed;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

function svg({ w, h, label, seed, hueA, hueB }) {
  const r = rand(seed);
  let bokeh = "";
  for (let i = 0; i < 26; i++) {
    const c = palette[Math.floor(r() * palette.length)];
    const cx = r() * w, cy = r() * h * 0.75, rad = 10 + r() * (w * 0.09);
    bokeh += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${c}" opacity="${0.12 + r() * 0.3}" filter="url(#b)"/>`;
  }
  // fio de luzes
  let lights = "";
  for (let k = 0; k < 2; k++) {
    const y0 = h * (0.12 + k * 0.14);
    let d = `M0 ${y0}`;
    for (let x = 0; x <= w; x += w / 4) d += ` Q ${x + w / 8} ${y0 + h * 0.07} ${x + w / 4} ${y0}`;
    lights += `<path d="${d}" stroke="#ffffff" stroke-opacity=".18" stroke-width="2" fill="none"/>`;
    for (let i = 0; i < 14; i++) {
      const x = (i + 0.5) * (w / 14);
      const y = y0 + Math.abs(Math.sin((x / w) * Math.PI * 4)) * h * 0.035 + 6;
      lights += `<circle cx="${x}" cy="${y}" r="${w * 0.009}" fill="${palette[(i + k) % 8]}"/><circle cx="${x}" cy="${y}" r="${w * 0.03}" fill="${palette[(i + k) % 8]}" opacity=".25" filter="url(#b)"/>`;
    }
  }
  const fs = Math.round(w * 0.05);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hueA}"/><stop offset="1" stop-color="${hueB}"/></linearGradient>
    <radialGradient id="v" cx=".5" cy=".55" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
    <filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${w * 0.012}"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  ${bokeh}${lights}
  <rect y="${h * 0.78}" width="${w}" height="${h * 0.22}" fill="#1b0b05" opacity=".55"/>
  <rect width="100%" height="100%" fill="url(#v)"/>
  <g transform="translate(${w / 2} ${h * 0.5})">
    <rect x="${-w * 0.42}" y="${-fs * 1.9}" width="${w * 0.84}" height="${fs * 3.2}" rx="${fs * 0.7}" fill="#1b0b05" fill-opacity=".62" stroke="#ffffff" stroke-opacity=".35" stroke-dasharray="8 8"/>
    <text x="0" y="${-fs * 0.35}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace" font-size="${fs * 0.55}" fill="#D6F55B" letter-spacing="3">PLACEHOLDER</text>
    <text x="0" y="${fs * 0.75}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" font-weight="bold" font-size="${fs}" fill="#ffffff">[FOTO: ${label}]</text>
  </g>
</svg>`;
}

const jobs = [
  { out: "public/images/galeria/mesa-do-bolo.jpg", w: 1000, h: 1250, label: "mesa do bolo", seed: 17, hueA: "#8a3a12", hueB: "#ff6a8f" },
  { out: "public/images/galeria/area-externa.jpg", w: 1400, h: 950, label: "área externa", seed: 29, hueA: "#5a3510", hueB: "#2e9f8f" },
  { out: "public/images/galeria/pista-iluminacao.jpg", w: 1000, h: 1300, label: "pista/iluminação", seed: 41, hueA: "#2a1209", hueB: "#e0682a" },
  { out: "public/images/eventos/formatura.jpg", w: 900, h: 700, label: "formatura", seed: 53, hueA: "#b04a18", hueB: "#ff8a3d" },
  { out: "public/images/eventos/15-anos.jpg", w: 900, h: 700, label: "15 anos", seed: 57, hueA: "#8a3a12", hueB: "#ff8a1f" },
  { out: "public/images/eventos/cha-revelacao.jpg", w: 900, h: 700, label: "chá revelação/bebê", seed: 61, hueA: "#ff9a52", hueB: "#ff6ab4" },
  { out: "public/images/eventos/corporativo.jpg", w: 900, h: 700, label: "evento corporativo", seed: 67, hueA: "#2a1209", hueB: "#ff9a52" },
  { out: "public/images/galeria/fachada.jpg", w: 1000, h: 1250, label: "fachada", seed: 71, hueA: "#5a230d", hueB: "#ffb38a" },
  { out: "public/og-image.jpg", w: 1200, h: 630, label: "fachada / salão (Open Graph)", seed: 5, hueA: "#5a230d", hueB: "#ff3ea5" },
];

for (const j of jobs) {
  mkdirSync(j.out.split("/").slice(0, -1).join("/"), { recursive: true });
  await sharp(Buffer.from(svg(j))).jpeg({ quality: 82, mozjpeg: true }).toFile(j.out);
  console.log("✓", j.out);
}
