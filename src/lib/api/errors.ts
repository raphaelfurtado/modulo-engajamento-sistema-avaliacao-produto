/** Formato de erro retornado por todas as rotas /api/v1. */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[] | undefined>;
  };
};

/** Erro lançado pelos clientes HTTP do front-end. `status` 0 = sem conexão. */
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

export const NETWORK_ERROR_MESSAGE =
  "Sem conexão com o servidor. Verifique sua internet.";

/** Converte uma resposta de erro da API em `ApiError`. */
export async function toApiError(
  response: Response,
  fallbackMessage: string,
): Promise<ApiError> {
  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
  return new ApiError(
    response.status,
    body?.error?.message ?? fallbackMessage,
    body?.error?.fields,
  );
}
