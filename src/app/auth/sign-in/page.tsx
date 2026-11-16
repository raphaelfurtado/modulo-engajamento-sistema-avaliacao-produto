import type { Metadata } from "next";
import { AuthSwitch } from "@/features/auth/components/auth-switch";
import { SignInForm } from "@/features/auth/sign-in/components/sign-in-form";

export const metadata: Metadata = {
  title: "Entrar",
};

// Sem painel ao lado: entrar precisa ser mais rápido que se cadastrar.
export default function SignInPage() {
  return (
    <section className="w-full max-w-[26rem]">
      <header className="mb-8 space-y-3">
        <h1 className="font-wide text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
          Entrar na Prova
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Suas notas e avaliações ficam na sua conta.
        </p>
      </header>
      <SignInForm />
      <AuthSwitch
        prompt="Ainda não tem conta?"
        href="/auth/sign-up"
        label="Criar conta"
      />
    </section>
  );
}
