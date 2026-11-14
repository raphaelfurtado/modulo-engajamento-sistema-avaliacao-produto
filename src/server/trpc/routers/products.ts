import "server-only";
import { TRPCError } from "@trpc/server";
import {
  createProductSchema,
  listProductsSchema,
} from "@/features/products/schema";
import { createProduct } from "@/server/products/create";
import { InvalidCursorError } from "@/server/products/cursor";
import { listProducts } from "@/server/products/list";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/init";

export const productsRouter = createTRPCRouter({
  list: publicProcedure.input(listProductsSchema).query(async ({ input }) => {
    try {
      return await listProducts(input);
    } catch (error) {
      if (error instanceof InvalidCursorError) {
        throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      }
      throw error;
    }
  }),

  /**
   * Sem checagem de admin aqui: a rota REST confere o `x-admin-key` antes (D4).
   * Não exponha esta procedure por HTTP sem proteção equivalente.
   */
  create: publicProcedure
    .input(createProductSchema)
    .mutation(({ input }) => createProduct(input)),
});
