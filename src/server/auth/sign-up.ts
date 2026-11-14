import "server-only";
import { nanoid } from "nanoid";
import type {
  SignUpData,
  SignUpResponse,
} from "@/features/auth/sign-up/schema";
import { hashPassword } from "@/server/auth/password";
import { getSupabase } from "@/server/db/supabase";

const UNIQUE_VIOLATION = "23505";

export class EmailAlreadyInUseError extends Error {
  constructor() {
    super("Este e-mail já está cadastrado.");
    this.name = "EmailAlreadyInUseError";
  }
}

/** Cria a conta no banco. Recebe dados já validados pelo schema. */
export async function createAccount(data: SignUpData): Promise<SignUpResponse> {
  const { hash, salt } = await hashPassword(data.password);

  const { data: account, error } = await getSupabase()
    .from("accounts")
    .insert({
      id: nanoid(),
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: hash,
      salt,
    })
    .select("id, first_name, last_name, email, created_at")
    .single();

  if (error) {
    if (error.code === UNIQUE_VIOLATION) throw new EmailAlreadyInUseError();
    throw new Error(`Falha ao criar conta: ${error.message}`, { cause: error });
  }

  return {
    id: account.id,
    firstName: account.first_name,
    lastName: account.last_name,
    email: account.email,
    createdAt: account.created_at,
  };
}
