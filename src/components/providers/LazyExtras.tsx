"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Assistente = dynamic(() => import("@/components/assistente/Assistente").then((m) => m.Assistente), { ssr: false });

/** Carrega o assistente depois que a página fica ociosa (não pesa no carregamento inicial). */
export function LazyExtras() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const go = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(go, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(go, 1500);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return null;
  return <Assistente />;
}
