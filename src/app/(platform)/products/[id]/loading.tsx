import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

/** Esqueleto da página do produto enquanto o produto e as avaliações carregam. */
export default function ProductLoading() {
  const block = "rounded-md bg-muted motion-safe:animate-pulse";

  return (
    <div aria-busy="true">
      <output className="sr-only">Carregando o produto…</output>
      <div
        aria-hidden="true"
        className={cn(
          PAGE_CONTAINER,
          "grid items-start gap-8 pt-8 pb-12 sm:pt-10 lg:grid-cols-2 lg:gap-12",
        )}
      >
        <div className={`aspect-[4/3] rounded-lg border ${block}`} />
        <div className="flex flex-col gap-4">
          <div className={`h-11 w-4/5 ${block}`} />
          <div className={`h-11 w-3/5 ${block}`} />
          <div className="mt-2 flex flex-col gap-1.5 rounded-lg border bg-card p-5 sm:p-6">
            {[44, 54, 64, 74, 84, 94].map((width) => (
              <div
                key={width}
                className={`h-8 sm:h-9 ${block}`}
                style={{ width: `${width - 10}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
