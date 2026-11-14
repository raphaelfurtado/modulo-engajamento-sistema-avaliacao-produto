"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProductsPage } from "./api";
import type { ProductsPage } from "./schema";

export const productsQueryKey = ["products", "list"] as const;

/**
 * Listagem infinita. A primeira página vem do servidor (`initialPage`),
 * as seguintes de GET /api/v1/products?cursor=.
 */
export function useProducts(initialPage: ProductsPage) {
  return useInfiniteQuery({
    queryKey: productsQueryKey,
    queryFn: ({ pageParam, signal }) =>
      fetchProductsPage({ cursor: pageParam, signal }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: { pages: [initialPage], pageParams: [null] },
    // Evita refazer todas as páginas carregadas a cada troca de aba.
    staleTime: 5 * 60 * 1000,
  });
}
