import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Sobre } from "@/components/sections/Sobre";
import { Eventos } from "@/components/sections/Eventos";
import { Personalizado } from "@/components/sections/Personalizado";
import { Galeria } from "@/components/sections/Galeria";
import { Estrutura } from "@/components/sections/Estrutura";
import { ComoReservar } from "@/components/sections/ComoReservar";
import { OndeEstamos } from "@/components/sections/OndeEstamos";
import { Faq } from "@/components/sections/Faq";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { Frase } from "@/components/sections/Frase";
import { LazyExtras } from "@/components/providers/LazyExtras";
import { WaveDivider } from "@/components/decor/WaveDivider";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        {/* ondas: a seção de baixo "entra" na de cima */}
        <WaveDivider size="lg" tint="var(--pink-hot)" seed={1} />
        <Sobre />
        <WaveDivider tint="var(--glow-amber)" seed={2} reverse />
        <Eventos />
        <WaveDivider tint="var(--pink-hot)" seed={12} reverse />
        <Personalizado />
        <WaveDivider tint="var(--glow-orange)" seed={3} />
        <Galeria />
        <WaveDivider tint="var(--pink-hot)" seed={4} reverse />
        <Estrutura />
        <WaveDivider tint="var(--glow-amber)" seed={5} />
        <ComoReservar />
        <WaveDivider tint="var(--glow-orange)" seed={6} reverse />
        <OndeEstamos />
        <WaveDivider tint="var(--glow-amber)" seed={8} reverse />
        <Faq />
        <WaveDivider tint="var(--glow-orange)" seed={9} />
        <Frase />
        <WaveDivider tint="var(--pink-hot)" seed={11} reverse />
        <CtaFinal />
      </main>
      <WaveDivider fill="var(--bg-darkest)" tint="var(--glow-amber)" seed={10} reverse />
      <Footer />
      <LazyExtras />
    </>
  );
}
