import "server-only";
import type { FeedbackItem } from "@/features/feedbacks/schema";
import { avatarUrlFor } from "@/server/auth/session";

/** Tag de cache da página do produto (produto + avaliações). */
export function productCacheTag(productId: string): string {
  return `product:${productId}`;
}

/**
 * Colunas lidas de products_feedbacks, com join em accounts só para o nome.
 * O e-mail nunca é selecionado.
 */
export const FEEDBACK_COLUMNS =
  "id, score, comment, created_at, created_by, author:accounts!products_feedbacks_created_by_fkey(first_name, last_name)" as const;

type FeedbackRowWithAuthor = {
  id: string;
  score: number;
  comment: string;
  created_at: string;
  created_by: string;
  author: { first_name: string; last_name: string } | null;
};

/** Avaliação com o id de quem escreveu (só para uso no servidor). */
export type ProductFeedback = FeedbackItem & { authorId: string };

export function toProductFeedback(row: FeedbackRowWithAuthor): ProductFeedback {
  const lastName = row.author?.last_name.trim() ?? "";
  return {
    id: row.id,
    score: row.score,
    comment: row.comment,
    createdAt: row.created_at,
    authorId: row.created_by,
    author: {
      firstName: row.author?.first_name.trim() || "Alguém",
      lastInitial: lastName
        ? `${lastName.charAt(0).toLocaleUpperCase("pt-BR")}.`
        : "",
      avatarUrl: avatarUrlFor(row.created_by),
    },
  };
}

/** Remove o id da conta antes de enviar para fora (API pública). */
export function toFeedbackItem({
  authorId: _authorId,
  ...item
}: ProductFeedback): FeedbackItem {
  return item;
}

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produto não encontrado.");
    this.name = "ProductNotFoundError";
  }
}

export class AlreadyReviewedError extends Error {
  constructor() {
    super("Você já avaliou este produto.");
    this.name = "AlreadyReviewedError";
  }
}
