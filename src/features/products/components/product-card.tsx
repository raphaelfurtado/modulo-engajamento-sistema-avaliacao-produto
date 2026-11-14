import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProductSummary } from "../schema";

// Largura real da foto em cada faixa do grid (1, 2 ou 3 colunas dentro de max-w-6xl).
const IMAGE_SIZES = "(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw";

type ProductCardProps = {
  product: ProductSummary;
  /** Posição na lista: os primeiros cartões ficam acima da dobra. */
  index: number;
  className?: string;
};

/**
 * "Ficha de teste": papel branco, a foto do produto com respiro, o nome como
 * título da prova e a descrição escrita sobre as linhas da pauta.
 */
export function ProductCard({ product, index, className }: ProductCardProps) {
  const aboveTheFold = index < 3;

  return (
    <article
      className={cn(
        "group/card relative flex h-full flex-col rounded-md border border-border bg-card p-3 text-card-foreground sm:p-4",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted">
        <Image
          src={product.imageUrl}
          // Decorativa: o nome logo abaixo já identifica o produto.
          alt=""
          fill
          sizes={IMAGE_SIZES}
          loading={aboveTheFold ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
          className="object-cover"
        />
      </div>

      <div className="px-1 pt-5 sm:px-2">
        <h2 className="text-xl leading-snug font-semibold tracking-[-0.015em] text-pretty">
          <Link
            href={`/products/${product.id}`}
            className="underline-offset-4 outline-none group-hover/card:text-ink group-hover/card:underline after:absolute after:inset-0 after:rounded-md focus-visible:after:ring-3 focus-visible:after:ring-ring/60"
          >
            {product.name}
          </Link>
        </h2>

        {/* Duas linhas de pauta: com ou sem descrição, as fichas têm a mesma altura. */}
        <div className="ruled-paper mt-1 h-16">
          {product.description && (
            <p className="line-clamp-2 text-[0.9375rem] leading-8 text-muted-foreground">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
