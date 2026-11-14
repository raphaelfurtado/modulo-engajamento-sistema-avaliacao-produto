"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ApiError } from "../api";
import {
  COMMENT_MAX_LENGTH,
  type CreateFeedbackData,
  type CreateFeedbackInput,
  createFeedbackSchema,
} from "../schema";
import { useCreateFeedback } from "../use-create-feedback";
import { rememberPublishedFeedback } from "./published-feedback-focus";
import { ScorePicker } from "./score-picker";

const numberFormatter = new Intl.NumberFormat("pt-BR");
const MAX_LABEL = numberFormatter.format(COMMENT_MAX_LENGTH);

const FIELD_NAMES = ["score", "comment"] as const;

export function FeedbackForm({ productId }: { productId: string }) {
  const router = useRouter();
  const createFeedback = useCreateFeedback();
  const [isRefreshing, startTransition] = useTransition();

  const form = useForm<CreateFeedbackInput, unknown, CreateFeedbackData>({
    resolver: zodResolver(createFeedbackSchema),
    defaultValues: { comment: "" },
    mode: "onTouched",
  });

  function onSubmit(data: CreateFeedbackData) {
    createFeedback.mutate(
      { ...data, productId },
      {
        onSuccess: (feedback) => {
          // A página volta do servidor com a avaliação no topo da lista e este
          // bloco vira "Você já avaliou"; o foco vai para a avaliação publicada.
          rememberPublishedFeedback(feedback.id);
          startTransition(() => router.refresh());
        },
        onError: (error) => {
          if (error instanceof ApiError && error.fields) {
            for (const name of FIELD_NAMES) {
              const message = error.fields[name]?.[0];
              if (message) form.setError(name, { message });
            }
          }
        },
      },
    );
  }

  const isBusy = createFeedback.isPending || isRefreshing;
  const commentLength = form.watch("comment")?.length ?? 0;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-7">
        {createFeedback.isError && (
          <Alert
            variant="destructive"
            className="rounded-md border-destructive/40 bg-destructive/[0.06] px-3.5 py-3"
          >
            <CircleAlertIcon />
            <AlertTitle>Não foi possível publicar sua avaliação</AlertTitle>
            <AlertDescription>{createFeedback.error.message}</AlertDescription>
          </Alert>
        )}

        <Controller
          name="score"
          control={form.control}
          render={({ field, fieldState }) => (
            <div
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-2.5"
            >
              <span
                id="feedback-score-label"
                className="text-[0.9375rem] font-medium"
              >
                Sua nota
              </span>
              <ScorePicker
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                labelledBy="feedback-score-label"
                describedBy="feedback-score-hint"
                invalid={fieldState.invalid}
                disabled={isBusy}
              />
              {fieldState.error ? (
                <FieldError
                  id="feedback-score-hint"
                  errors={[fieldState.error]}
                />
              ) : (
                <FieldDescription id="feedback-score-hint">
                  De 0 (não recomendo) a 5 (recomendo sem ressalvas).
                </FieldDescription>
              )}
            </div>
          )}
        />

        <Controller
          name="comment"
          control={form.control}
          render={({ field, fieldState }) => (
            <div
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-2.5"
            >
              <FieldLabel
                htmlFor="feedback-comment"
                className="text-[0.9375rem] font-medium"
              >
                Comentário
              </FieldLabel>
              {/* Caderno pautado: cada linha de texto cai sobre uma pauta. */}
              <Textarea
                {...field}
                id="feedback-comment"
                rows={5}
                aria-invalid={fieldState.invalid}
                aria-describedby="feedback-comment-hint feedback-comment-count"
                disabled={isBusy}
                className="ruled-paper max-h-96 min-h-40 rounded-md bg-card bg-local px-3.5 py-0 text-base leading-8 md:text-base dark:bg-card"
              />
              <div className="flex items-start justify-between gap-4">
                {fieldState.error ? (
                  <FieldError
                    id="feedback-comment-hint"
                    errors={[fieldState.error]}
                  />
                ) : (
                  <FieldDescription id="feedback-comment-hint">
                    Há quanto tempo você usa? O que surpreendeu? O que
                    incomodou?
                  </FieldDescription>
                )}
                <p
                  id="feedback-comment-count"
                  className={cn(
                    "shrink-0 text-sm tabular-nums text-muted-foreground",
                    commentLength > COMMENT_MAX_LENGTH && "text-destructive",
                  )}
                >
                  {numberFormatter.format(commentLength)} / {MAX_LABEL}
                  <span className="sr-only"> caracteres</span>
                </p>
              </div>
            </div>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isBusy}
          className="h-12 w-full rounded-md text-base font-semibold sm:w-auto sm:self-start sm:px-6"
        >
          {isBusy && <Spinner aria-label="Publicando" />}
          {isBusy ? "Publicando…" : "Publicar avaliação"}
        </Button>
      </FieldGroup>
    </form>
  );
}
