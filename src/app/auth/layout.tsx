import Link from "next/link";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8 lg:px-12 lg:pt-10">
        <Link
          href="/"
          className="rounded-sm text-2xl font-extrabold tracking-[-0.03em] outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Prova
        </Link>
      </header>

      {/* Ancorado no topo: mensagens de erro não fazem o título "pular". */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-start px-5 pt-10 pb-16 sm:px-8 lg:px-12 lg:pt-20">
        {children}
      </main>
    </div>
  );
}
