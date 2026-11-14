import "server-only";
import bcrypt from "bcryptjs";

// Custo do bcrypt (2^12 iterações). Aumente conforme o hardware evoluir.
const SALT_ROUNDS = 12;

/** Gera um salt bcrypt e o hash da senha. */
export async function hashPassword(
  password: string,
): Promise<{ hash: string; salt: string }> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return { hash, salt };
}

/** Compara a senha com o hash salvo (o salt já está embutido no hash bcrypt). */
export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
