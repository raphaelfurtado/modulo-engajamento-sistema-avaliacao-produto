import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { getSupabase } from "@/server/db/supabase";
import type { ProductRow } from "@/server/db/types";
import {
  FEEDBACK_COLUMNS,
  type ProductFeedback,
  productCacheTag,
  toProductFeedback,
} from "./shared";

export type ProductDetails = Pick<ProductRow, "id" | "name" | "description"> & {
  imageUrl: string;
  externalLink: string;
};

export type ProductWithFeedbacks = {
  product: ProductDetails;
  /** Mais recentes primeiro. */
  feedbacks: ProductFeedback[];
  /** Média das notas (D2: calculada aqui, sem trigger), ou null sem avaliações. */
  average: number | null;
};

/** Ids são nanoid; qualquer coisa muito longa nem vai ao banco. */
const MAX_ID_LENGTH = 64;

/**
 * Produto + todas as avaliações. Cacheado por produto; a criação de uma
 * avaliação invalida a tag `product:<id>`. Retorna null se o produto não existe.
 */
export async function getProductWithFeedbacks(
  id: string,
): Promise<ProductWithFeedbacks | null> {
  "use cache";
  cacheTag(productCacheTag(id));
  cacheLife("hours");

  if (!id || id.length > MAX_ID_LENGTH) return null;

  const supabase = getSupabase();
  const [productResult, feedbacksResult] = await Promise.all([
    supabase
      .from("products")
      .select("id, name, description, image_url, external_link")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("products_feedbacks")
      .select(FEEDBACK_COLUMNS)
      .eq("product_id", id)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false }),
  ]);

  if (productResult.error) {
    throw new Error(`Falha ao ler o produto: ${productResult.error.message}`, {
      cause: productResult.error,
    });
  }
  if (feedbacksResult.error) {
    throw new Error(
      `Falha ao ler as avaliações: ${feedbacksResult.error.message}`,
      { cause: feedbacksResult.error },
    );
  }

  const row = productResult.data;
  if (!row) return null;

  const feedbacks = feedbacksResult.data.map(toProductFeedback);
  const average =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, feedback) => sum + feedback.score, 0) /
        feedbacks.length
      : null;

  return {
    product: {
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
      externalLink: row.external_link,
    },
    feedbacks,
    average,
  };
}
