/**
 * Exemplo de avaliação "corrigida": a nota de 0 a 10 escrita à mão e
 * circulada em caneta azul. É o único elemento ousado da página.
 */
export function GradedReviewSample() {
  return (
    <figure className="w-full max-w-lg justify-self-center lg:justify-self-end">
      <div className="rounded-lg border bg-card px-6 pt-6 pb-4 sm:px-9 sm:pt-8">
        <div className="ruled-paper leading-8 sm:text-[1.0625rem]">
          {/* A nota flutua no canto e o texto a contorna, como numa folha corrigida. */}
          <Grade
            value="7,5"
            className="float-right -mt-3 -mr-2 ml-3 sm:-mt-4 sm:-mr-3"
          />
          <p className="font-semibold">Air fryer 4 L</p>
          <p className="text-muted-foreground">usada há 7 meses</p>
          <blockquote className="mt-8 text-pretty">
            Frita bem e é fácil de limpar. O cesto começou a descascar no quinto
            mês, então eu compraria de novo, mas usaria só esponja macia.
          </blockquote>
          <p className="mt-8 text-sm text-muted-foreground">
            Juliana R., São Paulo
          </p>
        </div>
      </div>

      <figcaption className="mt-3 text-sm text-muted-foreground">
        Exemplo de avaliação. Na Prova, a nota vai de 0 a 10.
      </figcaption>
    </figure>
  );
}

function Grade({ value, className }: { value: string; className?: string }) {
  return (
    <div
      className={`grid h-24 w-28 place-items-center text-ink sm:h-32 sm:w-36 ${className ?? ""}`}
    >
      <span className="sr-only">Nota {value} de 10</span>
      <span
        aria-hidden="true"
        className="col-start-1 row-start-1 -rotate-6 font-hand text-[3.75rem] leading-none sm:text-[5rem]"
      >
        {value}
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 120 100"
        fill="none"
        className="col-start-1 row-start-1 size-full"
      >
        {/* Círculo feito à mão: não fecha perfeitamente e passa do ponto inicial. */}
        <path
          pathLength={1}
          className="ink-stroke"
          d="M78 12C42 4 10 22 9 50c-1 28 30 44 60 41 30-3 46-24 42-48C107 19 84 7 54 13"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
