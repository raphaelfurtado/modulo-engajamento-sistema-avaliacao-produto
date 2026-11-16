import Link from "next/link";
import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

/** Id de produto inexistente. */
export default function ProductNotFound() {
  return (
    <section className={cn(PAGE_CONTAINER, "pt-12 pb-16")}>
      <div className="max-w-[34rem]">
        <h1 className="font-wide text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
          Produto não encontrado
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          O link pode estar incompleto ou o produto saiu da Prova. Os outros
          produtos e suas avaliações continuam na página inicial.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-12 items-center rounded-md bg-primary px-5 font-semibold text-primary-foreground outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Ver todos os produtos
        </Link>
      </div>
    </section>
  );
}
