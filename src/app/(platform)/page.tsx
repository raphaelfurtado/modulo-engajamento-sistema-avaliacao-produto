import type { Metadata } from "next";
import { Suspense } from "react";
import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { ProductGridSkeleton } from "@/features/products/components/product-card-skeleton";
import { ProductFeed } from "@/features/products/components/product-feed";
import { cn } from "@/lib/utils";
import { getFirstProductsPage } from "@/server/products/list";

export const metadata: Metadata = {
  title: { absolute: "Prova | Produtos avaliados por quem usou" },
  description:
    "Veja os produtos avaliados na Prova e leia o que diz quem comprou e usou.",
};

/** Home: lista pública de produtos com scroll infinito. */
export default function HomePage() {
  return (
    <div className={cn(PAGE_CONTAINER, "pt-10 pb-16 sm:pt-14")}>
      <header className="mb-10 max-w-[40rem] sm:mb-12">
        <h1 className="font-wide text-[2.25rem] leading-[1.02] font-extrabold tracking-[-0.035em] text-balance sm:text-[3.5rem]">
          Produtos avaliados por quem usou
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
          Cada produto tem uma etiqueta com a nota de 0 a 5 que as pessoas deram
          depois de usar. Abra um para ler o que disseram.
        </p>
      </header>

      <Suspense fallback={<ProductGridSkeleton />}>
        <FirstPage />
      </Suspense>
    </div>
  );
}

/** Primeira página vinda do cache (`'use cache'` + tag `products`). */
async function FirstPage() {
  const page = await getFirstProductsPage();
  return <ProductFeed initialPage={page} />;
}
