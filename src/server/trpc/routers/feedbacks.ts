import "server-only";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createFeedbackSchema } from "@/features/feedbacks/schema";
import { createFeedback } from "@/server/feedbacks/create";
import { getProductWithFeedbacks } from "@/server/feedbacks/get-product";
import {
  AlreadyReviewedError,
  ProductNotFoundError,
  toFeedbackItem,
} from "@/server/feedbacks/shared";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/trpc/init";

const productIdSchema = z.string().trim().min(1, "Informe o produto.");

function notFound(): never {
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "Produto não encontrado.",
  });
}

export const feedbacksRouter = createTRPCRouter({
  /** Avaliações públicas de um produto, mais recentes primeiro. */
  list: publicProcedure
    .input(z.object({ productId: productIdSchema }))
    .query(async ({ input }) => {
      const data = await getProductWithFeedbacks(input.productId);
      if (!data) notFound();
      return data.feedbacks.map(toFeedbackItem);
    }),

  /** Cria a avaliação da pessoa logada (uma por produto, D7). */
  create: protectedProcedure
    .input(createFeedbackSchema.extend({ productId: productIdSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await createFeedback({
          productId: input.productId,
          accountId: ctx.user.id,
          score: input.score,
          comment: input.comment,
        });
      } catch (error) {
        if (error instanceof ProductNotFoundError) notFound();
        if (error instanceof AlreadyReviewedError) {
          throw new TRPCError({ code: "CONFLICT", message: error.message });
        }
        throw error;
      }
    }),
});
