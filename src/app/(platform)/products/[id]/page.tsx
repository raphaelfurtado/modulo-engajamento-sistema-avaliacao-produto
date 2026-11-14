import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FeedbackList } from "@/features/feedbacks/components/feedback-list";
import { ProductHeader } from "@/features/feedbacks/components/product-header";
import {
  ReviewSection,
  ReviewSectionSkeleton,
} from "@/features/feedbacks/components/review-section";
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
 * Página do produto como uma folha de correção: o produto no topo (o
 * enunciado), as avaliações corrigidas e, no fim, a folha em branco.
 * `params` é dado de requisição: o loading.tsx do segmento cobre a espera.
 */
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const data = await getProductWithFeedbacks(id);
  if (!data) notFound();

  const { product, feedbacks, average } = data;

  return (
    <article className="flex flex-col gap-14 sm:gap-16">
      <ProductHeader
        name={product.name}
        description={product.description}
        imageUrl={product.imageUrl}
        externalLink={product.externalLink}
        average={average}
        count={feedbacks.length}
      />

      <div className="flex max-w-3xl flex-col gap-14 sm:gap-16">
        <section aria-labelledby="avaliacoes">
          <h2
            id="avaliacoes"
            className="mb-4 flex items-baseline gap-3 text-2xl font-bold tracking-[-0.02em]"
          >
            Avaliações
            {feedbacks.length > 0 && (
              <span className="text-base font-normal text-muted-foreground">
                {feedbacks.length}
              </span>
            )}
          </h2>
          <FeedbackList
            productId={product.id}
            feedbacks={feedbacks.map(toFeedbackItem)}
          />
        </section>

        <section aria-labelledby="nova-avaliacao">
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
    </article>
  );
}
