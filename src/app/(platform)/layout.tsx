import { SiteHeader } from "@/components/layout/site-header";

/**
 * Layout base da plataforma. Cada página define a própria largura com
 * PAGE_CONTAINER, para que faixas de fundo possam ocupar a tela toda.
 * Páginas: / (Home) e /products/[id] (Feedback).
 */
export default function PlatformLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex w-full flex-1 flex-col">{children}</main>
    </div>
  );
}
