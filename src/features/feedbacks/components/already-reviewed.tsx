import { Grade } from "@/components/prova/grade";
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
    <div className="flex items-center gap-5 rounded-lg border bg-card p-5 sm:p-8">
      <Grade value={score} size="md" circled />
      <div>
        <h2
          id="nova-avaliacao"
          className="text-xl font-bold tracking-[-0.015em] sm:text-2xl"
        >
          Você já avaliou este produto
        </h2>
        <p className="mt-1 text-muted-foreground">
          Sua nota e seu comentário estão na lista.{" "}
          <a
            href={`#${feedbackElementId(feedbackId)}`}
            className="rounded-sm font-medium text-ink underline decoration-ink/40 underline-offset-4 outline-none hover:decoration-ink focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Ver sua avaliação
          </a>
        </p>
      </div>
      <PublishedFeedbackFocus feedbackId={feedbackId} />
    </div>
  );
}
