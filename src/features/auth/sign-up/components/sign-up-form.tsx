"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { PasswordInput } from "@/features/auth/components/password-input";
import { ApiError } from "../api";
import { type SignUpData, type SignUpInput, signUpSchema } from "../schema";
import { useSignUp } from "../use-sign-up";

const defaultValues: SignUpInput = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

// Campos com 44px de altura (alvo de toque) sobre papel branco.
const inputClass =
  "h-11 rounded-md bg-card px-3.5 text-base md:text-base dark:bg-card";
const labelClass = "text-[0.9375rem] font-medium";

export function SignUpForm() {
  const router = useRouter();
  const signUp = useSignUp();

  const form = useForm<SignUpInput, unknown, SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
    mode: "onTouched",
  });

  function onSubmit(data: SignUpData) {
    signUp.mutate(data, {
      onSuccess: () => {
        form.reset(defaultValues);
        signUp.reset();
        router.push("/auth/sign-up/success");
      },
      onError: (error) => {
        // Reflete erros de campo vindos da API (ex.: 400 com detalhes).
        if (error instanceof ApiError && error.fields) {
          for (const [name, messages] of Object.entries(error.fields)) {
            if (messages?.[0] && name in defaultValues) {
              form.setError(name as FieldPath<SignUpInput>, {
                message: messages[0],
              });
            }
          }
        }
      },
    });
  }

  const isPending = signUp.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        {signUp.isError && (
          <Alert
            variant="destructive"
            className="rounded-md border-destructive/40 bg-destructive/[0.06] px-3.5 py-3"
          >
            <CircleAlertIcon />
            <AlertTitle>Não foi possível criar sua conta</AlertTitle>
            <AlertDescription>{signUp.error.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-4">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="firstName" className={labelClass}>
                  Primeiro nome
                </FieldLabel>
                <Input
                  {...field}
                  id="firstName"
                  autoComplete="given-name"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                  className={inputClass}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lastName" className={labelClass}>
                  Sobrenome
                </FieldLabel>
                <Input
                  {...field}
                  id="lastName"
                  autoComplete="family-name"
                  aria-invalid={fieldState.invalid}
                  disabled={isPending}
                  className={inputClass}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </div>

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
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                aria-describedby="password-hint"
                disabled={isPending}
                className={inputClass}
              />
              {fieldState.error ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription id="password-hint">
                  Use de 8 a 72 caracteres.
                </FieldDescription>
              )}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword" className={labelClass}>
                Confirme a senha
              </FieldLabel>
              <PasswordInput
                {...field}
                id="confirmPassword"
                autoComplete="new-password"
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
          {isPending && <Spinner />}
          {isPending ? "Criando conta…" : "Criar conta"}
        </Button>
      </FieldGroup>
    </form>
  );
}
