import "server-only";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { ZodError, z } from "zod";
import type { ApiErrorBody } from "@/features/auth/sign-up/schema";

export function jsonError(
  status: number,
  code: string,
  message: string,
  fields?: ApiErrorBody["error"]["fields"],
) {
  return Response.json(
    { error: { code, message, fields } } satisfies ApiErrorBody,
    { status },
  );
}

/** Converte erros do tRPC em respostas HTTP REST consistentes. */
export function trpcErrorToResponse(error: unknown): Response {
  if (error instanceof TRPCError) {
    if (error.cause instanceof ZodError) {
      return jsonError(
        400,
        "BAD_REQUEST",
        "Dados inválidos.",
        z.flattenError(error.cause).fieldErrors,
      );
    }

    const status = getHTTPStatusCodeFromError(error);
    if (status < 500) return jsonError(status, error.code, error.message);
  }

  console.error(error);
  return jsonError(
    500,
    "INTERNAL_SERVER_ERROR",
    "Não foi possível concluir a operação. Tente novamente.",
  );
}
