import { cn } from "@/lib/utils";

/** "Raphael", "Furtado" → "RF"; "Ana", "S." → "AS". */
export function initialsOf(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.replace(/[^\p{L}]/gu, "").charAt(0);
  return `${first}${last}`.toLocaleUpperCase("pt-BR");
}

const tones = {
  /** Preto com letra branca (conta no cabeçalho). */
  solid: "bg-foreground text-background",
  /** Cinza com letra preta (autor de uma avaliação). */
  soft: "bg-muted text-foreground",
} as const;

type InitialsAvatarProps = {
  initials: string;
  tone?: keyof typeof tones;
  className?: string;
};

/** Círculo com as iniciais da pessoa. Decorativo: o nome aparece ao lado. */
export function InitialsAvatar({
  initials,
  tone = "soft",
  className,
}: InitialsAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        tones[tone],
        className,
      )}
    >
      {initials}
    </span>
  );
}
