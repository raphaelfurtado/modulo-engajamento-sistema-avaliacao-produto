import "server-only";
import { initTRPC } from "@trpc/server";
import { ZodError, z } from "zod";

export type TRPCContext = {
  headers: Headers;
};

export function createTRPCContext(opts: { headers: Headers }): TRPCContext {
  return { headers: opts.headers };
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
