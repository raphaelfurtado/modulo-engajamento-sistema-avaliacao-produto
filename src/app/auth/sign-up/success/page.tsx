import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Conta criada",
};

export default function SignUpSuccessPage() {
  return (
    <section className="w-full max-w-[26rem]">
      <svg
        aria-hidden="true"
        viewBox="0 0 80 64"
        fill="none"
        className="mb-6 h-16 w-20 text-primary"
      >
        <path
          d="M6 34c6 4 13 10 20 20C38 32 55 14 74 6"
          stroke="currentColor"
          strokeWidth={6}
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
      <h1 className="font-wide text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
        Conta criada
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Tudo certo com o seu cadastro. Quando usar um produto, volte aqui e dê a
        sua nota de 0 a 5.
      </p>
      <Link
        href="/auth/sign-in"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-8 h-12 w-full rounded-md text-base font-semibold",
        )}
      >
        Entrar na sua conta
      </Link>
    </section>
  );
}
