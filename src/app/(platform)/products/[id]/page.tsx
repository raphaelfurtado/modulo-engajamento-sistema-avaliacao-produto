import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { GRADES } from "@/components/prova/grade";
import { AiSummary } from "@/features/feedbacks/components/ai-summary";
import { FeedbackList } from "@/features/feedbacks/components/feedback-list";
import { ProductHeader } from "@/features/feedbacks/components/product-header";
import {
  ReviewSection,
  ReviewSectionSkeleton,
} from "@/features/feedbacks/components/review-section";
import { cn } from "@/lib/utils";
import { getProductWithFeedbacks } from "@/server/feedbacks/get-product";
import { toFeedbackItem } from "@/server/feedbacks/shared";

type Props = PageProps<"/products/[id]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getProductWithFeedbacks(id);
  if (!data) return { title: "Produto não encontrado" };

  const { product } = data;
  return {
    title: product.name,
    description:
      product.description?.slice(0, 160) ??
      `Avaliações de ${product.name} feitas por quem usou, com nota de 0 a 5.`,
  };
}

/**
 * Página do produto, de cima para baixo: a foto, o nome e a etiqueta de nota;
 * o resumo da IA; as avaliações; e o bloco para avaliar.
 * `params` é dado de requisição: o loading.tsx do segmento cobre a espera.
 */
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const data = await getProductWithFeedbacks(id);
  if (!data) notFound();

  const { product, feedbacks, average, aiSummary } = data;
  const items = feedbacks.map(toFeedbackItem);
  const counts = GRADES.map(
    (grade) => feedbacks.filter((feedback) => feedback.score === grade).length,
  );

  return (
    <>
      <ProductHeader
        name={product.name}
        description={product.description}
        imageUrl={product.imageUrl}
        externalLink={product.externalLink}
        average={average}
        counts={counts}
      />

      <div
        className={cn(PAGE_CONTAINER, "flex flex-col gap-12 pb-16 sm:gap-14")}
      >
        {aiSummary && (
          <AiSummary
            summary={aiSummary.text}
            feedbackCount={aiSummary.feedbackCount}
          />
        )}

        <section aria-labelledby="avaliacoes">
          <FeedbackList productId={product.id} feedbacks={items} />
        </section>

        <section
          id="sua-nota"
          aria-labelledby="sua-nota-titulo"
          className="scroll-mt-6"
        >
          {/* Só este bloco lê a sessão; o resto da página não espera por ele. */}
          <Suspense fallback={<ReviewSectionSkeleton />}>
            <ReviewSection
              productId={product.id}
              feedbacks={feedbacks.map(({ id, score, authorId }) => ({
                id,
                score,
                authorId,
              }))}
            />
          </Suspense>
        </section>
      </div>
    </>
  );
}
