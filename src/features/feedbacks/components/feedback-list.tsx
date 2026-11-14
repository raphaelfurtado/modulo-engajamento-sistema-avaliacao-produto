import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cacheLife, cacheTag } from "next/cache";
import type { FeedbackItem as FeedbackItemData } from "../schema";
import { FeedbackItem } from "./feedback-item";

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
      <p className="border-y border-pauta py-6 text-muted-foreground">
        Ninguém avaliou este produto ainda. Se você já usou, conte como foi.
      </p>
    );
  }

  const now = new Date();

  return (
    <ol className="border-t border-pauta">
      {feedbacks.map((feedback) => {
        const createdAt = new Date(feedback.createdAt);
        return (
          <li key={feedback.id} className="border-b border-pauta">
            <FeedbackItem
              feedback={feedback}
              relativeDate={formatDistance(createdAt, now, {
                addSuffix: true,
                locale: ptBR,
              })}
              fullDate={fullDateFormatter.format(createdAt)}
            />
          </li>
        );
      })}
    </ol>
  );
}
