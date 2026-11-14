import { deleteSession } from "@/server/auth/session";

/** POST /api/v1/sign-out — apaga o cookie de sessão (D6). */
export async function POST() {
  await deleteSession();
  return new Response(null, { status: 204 });
}
