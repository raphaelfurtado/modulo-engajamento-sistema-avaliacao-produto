import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Cartão vazio no mesmo formato do real, para não deslocar o layout. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-card",
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 sm:p-5">
        {/* Mesma altura de linha do nome (text-lg leading-snug). */}
        <div className="text-lg leading-snug">
          <Skeleton className="inline-block h-[1em] w-3/5 align-middle" />
        </div>
      </div>
    </div>
  );
}

/** Grade de cartões vazios (fallback da primeira página). */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <output aria-label="Carregando produtos" className="block">
      <ul className={PRODUCT_GRID_CLASS}>
        {Array.from({ length: count }, (_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: lista estática de placeholders
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </output>
  );
}

/** Grid mobile-first: 1 coluna no celular, 2 no tablet, 3 no desktop. */
export const PRODUCT_GRID_CLASS = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";
