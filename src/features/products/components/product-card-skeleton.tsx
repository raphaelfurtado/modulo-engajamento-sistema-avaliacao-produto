import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Ficha vazia no mesmo formato da real, para não deslocar o layout. */
export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex h-full flex-col rounded-md border border-border bg-card p-3 sm:p-4",
        className,
      )}
    >
      <Skeleton className="aspect-[4/3] w-full rounded-sm" />
      <div className="px-1 pt-5 sm:px-2">
        {/* Mesma altura de linha do nome (text-xl leading-snug). */}
        <div className="text-xl leading-snug">
          <Skeleton className="inline-block h-[1em] w-3/5 align-middle" />
        </div>
        <div className="ruled-paper mt-1 h-16" />
      </div>
    </div>
  );
}

/** Grade de fichas vazias (fallback da primeira página). */
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
export const PRODUCT_GRID_CLASS =
  "grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3";
