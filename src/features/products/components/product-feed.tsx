"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { ProductsPage } from "../schema";
import { useProducts } from "../use-products";
import { ProductCard } from "./product-card";
import {
  PRODUCT_GRID_CLASS,
  ProductCardSkeleton,
} from "./product-card-skeleton";

const actionClass = "h-11 min-w-44 px-5 text-[0.9375rem]";

/** Lista com scroll infinito. Recebe a primeira página renderizada no servidor. */
export function ProductFeed({ initialPage }: { initialPage: ProductsPage }) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useProducts(initialPage);

  const pages = data.pages;
  const products = pages.flatMap((page, pageIndex) =>
    page.items.map((product) => ({ product, pageIndex })),
  );

  // Carrega a próxima página ~600px antes do fim. O observer é recriado a cada
  // carga: se o sentinela continuar visível, a próxima página vem em seguida.
  // Depois de um erro, só carrega de novo quando a pessoa pedir.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const canAutoLoad =
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError;
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !canAutoLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          fetchNextPage();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canAutoLoad, fetchNextPage]);

  if (products.length === 0) {
    return (
      <section className="max-w-md bg-muted p-6 sm:p-8">
        <h2 className="font-wide text-xl font-extrabold tracking-[-0.02em]">
          Ainda não há produtos avaliados.
        </h2>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
          Assim que um produto for cadastrado, ele aparece aqui para receber
          avaliações. Volte em breve.
        </p>
      </section>
    );
  }

  const lastPage = pages.at(-1);
  const announcement = isFetchingNextPage
    ? "Carregando mais produtos."
    : isFetchNextPageError
      ? "Não foi possível carregar mais produtos."
      : pages.length > 1 && lastPage
        ? `${lastPage.items.length} produtos carregados, ${products.length} no total.${hasNextPage ? "" : " Você viu todos os produtos."}`
        : "";

  return (
    <div>
      <ul className={PRODUCT_GRID_CLASS}>
        {products.map(({ product, pageIndex }, index) => (
          <li
            key={product.id}
            // Só as fichas novas entram com um fade curto (nada com movimento reduzido).
            className={
              pageIndex > 0
                ? "animate-in duration-300 fade-in-0 motion-reduce:animate-none"
                : undefined
            }
          >
            <ProductCard product={product} index={index} />
          </li>
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 3 }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: placeholders temporários
            <li key={`skeleton-${i}`}>
              <ProductCardSkeleton />
            </li>
          ))}
      </ul>

      <output className="sr-only" aria-live="polite">
        {announcement}
      </output>

      <div className="mt-12 flex flex-col items-start gap-4 border-t border-pauta pt-6 sm:flex-row sm:items-center sm:justify-between">
        {isFetchNextPageError ? (
          <>
            <div className="space-y-1">
              <p className="font-medium text-destructive">
                Não foi possível carregar mais produtos.
              </p>
              <p className="text-[0.9375rem] text-muted-foreground">
                {error?.message} Os produtos acima continuam aqui.
              </p>
            </div>
            <Button
              variant="outline"
              className={actionClass}
              onClick={() => fetchNextPage()}
            >
              Tentar de novo
            </Button>
          </>
        ) : hasNextPage ? (
          <>
            <p className="text-[0.9375rem] text-muted-foreground">
              {products.length} produtos até aqui.
            </p>
            <Button
              variant="outline"
              className={actionClass}
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? (
                <>
                  <Spinner aria-hidden="true" role="presentation" />
                  Carregando produtos
                </>
              ) : (
                "Carregar mais produtos"
              )}
            </Button>
          </>
        ) : (
          <p className="text-[0.9375rem] text-muted-foreground">
            Você viu todos os produtos.
          </p>
        )}
      </div>

      {/* Sentinela do scroll infinito. */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
    </div>
  );
}
