import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import type {
  CreateProductInput,
  ListProductsInput,
} from "@/features/products/schema";
import { jsonError, trpcErrorToResponse } from "@/server/http";
import { isValidAdminKey } from "@/server/products/admin-key";
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

/** POST /api/v1/products — cadastra um produto. Exige o header `x-admin-key` (D4). */
export async function POST(request: NextRequest) {
  let authorized: boolean;
  try {
    authorized = isValidAdminKey(request.headers.get("x-admin-key"));
  } catch (error) {
    // ADMIN_API_KEY ausente no servidor.
    console.error(error);
    return jsonError(
      500,
      "INTERNAL_SERVER_ERROR",
      "Cadastro de produtos indisponível no momento.",
    );
  }
  if (!authorized) {
    return jsonError(401, "UNAUTHORIZED", "Chave de administrador inválida.");
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
