import { PAGE_CONTAINER } from "@/components/layout/page-container";
import { Wordmark } from "@/components/prova/wordmark";
import { cn } from "@/lib/utils";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b bg-card">
        <div className={cn(PAGE_CONTAINER, "flex h-16 items-center")}>
          <Wordmark />
        </div>
      </header>

      {/* Ancorado no topo: mensagens de erro não fazem o título "pular". */}
      <main
        className={cn(
          PAGE_CONTAINER,
          "flex flex-1 items-start pt-10 pb-16 lg:pt-20",
        )}
      >
        {children}
      </main>
    </div>
  );
}
