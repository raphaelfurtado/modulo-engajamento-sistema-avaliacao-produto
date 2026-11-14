"use client";

import { Button } from "@/components/ui/button";

/** Falha ao carregar uma página da plataforma (ex.: banco indisponível). */
export default function PlatformError({ retry }: { retry: () => void }) {
  return (
    <section className="max-w-[34rem]">
      <h1 className="text-[2rem] leading-[1.1] font-bold tracking-[-0.025em] sm:text-[2.5rem]">
        Não conseguimos carregar esta página
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        O servidor não respondeu a tempo. Seus dados estão seguros; tente
        carregar de novo em alguns segundos.
      </p>
      <Button onClick={() => retry()} className="mt-6 h-12 px-5 text-base">
        Carregar de novo
      </Button>
    </section>
  );
}
