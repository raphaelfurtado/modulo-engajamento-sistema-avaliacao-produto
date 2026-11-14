import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/server/auth/session";
import { AccountMenu } from "./account-menu";

/** Área da conta no cabeçalho. Lê a sessão: renderize dentro de <Suspense>. */
export async function HeaderAccount() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-11 rounded-md px-5 text-[0.9375rem] font-semibold",
        )}
      >
        Entrar
      </Link>
    );
  }

  return (
    <AccountMenu
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }}
    />
  );
}

/** Reserva o espaço da conta enquanto a sessão é lida (evita o layout pular). */
export function HeaderAccountFallback() {
  return <div aria-hidden="true" className="h-11 w-11 sm:w-24" />;
}
