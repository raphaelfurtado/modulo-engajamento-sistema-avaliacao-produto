import "server-only";
import { createCallerFactory, createTRPCRouter } from "@/server/trpc/init";
import { authRouter } from "@/server/trpc/routers/auth";

export const appRouter = createTRPCRouter({
  auth: authRouter,
});

export type AppRouter = typeof appRouter;

/** Executa procedures do tRPC diretamente no servidor (usado pelas rotas REST /api/v1). */
export const createCaller = createCallerFactory(appRouter);
