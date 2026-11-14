import "server-only";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError, z } from "zod";
import type { SessionUser } from "@/server/auth/session";

export type TRPCContext = {
  headers: Headers;
  /** Pessoa logada; a rota REST resolve com getCurrentUser() e passa aqui. */
  user?: SessionUser | null;
};

export function createTRPCContext(opts: TRPCContext): TRPCContext {
  return { headers: opts.headers, user: opts.user ?? null };
}

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        fieldErrors:
          error.cause instanceof ZodError
            ? z.flattenError(error.cause).fieldErrors
            : undefined,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const publicProcedure = t.procedure;

/** Exige pessoa logada no contexto; caso contrário, 401. */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Entre na sua conta para continuar.",
    });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
