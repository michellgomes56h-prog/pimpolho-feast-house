import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Sobre } from "@/components/sections/Sobre";
import { Eventos } from "@/components/sections/Eventos";
import { Galeria } from "@/components/sections/Galeria";
import { Estrutura } from "@/components/sections/Estrutura";
import { ComoReservar } from "@/components/sections/ComoReservar";
import { Depoimentos } from "@/components/sections/Depoimentos";
import { OndeEstamos } from "@/components/sections/OndeEstamos";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { LazyExtras } from "@/components/providers/LazyExtras";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Marquee />
        <Sobre />
        <Eventos />
        <Galeria />
        <Estrutura />
        <ComoReservar />
        <Depoimentos />
        <OndeEstamos />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
      <LazyExtras />
    </>
  );
}
