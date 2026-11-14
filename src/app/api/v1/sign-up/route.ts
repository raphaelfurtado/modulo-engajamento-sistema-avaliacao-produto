import type { SignUpInput } from "@/features/auth/sign-up/schema";
import { jsonError, trpcErrorToResponse } from "@/server/http";
import { createCaller } from "@/server/trpc/root";

/** POST /api/v1/sign-up — cria uma nova conta. */
export async function POST(request: Request) {
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
    // O body é validado pelo schema zod da procedure (gera 400 se inválido).
    const account = await caller.auth.signUp(body as SignUpInput);
    return Response.json(account, { status: 201 });
  } catch (error) {
    return trpcErrorToResponse(error);
  }
}
