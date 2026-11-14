import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getAdminApiKey } from "@/server/env";

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/**
 * Confere o header `x-admin-key` em tempo constante (D4).
 * Os dois lados passam por SHA-256 para terem o mesmo tamanho e o tempo
 * da comparação não revelar o tamanho da chave.
 */
export function isValidAdminKey(provided: string | null): boolean {
  if (!provided) return false;
  return timingSafeEqual(sha256(provided), sha256(getAdminApiKey()));
}
