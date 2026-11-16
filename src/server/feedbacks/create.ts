import "server-only";
import { nanoid } from "nanoid";
import { revalidateTag } from "next/cache";
import { after } from "next/server";
import type {
  CreateFeedbackData,
  FeedbackItem,
} from "@/features/feedbacks/schema";
import { getSupabase } from "@/server/db/supabase";
import {
  AlreadyReviewedError,
  FEEDBACK_COLUMNS,
  ProductNotFoundError,
  productCacheTag,
  toFeedbackItem,
  toProductFeedback,
} from "./shared";
import { refreshProductSummary } from "./summary";

const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";

type CreateFeedbackParams = CreateFeedbackData & {
  productId: string;
  accountId: string;
};

/** Grava a avaliação. Recebe dados já validados pelo schema. */
export async function createFeedback({
  productId,
  accountId,
  score,
  comment,
}: CreateFeedbackParams): Promise<FeedbackItem> {
  const { data, error } = await getSupabase()
    .from("products_feedbacks")
    .insert({
      id: nanoid(),
      product_id: productId,
      created_by: accountId,
      score,
      comment,
    })
    .select(FEEDBACK_COLUMNS)
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) throw new AlreadyReviewedError();
    if (
      error.code === FOREIGN_KEY_VIOLATION &&
      `${error.message} ${error.details}`.includes("product_id")
    ) {
      throw new ProductNotFoundError();
    }
    throw new Error(`Falha ao criar avaliação: ${error.message}`, {
      cause: error,
    });
  }

  // Route Handler: `updateTag` só existe em Server Actions. `expire: 0` faz a
  // próxima visita (o router.refresh() do formulário) ler o banco de novo.
  revalidateTag(productCacheTag(productId), { expire: 0 });

  // Depois da resposta: a pessoa não espera pela IA para ver a avaliação.
  after(() => refreshProductSummary(productId));

  return toFeedbackItem(toProductFeedback(data));
}
