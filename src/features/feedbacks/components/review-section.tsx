import { getCurrentUser } from "@/server/auth/session";
import { AlreadyReviewed } from "./already-reviewed";
import { FeedbackForm } from "./feedback-form";
import { ReviewLayout } from "./review-layout";
import { SignInToReview } from "./sign-in-to-review";

type ReviewSectionProps = {
  productId: string;
  /** Avaliações já carregadas pela página (com o id de quem escreveu). */
  feedbacks: { id: string; score: number; authorId: string }[];
};

/**
 * Bloco "Avalie este produto", no fim da página. Lê a sessão (cookies),
 * então a página o renderiza dentro de <Suspense>.
 */
export async function ReviewSection({
  productId,
  feedbacks,
}: ReviewSectionProps) {
  const user = await getCurrentUser();
  if (!user) return <SignInToReview productId={productId} />;

  const own = feedbacks.find((feedback) => feedback.authorId === user.id);
  if (own) return <AlreadyReviewed feedbackId={own.id} score={own.score} />;

  return (
    <ReviewLayout
      title="Avalie este produto"
      description="Sua nota entra na etiqueta e na média. A avaliação aparece com seu primeiro nome e a inicial do sobrenome."
    >
      <FeedbackForm productId={productId} />
    </ReviewLayout>
  );
}

/** Reserva o espaço do bloco enquanto a sessão é lida. */
export function ReviewSectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-48 rounded-lg border bg-card motion-safe:animate-pulse"
    />
  );
}
