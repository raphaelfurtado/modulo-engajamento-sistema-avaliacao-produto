import type { Metadata } from "next";
import { AuthSwitch } from "@/features/auth/components/auth-switch";
import { GradedReviewSample } from "@/features/auth/components/graded-review-sample";
import { SignUpForm } from "@/features/auth/sign-up/components/sign-up-form";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function SignUpPage() {
  return (
    <div className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
      <section className="w-full max-w-[26rem]">
        <header className="mb-8 space-y-3">
          <h1 className="font-wide text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
            Crie sua conta
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Para avaliar os produtos que você usa e ler o que diz quem já usou.
          </p>
        </header>
        <SignUpForm />
        <AuthSwitch
          prompt="Já tem conta?"
          href="/auth/sign-in"
          label="Entrar"
        />
      </section>

      <GradedReviewSample />
    </div>
  );
}
