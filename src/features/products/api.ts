import { ApiError, NETWORK_ERROR_MESSAGE, toApiError } from "@/lib/api/errors";
import type { ProductsPage } from "./schema";

export { ApiError };

/** Busca uma página de produtos. Sem `cursor`, traz a primeira. */
export async function fetchProductsPage({
  cursor,
  signal,
}: {
  cursor?: string | null;
  signal?: AbortSignal;
}): Promise<ProductsPage> {
  const params = new URLSearchParams();
  if (cursor) params.set("cursor", cursor);
  const query = params.size ? `?${params}` : "";

  let response: Response;
  try {
    response = await fetch(`/api/v1/products${query}`, { signal });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new ApiError(0, NETWORK_ERROR_MESSAGE);
  }

  if (response.ok) return response.json();

  throw await toApiError(
    response,
    "Não foi possível carregar os produtos. Tente de novo.",
  );
}
