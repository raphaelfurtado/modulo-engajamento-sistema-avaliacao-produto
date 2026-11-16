import type { ReactNode } from "react";

/**
 * Cartão do bloco "Avalie este produto": título e explicação à esquerda,
 * conteúdo à direita (empilha no celular).
 */
export function ReviewLayout({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid items-start gap-6 rounded-lg border bg-card p-5 sm:p-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
      <div>
        <h2
          id="sua-nota-titulo"
          className="font-wide text-2xl leading-tight font-extrabold tracking-[-0.02em] text-balance sm:text-[1.75rem]"
        >
          {title}
        </h2>
        <p className="mt-2 max-w-[44ch] text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}
