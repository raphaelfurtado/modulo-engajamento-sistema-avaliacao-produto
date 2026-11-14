import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductGridSkeleton } from "@/features/products/components/product-card-skeleton";
import { ProductFeed } from "@/features/products/components/product-feed";
import { getFirstProductsPage } from "@/server/products/list";

export const metadata: Metadata = {
  title: { absolute: "Prova | Produtos avaliados por quem usou" },
  description:
    "Veja os produtos avaliados na Prova e leia o que diz quem comprou e usou.",
};

/** Home: lista pública de produtos com scroll infinito. */
export default function HomePage() {
  return (
    <>
      <header className="mb-10 max-w-[38rem] space-y-3 sm:mb-12">
        <h1 className="text-[2rem] leading-[1.1] font-bold tracking-[-0.025em] text-balance sm:text-[2.5rem]">
          Produtos avaliados por quem usou
        </h1>
        <p className="text-lg leading-relaxed text-pretty text-muted-foreground">
          Abra um produto para ver a nota e ler o que diz quem comprou e testou
          no dia a dia.
        </p>
      </header>

      <Suspense fallback={<ProductGridSkeleton />}>
        <FirstPage />
      </Suspense>
    </>
  );
}

/** Primeira página vinda do cache (`'use cache'` + tag `products`). */
async function FirstPage() {
  const page = await getFirstProductsPage();
  return <ProductFeed initialPage={page} />;
}
