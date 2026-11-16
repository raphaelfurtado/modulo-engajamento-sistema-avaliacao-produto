import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "../schema";

// Largura real da foto em cada faixa do grid (1, 2 ou 3 colunas dentro de 1180px).
const IMAGE_SIZES = "(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw";

type ProductCardProps = {
  product: ProductSummary;
  /** Posição na lista: os primeiros cartões ficam acima da dobra. */
  index: number;
  className?: string;
};

/**
 * Produto na lista: cartão branco com a foto inteira (sem corte) e o nome
 * em Archivo expandida. O cartão inteiro é clicável.
 */
export function ProductCard({ product, index, className }: ProductCardProps) {
  const aboveTheFold = index < 3;

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-lg border bg-card transition-colors hover:border-input",
        className,
      )}
    >
      {/* Fundo sempre branco: as fotos das lojas vêm com fundo branco. */}
      <div className="relative aspect-[4/3] border-b bg-white">
        <Image
          src={product.imageUrl}
          // Decorativa: o nome logo abaixo já identifica o produto.
          alt=""
          fill
          sizes={IMAGE_SIZES}
          loading={aboveTheFold ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
          className="object-contain p-6"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <h2 className="font-wide text-lg leading-snug font-extrabold tracking-[-0.015em] text-pretty">
          <Link
            href={`/products/${product.id}`}
            className="line-clamp-3 underline-offset-4 outline-none group-hover/card:underline after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-3 focus-visible:after:ring-ring/60"
          >
            {product.name}
          </Link>
        </h2>
        {product.description && (
          <p className="line-clamp-2 text-[0.9375rem] leading-6 text-muted-foreground">
            {product.description}
          </p>
        )}
      </div>
    </article>
  );
}
