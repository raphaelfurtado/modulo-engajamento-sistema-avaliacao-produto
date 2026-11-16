import { SparklesIcon } from "lucide-react";
import { countLabel } from "../format";

type AiSummaryProps = {
  summary: string;
  /** Quantas avaliações o resumo considerou. */
  feedbackCount: number;
};

/**
 * Resumo das avaliações escrito pela IA, entre o produto e as avaliações.
 * A origem fica no título, para ninguém ler como opinião de uma pessoa.
 */
export function AiSummary({ summary, feedbackCount }: AiSummaryProps) {
  return (
    <section
      aria-labelledby="resumo-ia"
      className="grid gap-4 rounded-lg border bg-card p-5 sm:p-7 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10"
    >
      <div className="flex flex-col items-start gap-2">
        <h2
          id="resumo-ia"
          className="font-wide text-xl leading-tight font-extrabold tracking-[-0.01em]"
        >
          Resumo das avaliações
        </h2>
        <p className="inline-flex items-center gap-1.5 rounded-sm bg-muted px-2 py-1 text-[0.8125rem] font-medium">
          <SparklesIcon aria-hidden="true" className="size-3.5" />
          Gerado por IA
        </p>
      </div>
      <div>
        <p className="max-w-[68ch] text-[1.0625rem] leading-7 text-pretty">
          {summary}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Feito a partir de {countLabel(feedbackCount)}. Pode conter
          imprecisões; as avaliações completas estão logo abaixo.
        </p>
      </div>
    </section>
  );
}
