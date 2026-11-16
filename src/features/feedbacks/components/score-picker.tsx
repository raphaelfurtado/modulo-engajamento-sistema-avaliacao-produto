"use client";

import type { Ref } from "react";
import { GRADE_COLORS, GRADES, MAX_GRADE } from "@/components/prova/grade";
import { cn } from "@/lib/utils";

/** Faixa de cor embaixo de cada casa ainda não escolhida. */
const STRIPES = [
  "after:bg-nota-0",
  "after:bg-nota-1",
  "after:bg-nota-2",
  "after:bg-nota-3",
  "after:bg-nota-4",
  "after:bg-nota-5",
] as const;

type ScorePickerProps = {
  name: string;
  value: number | undefined;
  onChange: (score: number) => void;
  onBlur?: () => void;
  /** Recebe o input que deve ganhar foco quando o campo tiver erro. */
  inputRef?: Ref<HTMLInputElement>;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
  disabled?: boolean;
};

/**
 * Seis casas de 0 a 5, cada uma com a cor da etiqueta numa faixa embaixo;
 * a escolhida fica toda pintada. É um grupo de radios nativo: setas do
 * teclado trocam a nota e o leitor de tela anuncia "Nota 4 de 5".
 */
export function ScorePicker({
  name,
  value,
  onChange,
  onBlur,
  inputRef,
  labelledBy,
  describedBy,
  invalid,
  disabled,
}: ScorePickerProps) {
  // O foco do erro vai para a nota marcada ou, sem nota, para a primeira.
  const focusTarget = value ?? 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        aria-required="true"
        className="grid grid-cols-6 gap-1.5"
      >
        {GRADES.map((score) => {
          const checked = value === score;
          return (
            <label
              key={score}
              className={cn(
                "relative flex h-14 cursor-pointer items-center justify-center overflow-hidden rounded-md border font-wide text-xl font-extrabold transition-colors",
                "has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
                "has-disabled:cursor-not-allowed has-disabled:opacity-60",
                checked
                  ? cn("border-transparent", GRADE_COLORS[score])
                  : cn(
                      "bg-card after:absolute after:inset-x-0 after:bottom-0 after:h-1.5 hover:bg-muted",
                      STRIPES[score],
                      invalid ? "border-destructive" : "border-input",
                    ),
              )}
            >
              <input
                ref={score === focusTarget ? inputRef : undefined}
                type="radio"
                name={name}
                value={score}
                checked={checked}
                onChange={() => onChange(score)}
                onBlur={onBlur}
                disabled={disabled}
                aria-label={`Nota ${score} de ${MAX_GRADE}`}
                className="sr-only"
              />
              <span aria-hidden="true">{score}</span>
            </label>
          );
        })}
      </div>
      <div
        aria-hidden="true"
        className="flex justify-between text-xs text-muted-foreground"
      >
        <span>Não recomendo</span>
        <span>Recomendo sem ressalvas</span>
      </div>
    </div>
  );
}
