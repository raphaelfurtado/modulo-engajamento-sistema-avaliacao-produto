import { cn } from "@/lib/utils";

/** Nota máxima da Prova (D1: escala de 0 a 5). */
export const MAX_GRADE = 5;

/** As notas possíveis, de 0 a 5. */
export const GRADES = Array.from(
  { length: MAX_GRADE + 1 },
  (_, grade) => grade,
);

const gradeFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const averageFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** Formata uma nota em pt-BR: 4 → "4", 4.25 → "4,3". */
export function formatGrade(value: number): string {
  return gradeFormatter.format(Math.round(value * 10) / 10);
}

/** Formata uma média sempre com uma casa: 4 → "4,0", 4.25 → "4,3". */
export function formatAverage(value: number): string {
  return averageFormatter.format(Math.round(value * 10) / 10);
}

/**
 * Fundo e cor do número de cada nota na escala (índice = nota).
 * Número branco no 0 e no 5, tinta escura do 1 ao 4 (contraste ≥ 4,5:1).
 * Classes escritas por extenso para o Tailwind encontrá-las.
 */
export const GRADE_COLORS = [
  "bg-nota-0 text-white",
  "bg-nota-1 text-[#17201b]",
  "bg-nota-2 text-[#17201b]",
  "bg-nota-3 text-[#17201b]",
  "bg-nota-4 text-[#17201b]",
  "bg-nota-5 text-white",
] as const;

/** Cor da nota (médias usam a nota inteira mais próxima). */
export function gradeColor(value: number): string {
  const index = Math.min(MAX_GRADE, Math.max(0, Math.round(value)));
  return GRADE_COLORS[index];
}

const sizes = {
  sm: "size-9 text-base",
  md: "size-12 text-xl",
  lg: "h-16 min-w-16 px-2 text-[1.75rem] sm:h-20 sm:min-w-20 sm:text-[2.25rem]",
} as const;

type GradeProps = {
  value: number;
  size?: keyof typeof sizes;
  /** Média: sempre com uma casa decimal ("4,0"). */
  average?: boolean;
  className?: string;
};

/**
 * Selo de nota: o número em Archivo expandida sobre a cor da escala.
 * A cor nunca aparece sozinha: o número está sempre dentro.
 */
export function Grade({
  value,
  size = "md",
  average = false,
  className,
}: GradeProps) {
  const label = average ? formatAverage(value) : formatGrade(value);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm font-wide leading-none font-extrabold tabular-nums",
        gradeColor(value),
        sizes[size],
        className,
      )}
    >
      <span className="sr-only">Nota </span>
      {label}
      <span className="sr-only"> de {MAX_GRADE}</span>
    </span>
  );
}
