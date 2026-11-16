import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { ScoreLabel } from "@/components/prova/score-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProductHeaderProps = {
  name: string;
  description: string | null;
  imageUrl: string;
  externalLink: string;
  average: number | null;
  /** Quantas pessoas deram cada nota (índice = nota). */
  counts: number[];
};

/** "amazon.com.br" a partir do link da loja (sem "www."). */
function storeHost(externalLink: string): string | null {
  try {
    return new URL(externalLink).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

const actionClass = "h-12 px-5 text-[0.9375rem] font-semibold";

/**
 * Topo da página: a foto do produto e, ao lado, o nome e a etiqueta de nota,
 * o elemento de destaque da tela.
 */
export function ProductHeader({
  name,
  description,
  imageUrl,
  externalLink,
  average,
  counts,
}: ProductHeaderProps) {
  const host = storeHost(externalLink);
  // Nomes da Amazon passam fácil de 100 caracteres: o título encolhe.
  const longName = name.length > 70;

  return (
    <section
      aria-labelledby="produto"
      className={cn(
        PAGE_CONTAINER,
        "grid items-start gap-8 pt-8 pb-12 sm:pt-10 lg:grid-cols-2 lg:gap-12",
      )}
    >
      <figure className="m-0">
        {/* Fundo sempre branco: as fotos das lojas vêm com fundo branco. */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-white">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 540px, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-contain p-6 sm:p-10"
          />
        </div>
        {host && (
          <figcaption className="mt-2 text-sm text-muted-foreground">
            Vendido em {host}
          </figcaption>
        )}
      </figure>

      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h1
            id="produto"
            className={cn(
              "font-wide font-extrabold text-balance break-words",
              longName
                ? "text-[1.625rem] leading-[1.15] tracking-[-0.02em] sm:text-[2rem]"
                : "text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.75rem]",
            )}
          >
            {name}
          </h1>
          {description && (
            <p className="max-w-[60ch] text-[1.0625rem] leading-relaxed whitespace-pre-line text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <ScoreLabel counts={counts} average={average} animated />

        <div className="flex flex-wrap gap-3">
          <a
            href={externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants(), actionClass)}
          >
            Ver na loja
            <ArrowUpRightIcon aria-hidden="true" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
          <a
            href="#sua-nota"
            className={cn(buttonVariants({ variant: "outline" }), actionClass)}
          >
            Avaliar este produto
          </a>
        </div>
      </div>
    </section>
  );
}
