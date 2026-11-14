import "server-only";
import type { SignInData, SignInUser } from "@/features/auth/sign-in/schema";
import { verifyPassword } from "@/server/auth/password";
import { getSupabase } from "@/server/db/supabase";

/**
 * Hash bcrypt (custo 12) de um valor aleatório descartado.
 * Comparar com ele quando o e-mail não existe deixa o tempo de resposta
 * parecido com o de uma senha errada, sem revelar quais e-mails têm conta.
 */
const DUMMY_HASH =
  "$2b$12$JwA7392jWM99rMvKgmqbg..7LMRUGlPBZIOfrgmhrTW1n0W52YAOq";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Credenciais inválidas.");
    this.name = "InvalidCredentialsError";
  }
}

/** Confere e-mail e senha de uma conta ativa. Recebe dados já validados. */
export async function authenticate(data: SignInData): Promise<SignInUser> {
  const { data: account, error } = await getSupabase()
    .from("accounts")
    .select("id, first_name, last_name, email, password")
    .eq("email", data.email)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar conta: ${error.message}`, {
      cause: error,
    });
  }

  const valid = await verifyPassword(
    data.password,
    account?.password ?? DUMMY_HASH,
  );
  if (!account || !valid) throw new InvalidCredentialsError();

  return {
    id: account.id,
    firstName: account.first_name,
    lastName: account.last_name,
    email: account.email,
  };
}
