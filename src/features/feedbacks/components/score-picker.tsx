"use client";

import type { Ref } from "react";
import { MAX_GRADE } from "@/components/prova/grade";
import { cn } from "@/lib/utils";

const SCORES = Array.from({ length: MAX_GRADE + 1 }, (_, score) => score);

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
 * Linha de notas de 0 a 5, como o gabarito de uma prova.
 * É um grupo de radios nativo: setas do teclado trocam a nota e o leitor de
 * tela anuncia "Nota 4 de 5". A nota escolhida ganha um círculo de caneta azul.
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
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-invalid={invalid || undefined}
      aria-required="true"
      className="grid w-full max-w-sm grid-cols-6"
    >
      {SCORES.map((score) => {
        const checked = value === score;
        return (
          <label
            key={score}
            className={cn(
              "relative grid h-14 min-w-11 cursor-pointer place-items-center rounded-md transition-colors",
              "hover:bg-muted has-focus-visible:ring-3 has-focus-visible:ring-ring/50",
              "has-disabled:cursor-not-allowed has-disabled:opacity-60",
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
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "col-start-1 row-start-1 text-2xl font-semibold tabular-nums",
                checked ? "text-ink" : "text-muted-foreground",
              )}
            >
              {score}
            </span>
            {checked && (
              <svg
                aria-hidden="true"
                viewBox="0 0 120 100"
                fill="none"
                className="pointer-events-none col-start-1 row-start-1 size-full p-0.5 text-ink"
              >
                {/* Mesmo traço do círculo da nota corrigida, redesenhado a cada escolha. */}
                <path
                  pathLength={1}
                  className="ink-stroke"
                  // Resposta ao clique: sem o atraso da animação de entrada.
                  style={{ animationDelay: "0ms", animationDuration: "450ms" }}
                  d="M78 12C42 4 10 22 9 50c-1 28 30 44 60 41 30-3 46-24 42-48C107 19 84 7 54 13"
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </label>
        );
      })}
    </div>
  );
}
