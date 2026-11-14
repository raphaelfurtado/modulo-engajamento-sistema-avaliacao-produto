import { ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import { Grade } from "@/components/prova/grade";

type ProductHeaderProps = {
  name: string;
  description: string | null;
  imageUrl: string;
  externalLink: string;
  average: number | null;
  count: number;
};

function averageLabel(count: number) {
  return count === 1 ? "Nota de 1 avaliação" : `Média de ${count} avaliações`;
}

/** O "enunciado" da folha: o produto e a média das notas, à mão. */
export function ProductHeader({
  name,
  description,
  imageUrl,
  externalLink,
  average,
  count,
}: ProductHeaderProps) {
  return (
    <div className="grid items-start gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-card">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1152px) 500px, (min-width: 768px) 45vw, 100vw"
          loading="eager"
          fetchPriority="high"
          className="object-contain p-4 sm:p-6"
        />
      </div>

      <div className="flex flex-col">
        <h1 className="text-[2rem] leading-[1.1] font-bold tracking-[-0.025em] text-balance sm:text-[2.5rem]">
          {name}
        </h1>
        {description && (
          <p className="mt-4 max-w-[60ch] text-lg leading-relaxed whitespace-pre-line text-muted-foreground">
            {description}
          </p>
        )}
        <a
          href={externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-sm font-medium text-ink underline decoration-ink/40 underline-offset-4 outline-none hover:decoration-ink focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Ver na loja
          <ExternalLinkIcon aria-hidden="true" className="size-4" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>

        <div className="mt-6 flex items-center gap-4 border-t border-pauta pt-6">
          {average === null ? (
            <p className="text-muted-foreground">
              Ainda sem nota. A média aparece aqui depois da primeira avaliação.
            </p>
          ) : (
            <>
              {/* O único momento animado da página: a média sendo circulada. */}
              <Grade value={average} size="lg" circled animated />
              <p className="text-muted-foreground">
                <span className="block text-lg font-semibold text-foreground">
                  {averageLabel(count)}
                </span>
                Notas de 0 a 5 dadas por quem usou.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
