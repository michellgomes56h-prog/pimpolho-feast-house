import type { Metadata, Viewport } from "next";
import { Caveat, Emilys_Candy, Sora } from "next/font/google";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/data/site";
import { contato } from "@/data/contato";
import "./globals.css";

// Fontes variáveis: um arquivo por família (carrega mais rápido)
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
// fonte do nome "Pimpolho" (parecida com o letreiro da fachada — escolhida pela cliente)
const emilys = Emilys_Candy({ variable: "--font-emilys", subsets: ["latin"], weight: "400", display: "swap" });
// letra cursiva do cartão da frase (fica abaixo da dobra → sem preload, não pesa no carregamento)
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url.includes("[") ? "http://localhost:3000" : site.url),
  title: site.seo.title,
  alternates: { canonical: "/" },
  keywords: ["festa infantil Panambi", "espaço de festas Panambi", "salão de festas infantil", "aniversário infantil", "chá de bebê", "chá revelação", "festa personalizada", "Pimpolho Feast House"],
  description: site.seo.description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nome,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630, alt: site.nome }],
  },
  twitter: { card: "summary_large_image", title: site.seo.title, description: site.seo.description, images: [site.seo.ogImage] },
};

export const viewport: Viewport = { themeColor: "#D15610", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: site.nome,
  description: site.seo.description,
  url: site.url,
  image: site.seo.ogImage,
  telephone: `+${contato.whatsapp}`,
  maximumAttendeeCapacity: contato.capacidade,
  address: {
    "@type": "PostalAddress",
    streetAddress: contato.endereco,
    addressLocality: contato.cidade,
    addressRegion: contato.uf,
    postalCode: contato.cep,
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: contato.latitude, longitude: contato.longitude },
  sameAs: [contato.instagramUrl],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${emilys.variable} ${caveat.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--lime-cta)] focus:px-5 focus:py-3 focus:font-semibold focus:text-[var(--ink)]"
        >
          Pular para o conteúdo
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
