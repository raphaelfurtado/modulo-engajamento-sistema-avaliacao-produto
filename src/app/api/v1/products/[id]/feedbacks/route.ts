import { getCurrentUser } from "@/server/auth/session";
import { jsonError, trpcErrorToResponse } from "@/server/http";
import { createCaller } from "@/server/trpc/root";

type Context = RouteContext<"/api/v1/products/[id]/feedbacks">;

/** GET /api/v1/products/:id/feedbacks — avaliações públicas (200 / 404). */
export async function GET(request: Request, ctx: Context) {
  const { id } = await ctx.params;
  try {
    const caller = createCaller({ headers: request.headers });
    const feedbacks = await caller.feedbacks.list({ productId: id });
    return Response.json(feedbacks);
  } catch (error) {
    return trpcErrorToResponse(error);
  }
}

/** POST /api/v1/products/:id/feedbacks — cria uma avaliação (201 / 400 / 401 / 404 / 409). */
export async function POST(request: Request, ctx: Context) {
  const { id } = await ctx.params;

  const user = await getCurrentUser();
  if (!user) {
    return jsonError(401, "UNAUTHORIZED", "Entre na sua conta para avaliar.");
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

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return jsonError(400, "BAD_REQUEST", "Dados inválidos.");
  }

  try {
    const caller = createCaller({ headers: request.headers, user });
    // O produto vem da URL; nota e comentário são validados pelo schema zod
    // da procedure (gera 400 com erros de campo se inválidos).
    const feedback = await caller.feedbacks.create({
      ...(body as Record<string, unknown>),
      productId: id,
    } as Parameters<typeof caller.feedbacks.create>[0]);
    return Response.json(feedback, { status: 201 });
  } catch (error) {
    return trpcErrorToResponse(error);
  }
}
