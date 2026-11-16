import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Logotipo da Prova: "prova" em Archivo expandida, com uma etiqueta de nota
 * em miniatura (três barras: verde, amarela, vermelha) à esquerda.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-sm text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span aria-hidden="true" className="flex flex-col gap-[3px]">
        <span className="h-1 w-2.5 bg-nota-5" />
        <span className="h-1 w-3.5 bg-nota-3" />
        <span className="h-1 w-[1.125rem] bg-nota-0" />
      </span>
      <span className="font-wide text-[1.5rem] leading-none font-extrabold tracking-[-0.03em]">
        prova
      </span>
      <span className="sr-only"> (página inicial)</span>
    </Link>
  );
}
