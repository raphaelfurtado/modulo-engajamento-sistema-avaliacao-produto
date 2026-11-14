import { z } from "zod";

/** Limites do comentário: iguais ao check da tabela products_feedbacks. */
export const COMMENT_MIN_LENGTH = 10;
export const COMMENT_MAX_LENGTH = 2000;

const SCORE_MESSAGE = "Escolha uma nota de 0 a 5.";

/** Schema compartilhado entre o formulário (cliente) e a API (servidor). */
export const createFeedbackSchema = z.object({
  score: z
    .number({ error: SCORE_MESSAGE })
    .int(SCORE_MESSAGE)
    .min(0, SCORE_MESSAGE)
    .max(5, SCORE_MESSAGE),
  comment: z
    .string({ error: "Escreva um comentário." })
    .trim()
    .min(COMMENT_MIN_LENGTH, "Conte um pouco mais: pelo menos 10 caracteres.")
    .max(COMMENT_MAX_LENGTH, "Use no máximo 2.000 caracteres."),
});

export type CreateFeedbackInput = z.input<typeof createFeedbackSchema>;
export type CreateFeedbackData = z.output<typeof createFeedbackSchema>;

/** Avaliação pública. O e-mail de quem avaliou nunca sai do servidor. */
export type FeedbackItem = {
  id: string;
  score: number;
  comment: string;
  /** ISO 8601. */
  createdAt: string;
  author: {
    firstName: string;
    /** Inicial do sobrenome com ponto, ex.: "S.". */
    lastInitial: string;
    avatarUrl: string;
  };
};

/** Id do elemento da avaliação na página (âncora e alvo de foco). */
export function feedbackElementId(feedbackId: string): string {
  return `avaliacao-${feedbackId}`;
}

/** "Ana S." */
export function authorDisplayName(author: FeedbackItem["author"]): string {
  return `${author.firstName} ${author.lastInitial}`.trim();
}
