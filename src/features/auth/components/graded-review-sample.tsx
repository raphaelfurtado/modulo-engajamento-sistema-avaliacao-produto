import { Grade } from "@/components/prova/grade";

/**
 * Exemplo de avaliação "corrigida": a nota de 0 a 5 escrita à mão e
 * circulada em caneta azul. É o único elemento ousado da página.
 */
export function GradedReviewSample() {
  return (
    <figure className="w-full max-w-lg justify-self-center lg:justify-self-end">
      <div className="rounded-lg border bg-card px-6 pt-6 pb-4 sm:px-9 sm:pt-8">
        <div className="ruled-paper leading-8 sm:text-[1.0625rem]">
          {/* A nota flutua no canto e o texto a contorna, como numa folha corrigida. */}
          <Grade
            value={4.5}
            size="lg"
            circled
            animated
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
        Exemplo de avaliação. Na Prova, a nota vai de 0 a 5.
      </figcaption>
    </figure>
  );
}
