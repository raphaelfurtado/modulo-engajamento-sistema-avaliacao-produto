import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReviewLayout } from "./review-layout";

const actionClass = "h-12 px-6 text-base font-semibold";

/** Bloco para quem não está logado: ler é livre, avaliar exige conta. */
export function SignInToReview({ productId }: { productId: string }) {
  // D9: o login volta para esta página.
  const next = encodeURIComponent(`/products/${productId}`);

  return (
    <ReviewLayout
      title="Usou este produto? Dê sua nota."
      description="Qualquer pessoa pode ler as avaliações. Para avaliar, entre na sua conta ou crie uma; leva menos de um minuto."
    >
      <div className="flex flex-col gap-3 sm:flex-row lg:pt-1">
        <Link
          href={`/auth/sign-in?next=${next}`}
          className={cn(buttonVariants(), actionClass)}
        >
          Entrar
        </Link>
        <Link
          href="/auth/sign-up"
          className={cn(buttonVariants({ variant: "outline" }), actionClass)}
        >
          Criar conta
        </Link>
      </div>
    </ReviewLayout>
  );
}
