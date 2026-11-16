import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { getServerEnv } from "@/server/env";

/** Header com a chave exigida para cadastrar produtos. */
export const PRODUCTS_API_KEY_HEADER = "x-api-key";

const sha256 = (value: string) => createHash("sha256").update(value).digest();

/**
 * Confere a chave do cadastro de produtos em tempo constante. Os dois lados
 * passam por SHA-256 para terem o mesmo tamanho, e o tempo da comparação não
 * revela o tamanho da chave. Sem PRODUCTS_API_KEY configurada, recusa tudo.
 */
export function isValidProductsApiKey(provided: string | null): boolean {
  const expected = getServerEnv().PRODUCTS_API_KEY;
  if (!expected) {
    console.warn(
      "PRODUCTS_API_KEY não definida: o cadastro de produtos está fechado.",
    );
    return false;
  }
  if (!provided) return false;
  return timingSafeEqual(sha256(provided), sha256(expected));
}
