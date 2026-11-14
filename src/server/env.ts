import "server-only";
import { z } from "zod";

const envSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SECRET_KEY: z.string().min(1),
  // Opcionais no schema para não derrubar o sign-up enquanto não forem preenchidos.
  // Use os getters abaixo, que falham com mensagem clara quando faltam.
  SESSION_SECRET: z.string().min(32).optional(),
  ADMIN_API_KEY: z.string().min(16).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | undefined;

/** Lê e valida as variáveis de ambiente do servidor (lazy, para não quebrar o build). */
export function getServerEnv(): ServerEnv {
  if (!cached) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(
        `Variáveis de ambiente inválidas: ${z.prettifyError(parsed.error)}`,
      );
    }
    cached = parsed.data;
  }
  return cached;
}

/** Segredo para assinar o cookie de sessão (mínimo 32 caracteres). */
export function getSessionSecret(): string {
  const secret = getServerEnv().SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não definido no .env.local.");
  }
  return secret;
}

/** Chave exigida no header `x-admin-key` do POST /api/v1/products. */
export function getAdminApiKey(): string {
  const key = getServerEnv().ADMIN_API_KEY;
  if (!key) {
    throw new Error("ADMIN_API_KEY não definido no .env.local.");
  }
  return key;
}
