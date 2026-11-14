import "server-only";
import { TRPCError } from "@trpc/server";
import {
  INVALID_CREDENTIALS_MESSAGE,
  signInSchema,
} from "@/features/auth/sign-in/schema";
import { signUpSchema } from "@/features/auth/sign-up/schema";
import { authenticate, InvalidCredentialsError } from "@/server/auth/sign-in";
import { createAccount, EmailAlreadyInUseError } from "@/server/auth/sign-up";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/init";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure.input(signUpSchema).mutation(async ({ input }) => {
    try {
      return await createAccount(input);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        throw new TRPCError({ code: "CONFLICT", message: error.message });
      }
      throw error;
    }
  }),

  /** Confere as credenciais. O cookie é gravado pela rota REST. */
  signIn: publicProcedure.input(signInSchema).mutation(async ({ input }) => {
    try {
      return { user: await authenticate(input) };
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        // Mesma mensagem para e-mail inexistente e senha errada.
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: INVALID_CREDENTIALS_MESSAGE,
        });
      }
      throw error;
    }
  }),
});
