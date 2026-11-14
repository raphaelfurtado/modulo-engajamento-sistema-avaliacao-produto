"use client";

import { useMutation } from "@tanstack/react-query";
import { signUpRequest } from "./api";

export function useSignUp() {
  return useMutation({
    mutationKey: ["auth", "sign-up"],
    mutationFn: signUpRequest,
  });
}
