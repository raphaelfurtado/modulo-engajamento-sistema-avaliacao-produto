"use client";

import { useMutation } from "@tanstack/react-query";
import { createFeedbackRequest } from "./api";

export function useCreateFeedback() {
  return useMutation({
    mutationKey: ["feedbacks", "create"],
    mutationFn: createFeedbackRequest,
  });
}
