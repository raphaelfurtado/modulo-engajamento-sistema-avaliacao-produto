import { ApiError, NETWORK_ERROR_MESSAGE, toApiError } from "@/lib/api/errors";
import type { SignUpInput, SignUpResponse } from "./schema";

export { ApiError };

export async function signUpRequest(
  input: SignUpInput,
): Promise<SignUpResponse> {
  let response: Response;
  try {
    response = await fetch("/api/v1/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError(0, NETWORK_ERROR_MESSAGE);
  }

  if (response.status === 201) return response.json();

  throw await toApiError(
    response,
    "Não foi possível criar sua conta. Tente novamente.",
  );
}
