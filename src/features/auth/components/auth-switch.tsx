import Link from "next/link";

/** Link entre login e cadastro, abaixo do formulário. */
export function AuthSwitch({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="mt-6 flex flex-wrap items-center gap-x-1.5 text-[0.9375rem] text-muted-foreground">
      {prompt}
      <Link
        href={href}
        className="inline-flex min-h-11 items-center rounded-sm font-medium text-ink underline decoration-ink/40 underline-offset-4 outline-none transition-colors hover:decoration-ink focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        {label}
      </Link>
    </p>
  );
}
