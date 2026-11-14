import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conta criada",
};

export default function SignUpSuccessPage() {
  return (
    <section className="w-full max-w-[26rem]">
      {/* O "certo" do professor, desenhado em caneta azul. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 80 64"
        fill="none"
        className="mb-6 h-16 w-20 text-ink"
      >
        <path
          pathLength={1}
          className="ink-stroke"
          d="M6 34c6 4 13 10 20 20C38 32 55 14 74 6"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <h1 className="text-[2rem] leading-[1.1] font-bold tracking-[-0.025em] sm:text-[2.5rem]">
        Conta criada
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        Tudo certo com o seu cadastro. Quando usar um produto, volte aqui e dê a
        sua nota de 0 a 10.
      </p>
    </section>
  );
}
