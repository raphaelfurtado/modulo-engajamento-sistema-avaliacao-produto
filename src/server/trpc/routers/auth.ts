import "server-only";
import { TRPCError } from "@trpc/server";
import { signUpSchema } from "@/features/auth/sign-up/schema";
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
});
