import { SiteHeader } from "@/components/layout/site-header";

/**
 * Layout base da plataforma (Fase 0). Dono do visual: agente de Sign-in.
 * Páginas: / (Home) e /products/[id] (Feedback).
 */
export default function PlatformLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pt-10 pb-16 sm:px-8 lg:px-12">
        {children}
      </main>
    </div>
  );
}
