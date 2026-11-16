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

/** Uma avaliação: o selo da nota à esquerda, quem escreveu e o comentário. */
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
      className="grid scroll-mt-24 grid-cols-[auto_minmax(0,1fr)] gap-4 px-4 py-6 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:gap-5 sm:px-6 [&:focus]:bg-muted/60"
    >
      <Grade value={feedback.score} size="md" />
      <div className="min-w-0">
        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
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
        </header>
        <p className="mt-2 max-w-[68ch] leading-7 text-pretty break-words whitespace-pre-line">
          {feedback.comment}
        </p>
      </div>
    </article>
  );
}
