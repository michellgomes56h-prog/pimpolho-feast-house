"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Assistente = dynamic(() => import("@/components/assistente/Assistente").then((m) => m.Assistente), { ssr: false });
const Cursor = dynamic(() => import("@/components/ui/Cursor").then((m) => m.Cursor), { ssr: false });

/** Carrega o assistente e o cursor depois que a página fica ociosa (não pesa no carregamento inicial). */
export function LazyExtras() {
  const [ready, setReady] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const go = () => {
      setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
      setReady(true);
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(go, 1500);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;
  return (
    <>
      <Assistente />
      {fine && <Cursor />}
    </>
  );
}
