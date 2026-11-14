import "server-only";
import { createCallerFactory, createTRPCRouter } from "@/server/trpc/init";
import { authRouter } from "@/server/trpc/routers/auth";
import { feedbacksRouter } from "@/server/trpc/routers/feedbacks";
import { productsRouter } from "@/server/trpc/routers/products";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  products: productsRouter,
  feedbacks: feedbacksRouter,
});

export type AppRouter = typeof appRouter;

/** Executa procedures do tRPC diretamente no servidor (usado pelas rotas REST /api/v1). */
export const createCaller = createCallerFactory(appRouter);
