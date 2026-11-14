import { ApiError, NETWORK_ERROR_MESSAGE, toApiError } from "@/lib/api/errors";
import type { CreateFeedbackData, FeedbackItem } from "./schema";

export { ApiError };

export async function createFeedbackRequest({
  productId,
  ...input
}: CreateFeedbackData & { productId: string }): Promise<FeedbackItem> {
  let response: Response;
  try {
    response = await fetch(
      `/api/v1/products/${encodeURIComponent(productId)}/feedbacks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      },
    );
  } catch {
    throw new ApiError(0, NETWORK_ERROR_MESSAGE);
  }

  if (response.status === 201) return response.json();

  throw await toApiError(
    response,
    "Não foi possível publicar sua avaliação. Tente novamente.",
  );
}
