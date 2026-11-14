import type { ApiErrorBody, SignUpInput, SignUpResponse } from "./schema";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fields?: ApiErrorBody["error"]["fields"],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

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
    throw new ApiError(
      0,
      "Sem conexão com o servidor. Verifique sua internet.",
    );
  }

  if (response.status === 201) return response.json();

  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    response.status,
    body?.error.message ?? "Não foi possível criar sua conta. Tente novamente.",
    body?.error.fields,
  );
}
