import "server-only";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSupabase } from "@/server/db/supabase";
import { getSessionSecret } from "@/server/env";

/**
 * Contrato de sessão compartilhado (plans/_orquestracao.md).
 * As ASSINATURAS de SessionUser, SESSION_COOKIE, avatarUrlFor e getCurrentUser
 * são fixas: Home e Feedback dependem delas.
 *
 * Sessão (D5): JWT HS256 assinado com SESSION_SECRET, `sub` = id da conta,
 * em cookie httpOnly por 7 dias.
 */

/** Dados públicos da pessoa logada. Nunca inclua senha, salt ou token. */
export type SessionUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Avatar Dicebear com seed = id da conta. */
  avatarUrl: string;
};

/** Nome do cookie de sessão. */
export const SESSION_COOKIE = "prova_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias, em segundos
const JWT_ALGORITHM = "HS256";

/** URL do avatar Dicebear para uma conta (seed = id, nunca o e-mail). */
export function avatarUrlFor(accountId: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(accountId)}`;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

/**
 * Cria a sessão e grava o cookie.
 * Só funciona em Route Handlers e Server Functions (não durante o render).
 */
export async function createSession(accountId: string): Promise<void> {
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setSubject(accountId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey());

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Apaga o cookie de sessão. Só em Route Handlers e Server Functions. */
export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Id da conta no token, ou `null` se o token for inválido ou expirado. */
async function readAccountId(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: [JWT_ALGORITHM],
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/**
 * Pessoa logada na requisição atual, ou `null`.
 * Lê cookies: em páginas, chame dentro de um <Suspense> (cacheComponents).
 * `cache()` garante uma única leitura (cookie + banco) por requisição.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const accountId = await readAccountId(token);
  if (!accountId) return null;

  const { data: account, error } = await getSupabase()
    .from("accounts")
    .select("id, first_name, last_name, email")
    .eq("id", accountId)
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao ler a sessão: ${error.message}`, {
      cause: error,
    });
  }
  if (!account) return null;

  return {
    id: account.id,
    firstName: account.first_name,
    lastName: account.last_name,
    email: account.email,
    avatarUrl: avatarUrlFor(account.id),
  };
});
