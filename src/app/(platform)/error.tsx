"use client";

import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Falha ao carregar uma página da plataforma (ex.: banco indisponível). */
export default function PlatformError({ retry }: { retry: () => void }) {
  return (
    <section className={cn(PAGE_CONTAINER, "pt-12 pb-16")}>
      <div className="max-w-[34rem]">
        <h1 className="font-wide text-[2rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[2.5rem]">
          Não conseguimos carregar esta página
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          O servidor não respondeu a tempo. Seus dados estão seguros; tente
          carregar de novo em alguns segundos.
        </p>
        <Button
          onClick={() => retry()}
          className="mt-7 h-12 px-5 text-base font-semibold"
        >
          Carregar de novo
        </Button>
      </div>
    </section>
  );
}
