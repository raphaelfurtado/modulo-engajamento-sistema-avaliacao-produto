import Link from "next/link";
import { getCurrentUser } from "@/server/auth/session";

/** Área da conta no cabeçalho (Fase 0: stub). Dono: agente de Sign-in. */
export async function HeaderAccount() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/auth/sign-in" className="font-medium">
        Entrar
      </Link>
    );
  }
  return <span>{user.firstName}</span>;
}
