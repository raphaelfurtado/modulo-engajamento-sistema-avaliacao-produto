import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import {
  type ListProductsData,
  PRODUCTS_PAGE_SIZE,
  type ProductsPage,
} from "@/features/products/schema";
import { getSupabase } from "@/server/db/supabase";
import { decodeCursor, encodeCursor } from "./cursor";

/** Tag do cache da listagem. O POST de produtos a revalida. */
export const PRODUCTS_CACHE_TAG = "products";

/**
 * Lista produtos com paginação por cursor (keyset) em (created_at desc, id desc).
 * Busca `limit + 1` linhas para saber se existe uma próxima página.
 * Lança `InvalidCursorError` se o cursor não for válido.
 */
export async function listProducts({
  cursor,
  limit,
}: ListProductsData): Promise<ProductsPage> {
  let query = getSupabase()
    .from("products")
    .select("id, name, description, image_url, created_at")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    const after = decodeCursor(cursor);
    // Valores entre aspas: o timestamp tem ":" e ".", reservados no filtro do PostgREST.
    query = query.or(
      `created_at.lt."${after.createdAt}",and(created_at.eq."${after.createdAt}",id.lt."${after.id}")`,
    );
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Falha ao listar produtos: ${error.message}`, {
      cause: error,
    });
  }

  const hasMore = data.length > limit;
  const rows = hasMore ? data.slice(0, limit) : data;
  const last = rows.at(-1);

  return {
    items: rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      imageUrl: row.image_url,
    })),
    nextCursor:
      hasMore && last
        ? encodeCursor({ createdAt: last.created_at, id: last.id })
        : null,
  };
}

/**
 * Primeira página da home, em cache. Fica no shell estático da página e é
 * invalidada pelo POST /api/v1/products (`revalidateTag('products', 'max')`).
 */
export async function getFirstProductsPage(): Promise<ProductsPage> {
  "use cache";
  cacheTag(PRODUCTS_CACHE_TAG);
  cacheLife("minutes");
  return listProducts({ limit: PRODUCTS_PAGE_SIZE });
}
