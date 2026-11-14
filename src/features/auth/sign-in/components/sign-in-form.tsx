"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/features/auth/components/password-input";
import { ApiError } from "../api";
import {
  type SignInData,
  type SignInInput,
  safeNextPath,
  signInSchema,
} from "../schema";
import { useSignIn } from "../use-sign-in";

const defaultValues: SignInInput = { email: "", password: "" };

// Mesmos campos do cadastro: 44px de altura (alvo de toque) sobre papel branco.
const inputClass =
  "h-11 rounded-md bg-card px-3.5 text-base md:text-base dark:bg-card";
const labelClass = "text-[0.9375rem] font-medium";

export function SignInForm() {
  const router = useRouter();
  const signIn = useSignIn();

  const form = useForm<SignInInput, unknown, SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues,
    mode: "onTouched",
  });

  function onSubmit(data: SignInData) {
    signIn.mutate(data, {
      onSuccess: () => {
        // Lido só no envio: a página continua estática (sem useSearchParams).
        const next = new URLSearchParams(window.location.search).get("next");
        router.replace(safeNextPath(next));
        // Refaz os Server Components para o cabeçalho mostrar a conta.
        router.refresh();
      },
      onError: (error) => {
        if (!(error instanceof ApiError)) return;
        if (error.status === 401) {
          // Credenciais erradas: limpa só a senha e devolve o foco a ela.
          form.resetField("password");
          form.setFocus("password");
          return;
        }
        // Reflete erros de campo vindos da API (400 com detalhes).
        for (const [name, messages] of Object.entries(error.fields ?? {})) {
          if (messages?.[0] && name in defaultValues) {
            form.setError(name as FieldPath<SignInInput>, {
              message: messages[0],
            });
          }
        }
      },
    });
  }

  // Após o sucesso, mantém o estado de envio até a navegação terminar.
  const isPending = signIn.isPending || signIn.isSuccess;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        {signIn.isError && (
          <Alert
            variant="destructive"
            className="rounded-md border-destructive/40 bg-destructive/[0.06] px-3.5 py-3"
          >
            <CircleAlertIcon />
            <AlertTitle>Não foi possível entrar</AlertTitle>
            <AlertDescription>{signIn.error.message}</AlertDescription>
          </Alert>
        )}

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email" className={labelClass}>
                E-mail
              </FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
                className={inputClass}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password" className={labelClass}>
                Senha
              </FieldLabel>
              <PasswordInput
                {...field}
                id="password"
                autoComplete="current-password"
                aria-invalid={fieldState.invalid}
                disabled={isPending}
                className={inputClass}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="mt-2 h-12 w-full rounded-md text-base font-semibold"
        >
          {isPending && <Spinner aria-hidden="true" />}
          {isPending ? "Entrando…" : "Entrar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
