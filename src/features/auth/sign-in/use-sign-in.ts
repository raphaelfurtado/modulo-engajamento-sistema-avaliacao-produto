"use client";

import { useMutation } from "@tanstack/react-query";
import { signInRequest } from "./api";

export function useSignIn() {
  return useMutation({
    mutationKey: ["auth", "sign-in"],
    mutationFn: signInRequest,
  });
}
