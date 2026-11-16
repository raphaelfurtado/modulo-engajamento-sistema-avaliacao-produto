"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FeedbackItem as FeedbackItemData } from "../schema";
import { FeedbackItem } from "./feedback-item";

export type DatedFeedback = {
  feedback: FeedbackItemData;
  relativeDate: string;
  fullDate: string;
};

const SORTS = [
  { id: "recentes", label: "Mais recentes" },
  { id: "maior", label: "Maior nota" },
  { id: "menor", label: "Menor nota" },
] as const;

type SortId = (typeof SORTS)[number]["id"];

function sortFeedbacks(items: DatedFeedback[], sort: SortId): DatedFeedback[] {
  if (sort === "recentes") return items;
  const direction = sort === "maior" ? -1 : 1;
  // toSorted é estável: na mesma nota, a mais recente vem antes.
  return items.toSorted(
    (a, b) => direction * (a.feedback.score - b.feedback.score),
  );
}

/** Título, ordenação e a lista de avaliações. */
export function ReviewGrid({ items }: { items: DatedFeedback[] }) {
  const [sort, setSort] = useState<SortId>("recentes");
  const sorted = sortFeedbacks(items, sort);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2
          id="avaliacoes"
          className="flex items-baseline gap-3 font-wide text-2xl font-extrabold tracking-[-0.02em]"
        >
          Avaliações
          <span className="font-sans text-base font-normal text-muted-foreground">
            {items.length}
          </span>
        </h2>
        {items.length > 1 && (
          <fieldset className="inline-flex rounded-md border bg-card p-1">
            <legend className="sr-only">Ordenar avaliações</legend>
            {SORTS.map(({ id, label }) => {
              const active = sort === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSort(id)}
                  className={cn(
                    "h-10 rounded-sm px-3 text-sm outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-4",
                    active
                      ? "bg-foreground font-semibold text-background"
                      : "font-medium text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </fieldset>
        )}
      </div>

      <ol className="mt-5 divide-y rounded-lg border bg-card">
        {sorted.map(({ feedback, relativeDate, fullDate }) => (
          <li key={feedback.id}>
            <FeedbackItem
              feedback={feedback}
              relativeDate={relativeDate}
              fullDate={fullDate}
            />
          </li>
        ))}
      </ol>
    </>
  );
}
