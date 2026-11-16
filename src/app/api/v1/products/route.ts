import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import type {
  CreateProductInput,
  ListProductsInput,
} from "@/features/products/schema";
import { jsonError, trpcErrorToResponse } from "@/server/http";
import {
  isValidProductsApiKey,
  PRODUCTS_API_KEY_HEADER,
} from "@/server/products/api-key";
import { PRODUCTS_CACHE_TAG } from "@/server/products/list";
import { createCaller } from "@/server/trpc/root";

/** GET /api/v1/products?cursor=&limit= — lista produtos (público, paginado). */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const input: ListProductsInput = {
    cursor: params.get("cursor") ?? undefined,
    limit: params.get("limit") ?? undefined,
  };

  try {
    const caller = createCaller({ headers: request.headers });
    // Cursor e limit são validados pela procedure (400 se inválidos).
    const page = await caller.products.list(input);
    return Response.json(page);
  } catch (error) {
    return trpcErrorToResponse(error);
  }
}

/**
 * POST /api/v1/products — cadastra um produto.
 * Exige o header `x-api-key` com a PRODUCTS_API_KEY (usado pelo n8n e pelo seed).
 * Body: `{ "name": string, "link": url http(s), "image": url https }`.
 */
export async function POST(request: NextRequest) {
  if (!isValidProductsApiKey(request.headers.get(PRODUCTS_API_KEY_HEADER))) {
    return jsonError(
      401,
      "UNAUTHORIZED",
      `Envie a chave de cadastro no header ${PRODUCTS_API_KEY_HEADER}.`,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(
      400,
      "BAD_REQUEST",
      "O corpo da requisição deve ser um JSON válido.",
    );
  }

  try {
    const caller = createCaller({ headers: request.headers });
    const product = await caller.products.create(body as CreateProductInput);
    // A home volta a buscar a primeira página na próxima visita.
    revalidateTag(PRODUCTS_CACHE_TAG, "max");
    return Response.json(product, { status: 201 });
  } catch (error) {
    return trpcErrorToResponse(error);
  }
}
