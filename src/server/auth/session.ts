import "server-only";

/**
 * Contrato de sessão compartilhado (plans/_orquestracao.md).
 * As ASSINATURAS abaixo são fixas: Home e Feedback dependem delas.
 * O agente de Sign-in substitui as implementações (stubs) e pode adicionar
 * funções novas neste arquivo (ex.: createSession, deleteSession).
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

/** URL do avatar Dicebear para uma conta (seed = id, nunca o e-mail). */
export function avatarUrlFor(accountId: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(accountId)}`;
}

/**
 * Pessoa logada na requisição atual, ou `null`.
 * Lê cookies: em páginas, chame dentro de um <Suspense> (cacheComponents).
 *
 * STUB: sempre retorna null até o agente de Sign-in implementar.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return null;
}
