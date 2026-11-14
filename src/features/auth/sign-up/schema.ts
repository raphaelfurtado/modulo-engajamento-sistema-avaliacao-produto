import { z } from "zod";

/** Schema compartilhado entre o formulário (cliente) e a API (servidor). */
export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "Informe seu primeiro nome.")
      .max(80, "Use no máximo 80 caracteres."),
    lastName: z
      .string()
      .trim()
      .min(1, "Informe seu sobrenome.")
      .max(120, "Use no máximo 120 caracteres."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Informe seu e-mail.")
      .pipe(z.email("Informe um e-mail válido.")),
    password: z
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres.")
      // bcrypt ignora tudo além de 72 bytes; acentos/emojis ocupam mais de 1 byte.
      .refine((value) => new TextEncoder().encode(value).length <= 72, {
        message: "A senha deve ter no máximo 72 caracteres.",
      }),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpData = z.output<typeof signUpSchema>;

/** Dados públicos retornados após a criação da conta (sem senha/salt). */
export type SignUpResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

/** Formato de erro retornado pela API. */
export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[] | undefined>;
  };
};
