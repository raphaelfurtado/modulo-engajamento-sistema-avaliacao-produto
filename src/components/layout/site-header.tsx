import { Suspense } from "react";
import { Wordmark } from "@/components/prova/wordmark";
import { cn } from "@/lib/utils";
import { HeaderAccount, HeaderAccountFallback } from "./header-account";
import { PAGE_CONTAINER } from "./page-container";

/** Cabeçalho da plataforma: faixa branca com o logotipo e a conta. */
export function SiteHeader() {
  return (
    <header className="border-b bg-card">
      <div
        className={cn(
          PAGE_CONTAINER,
          "flex h-16 items-center justify-between gap-4",
        )}
      >
        <Wordmark />
        {/* Lê a sessão (cookies): precisa de Suspense com cacheComponents. */}
        <Suspense fallback={<HeaderAccountFallback />}>
          <HeaderAccount />
        </Suspense>
      </div>
    </header>
  );
}
