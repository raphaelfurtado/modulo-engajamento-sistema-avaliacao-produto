import { getCurrentUser } from "@/server/auth/session";
import { AlreadyReviewed } from "./already-reviewed";
import { FeedbackForm } from "./feedback-form";
import { SignInToReview } from "./sign-in-to-review";

type ReviewSectionProps = {
  productId: string;
  /** Avaliações já carregadas pela página (com o id de quem escreveu). */
  feedbacks: { id: string; score: number; authorId: string }[];
};

/**
 * Bloco "nova avaliação". Lê a sessão (cookies), então a página o renderiza
 * dentro de <Suspense>: produto e avaliações aparecem sem esperar por ele.
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
    <div className="rounded-lg border bg-card p-5 sm:p-8">
      <h2
        id="nova-avaliacao"
        className="text-xl font-bold tracking-[-0.015em] sm:text-2xl"
      >
        Avalie este produto
      </h2>
      <p className="mt-2 mb-7 max-w-[60ch] text-muted-foreground">
        Sua avaliação aparece com seu primeiro nome e a inicial do sobrenome.
      </p>
      <FeedbackForm productId={productId} />
    </div>
  );
}

/** Reserva o espaço do bloco enquanto a sessão é lida. */
export function ReviewSectionSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-56 rounded-lg border bg-card motion-safe:animate-pulse"
    />
  );
}
