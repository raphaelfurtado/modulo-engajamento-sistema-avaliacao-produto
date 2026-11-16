import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cacheLife, cacheTag } from "next/cache";
import type { FeedbackItem as FeedbackItemData } from "../schema";
import { ReviewGrid } from "./review-grid";

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

type FeedbackListProps = {
  productId: string;
  /** Mais recentes primeiro. */
  feedbacks: FeedbackItemData[];
};

/**
 * Todas as avaliações do produto. Cacheada por poucos minutos porque as datas
 * relativas ("há 3 dias") dependem da hora em que a lista foi montada.
 */
export async function FeedbackList({
  productId,
  feedbacks,
}: FeedbackListProps) {
  "use cache";
  cacheTag(`product:${productId}`);
  cacheLife("minutes");

  if (feedbacks.length === 0) {
    return (
      <>
        <h2
          id="avaliacoes"
          className="font-wide text-2xl font-extrabold tracking-[-0.02em]"
        >
          Avaliações
        </h2>
        <p className="mt-5 rounded-lg border border-dashed bg-card px-5 py-6 text-muted-foreground">
          Ninguém avaliou este produto ainda. Se você já usou, conte como foi
          logo abaixo.
        </p>
      </>
    );
  }

  const now = new Date();

  return (
    <ReviewGrid
      items={feedbacks.map((feedback) => {
        const createdAt = new Date(feedback.createdAt);
        return {
          feedback,
          relativeDate: formatDistance(createdAt, now, {
            addSuffix: true,
            locale: ptBR,
          }),
          fullDate: fullDateFormatter.format(createdAt),
        };
      })}
    />
  );
}
