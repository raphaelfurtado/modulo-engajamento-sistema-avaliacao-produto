import type { SignInInput } from "@/features/auth/sign-in/schema";
import { createSession } from "@/server/auth/session";
import { jsonError, trpcErrorToResponse } from "@/server/http";
import { createCaller } from "@/server/trpc/root";

/** POST /api/v1/sign-in — confere e-mail e senha e cria a sessão em cookie. */
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
    const result = await caller.auth.signIn(body as SignInInput);
    await createSession(result.user.id);
    return Response.json(result, { status: 200 });
  } catch (error) {
    return trpcErrorToResponse(error);
  }
}
