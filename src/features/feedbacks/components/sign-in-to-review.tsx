import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actionClass = "h-11 rounded-md px-5 text-base font-semibold";

/** Bloco para quem não está logado: ler é livre, avaliar exige conta. */
export function SignInToReview({ productId }: { productId: string }) {
  // D9: o login volta para esta página.
  const next = encodeURIComponent(`/products/${productId}`);

  return (
    <div className="rounded-lg border bg-card p-5 sm:p-8">
      <h2
        id="nova-avaliacao"
        className="text-xl font-bold tracking-[-0.015em] sm:text-2xl"
      >
        Entre para avaliar este produto
      </h2>
      <p className="mt-2 max-w-[60ch] text-muted-foreground">
        Qualquer pessoa pode ler as avaliações. Para dar a sua nota, entre na
        sua conta ou crie uma; leva menos de um minuto.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/auth/sign-in?next=${next}`}
          className={cn(buttonVariants({ size: "lg" }), actionClass)}
        >
          Entrar
        </Link>
        <Link
          href="/auth/sign-up"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            actionClass,
          )}
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
