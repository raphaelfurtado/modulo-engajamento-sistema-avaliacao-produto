import { formatGrade, Grade, MAX_GRADE } from "@/components/prova/grade";
import { feedbackElementId } from "../schema";
import { PublishedFeedbackFocus } from "./published-feedback-focus";

/** Estado de quem já avaliou (D7: uma avaliação por pessoa por produto). */
export function AlreadyReviewed({
  feedbackId,
  score,
}: {
  feedbackId: string;
  score: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-lg border bg-card p-5 sm:p-8">
      <Grade value={score} size="lg" />
      <div className="min-w-0 flex-1">
        <h2
          id="sua-nota-titulo"
          className="font-wide text-xl leading-tight font-extrabold tracking-[-0.02em] sm:text-2xl"
        >
          Você deu nota {formatGrade(score)}
          <span className="sr-only"> de {MAX_GRADE}</span> a este produto
        </h2>
        <p className="mt-1 text-muted-foreground">
          Sua nota já está na etiqueta e na média.{" "}
          <a
            href={`#${feedbackElementId(feedbackId)}`}
            className="rounded-sm font-medium text-primary underline decoration-primary/40 underline-offset-4 outline-none hover:decoration-primary focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Ver sua avaliação
          </a>
        </p>
      </div>
      <PublishedFeedbackFocus feedbackId={feedbackId} />
    </div>
  );
}
