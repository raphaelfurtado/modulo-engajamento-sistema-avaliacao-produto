import { cn } from "@/lib/utils";

/** Nota máxima da Prova (D1: escala de 0 a 5). */
export const MAX_GRADE = 5;

const gradeFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

/** Formata uma nota em pt-BR: 4 → "4", 4.25 → "4,3". */
export function formatGrade(value: number): string {
  return gradeFormatter.format(Math.round(value * 10) / 10);
}

const sizes = {
  sm: { box: "h-11 w-12", text: "text-[1.75rem]" },
  md: { box: "h-16 w-20", text: "text-[2.75rem]" },
  lg: {
    box: "h-24 w-28 sm:h-32 sm:w-36",
    text: "text-[3.75rem] sm:text-[5rem]",
  },
} as const;

type GradeProps = {
  value: number;
  size?: keyof typeof sizes;
  /** Desenha o círculo de caneta em volta da nota. */
  circled?: boolean;
  /** Anima o traço do círculo uma vez (use só no elemento de destaque da tela). */
  animated?: boolean;
  className?: string;
};

/**
 * Nota "corrigida à mão" em caneta azul (Nanum Pen Script).
 * Caneta azul é reservada para notas, foco e links.
 */
export function Grade({
  value,
  size = "md",
  circled = false,
  animated = false,
  className,
}: GradeProps) {
  const label = formatGrade(value);
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center text-ink",
        sizes[size].box,
        className,
      )}
    >
      <span className="sr-only">
        Nota {label} de {MAX_GRADE}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "col-start-1 row-start-1 -rotate-6 font-hand leading-none",
          sizes[size].text,
        )}
      >
        {label}
      </span>
      {circled && (
        <svg
          aria-hidden="true"
          viewBox="0 0 120 100"
          fill="none"
          className="col-start-1 row-start-1 size-full"
        >
          {/* Círculo feito à mão: não fecha perfeitamente e passa do ponto inicial. */}
          <path
            pathLength={1}
            className={animated ? "ink-stroke" : undefined}
            d="M78 12C42 4 10 22 9 50c-1 28 30 44 60 41 30-3 46-24 42-48C107 19 84 7 54 13"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
