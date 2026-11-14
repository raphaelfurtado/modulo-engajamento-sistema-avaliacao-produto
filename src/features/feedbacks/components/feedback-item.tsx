import Image from "next/image";
import { Grade } from "@/components/prova/grade";
import {
  authorDisplayName,
  type FeedbackItem as FeedbackItemData,
  feedbackElementId,
} from "../schema";

type FeedbackItemProps = {
  feedback: FeedbackItemData;
  /** "há 3 dias", calculado pela lista. */
  relativeDate: string;
  /** Data completa, para o title do <time>. */
  fullDate: string;
};

/**
 * Uma resposta corrigida: a nota à mão na margem da folha e o comentário à
 * direita, separados das demais só pelas linhas da pauta.
 */
export function FeedbackItem({
  feedback,
  relativeDate,
  fullDate,
}: FeedbackItemProps) {
  const elementId = feedbackElementId(feedback.id);
  const authorId = `${elementId}-autor`;

  return (
    <article
      id={elementId}
      tabIndex={-1}
      aria-labelledby={authorId}
      className="grid scroll-mt-24 grid-cols-[3.5rem_minmax(0,1fr)] outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:grid-cols-[5rem_minmax(0,1fr)] [&:focus]:bg-ink/[0.04]"
    >
      {/* Margem do caderno: a nota fica aqui, como na correção do professor. */}
      <div className="flex justify-center border-r border-pauta pt-4">
        <Grade value={feedback.score} size="sm" />
      </div>

      <div className="min-w-0 py-5 pl-4 sm:pl-6">
        <header className="flex items-center gap-3">
          <Image
            src={feedback.author.avatarUrl}
            alt=""
            width={36}
            height={36}
            unoptimized
            className="size-9 shrink-0 rounded-full border bg-muted"
          />
          <div className="leading-tight">
            <p id={authorId} className="font-semibold">
              {authorDisplayName(feedback.author)}
            </p>
            <time
              dateTime={feedback.createdAt}
              title={fullDate}
              className="text-sm text-muted-foreground"
            >
              {relativeDate}
            </time>
          </div>
        </header>
        <p className="mt-3 max-w-[65ch] text-pretty break-words whitespace-pre-line leading-7">
          {feedback.comment}
        </p>
      </div>
    </article>
  );
}
