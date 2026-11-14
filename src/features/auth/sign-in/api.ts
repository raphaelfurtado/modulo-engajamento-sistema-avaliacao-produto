import { ApiError, NETWORK_ERROR_MESSAGE, toApiError } from "@/lib/api/errors";
import type { SignInInput, SignInResponse } from "./schema";

export { ApiError };

export async function signInRequest(
  input: SignInInput,
): Promise<SignInResponse> {
  let response: Response;
  try {
    response = await fetch("/api/v1/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError(0, NETWORK_ERROR_MESSAGE);
  }

  if (response.ok) return response.json();

  throw await toApiError(response, "Não foi possível entrar. Tente novamente.");
}

/** Encerra a sessão (D6). */
export async function signOutRequest(): Promise<void> {
  let response: Response;
  try {
    response = await fetch("/api/v1/sign-out", { method: "POST" });
  } catch {
    throw new ApiError(0, NETWORK_ERROR_MESSAGE);
  }

  if (!response.ok) {
    throw await toApiError(response, "Não foi possível sair. Tente novamente.");
  }
}
