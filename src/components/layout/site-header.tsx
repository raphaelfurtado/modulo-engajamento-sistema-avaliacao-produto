import Link from "next/link";
import { Suspense } from "react";
import { HeaderAccount } from "./header-account";

/** Cabeçalho da plataforma (Fase 0: esqueleto). Dono: agente de Sign-in. */
export function SiteHeader() {
  return (
    <header className="border-b border-pauta">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="rounded-sm text-2xl font-extrabold tracking-[-0.03em] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Prova
        </Link>
        {/* Lê a sessão (cookies): precisa de Suspense com cacheComponents. */}
        <Suspense fallback={<div className="h-11 w-24" aria-hidden="true" />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}
