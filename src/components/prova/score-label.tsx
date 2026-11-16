import { cn } from "@/lib/utils";
import { formatAverage, GRADE_COLORS, GRADES, MAX_GRADE } from "./grade";

type ScoreLabelProps = {
  /** Quantas pessoas deram cada nota (índice = nota, de 0 a 5). */
  counts: readonly number[];
  /** Média das notas, ou null sem avaliações. */
  average: number | null;
  /** Barras crescem ao carregar (use só no elemento de destaque da tela). */
  animated?: boolean;
  className?: string;
};

/** Barra mais curta no 5 e mais longa no 0, como nas etiquetas de consumo. */
function barWidth(grade: number): string {
  return `${34 + (MAX_GRADE - grade) * 10}%`;
}

function describe(counts: readonly number[], average: number | null): string {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (average === null || total === 0) return "Ainda sem avaliações.";
  const parts = GRADES.toReversed()
    .filter((grade) => counts[grade] > 0)
    .map(
      (grade) =>
        `${counts[grade]} ${counts[grade] === 1 ? "pessoa deu" : "pessoas deram"} ${grade}`,
    );
  return `Média ${formatAverage(average)} de ${MAX_GRADE}, em ${total} ${total === 1 ? "avaliação" : "avaliações"}: ${parts.join(", ")}.`;
}

/**
 * Etiqueta de nota da Prova, no formato que o consumidor brasileiro conhece
 * das etiquetas de eficiência: seis barras escalonadas, do 5 (verde, no topo)
 * ao 0 (vermelho), a quantidade de pessoas em cada nota e uma seta preta
 * apontando a média.
 */
export function ScoreLabel({
  counts,
  average,
  animated = false,
  className,
}: ScoreLabelProps) {
  const total = counts.reduce((sum, count) => sum + count, 0);
  const averageRow = average === null ? null : Math.round(average);

  return (
    <figure
      className={cn("m-0 rounded-lg border bg-card p-5 sm:p-6", className)}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-wide text-lg font-extrabold tracking-[-0.01em]">
          Nota Prova
        </p>
        <p className="text-sm text-muted-foreground">
          de 0 a 5, dada por quem usou
        </p>
      </div>

      <p className="sr-only">{describe(counts, average)}</p>

      <ol aria-hidden="true" className="mt-4 flex flex-col gap-1.5">
        {GRADES.toReversed().map((grade, row) => (
          <li
            key={grade}
            className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-2"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className={cn(
                  "bar-arrow flex h-8 items-center pl-2.5 font-wide text-base font-extrabold sm:h-9",
                  GRADE_COLORS[grade],
                  animated && "animate-bar-grow",
                )}
                style={{
                  width: barWidth(grade),
                  animationDelay: animated ? `${row * 70}ms` : undefined,
                }}
              >
                {grade}
              </span>
              <span
                className={cn(
                  "text-sm tabular-nums",
                  counts[grade] > 0
                    ? "font-semibold"
                    : "text-muted-foreground/70",
                )}
              >
                {counts[grade]}
              </span>
              {/* Liga a barra da nota mais próxima à seta da média. */}
              {grade === averageRow && (
                <span className="h-0 flex-1 border-t-2 border-dotted border-foreground/40" />
              )}
            </div>
            {grade === averageRow && average !== null && (
              <span className="tag-arrow flex h-10 items-center justify-end bg-foreground pr-3 font-wide text-xl font-extrabold text-background tabular-nums sm:h-11 sm:text-2xl">
                {formatAverage(average)}
              </span>
            )}
          </li>
        ))}
      </ol>

      <figcaption className="mt-4 border-t pt-3 text-sm text-muted-foreground">
        {total === 0
          ? "Ainda sem avaliações. A seta da média aparece com a primeira nota."
          : `${total} ${total === 1 ? "avaliação" : "avaliações"}. O número ao lado de cada barra é quantas pessoas deram aquela nota; a seta marca a média.`}
      </figcaption>
    </figure>
  );
}
