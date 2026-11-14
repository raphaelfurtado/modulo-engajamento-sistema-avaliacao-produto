import { z } from "zod";

/**
 * Schema compartilhado entre o formulário (cliente) e a API (servidor).
 * Sem regra de tamanho mínimo da senha: isso revelaria a política de senha
 * e não ajuda quem só quer entrar.
 */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Informe seu e-mail.")
    .pipe(z.email("Informe um e-mail válido.")),
  password: z.string().min(1, "Informe sua senha."),
});

export type SignInInput = z.input<typeof signInSchema>;
export type SignInData = z.output<typeof signInSchema>;

/** Dados públicos da conta retornados após o login (sem senha/salt). */
export type SignInUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type SignInResponse = { user: SignInUser };

/** Mensagem única para e-mail inexistente e senha errada. */
export const INVALID_CREDENTIALS_MESSAGE = "E-mail ou senha inválidos.";

/**
 * Destino seguro após o login (D9): só caminhos internos.
 * Aceita "/produtos/1"; recusa "//evil.com", "/\\evil.com" e URLs absolutas.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/";
  // Navegadores tratam "\" como "/": "/\evil.com" viraria "//evil.com".
  if (next.includes("\\")) return "/";
  return next;
}
