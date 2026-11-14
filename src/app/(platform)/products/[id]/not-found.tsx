import Link from "next/link";

/** Id de produto inexistente. */
export default function ProductNotFound() {
  return (
    <section className="max-w-[34rem]">
      <h1 className="text-[2rem] leading-[1.1] font-bold tracking-[-0.025em] sm:text-[2.5rem]">
        Produto não encontrado
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        O link pode estar incompleto ou o produto saiu da Prova. Os outros
        produtos e suas avaliações continuam na página inicial.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center rounded-sm font-medium text-ink underline decoration-ink/40 underline-offset-4 outline-none hover:decoration-ink focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Ver todos os produtos
      </Link>
    </section>
  );
}
