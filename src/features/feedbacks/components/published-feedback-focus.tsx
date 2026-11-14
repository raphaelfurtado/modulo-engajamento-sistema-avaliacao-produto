"use client";

import { useEffect } from "react";
import { feedbackElementId } from "../schema";

const STORAGE_KEY = "prova:published-feedback";

/** Chamado pelo formulário logo depois de publicar, antes do router.refresh(). */
export function rememberPublishedFeedback(feedbackId: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, feedbackId);
  } catch {
    // Sem storage (aba privada, bloqueio): a página só não move o foco.
  }
}

/**
 * Leva o foco para a avaliação recém-publicada. Só age quando o bloco
 * "Você já avaliou" aparece logo após a publicação, não em visitas normais.
 */
export function PublishedFeedbackFocus({ feedbackId }: { feedbackId: string }) {
  useEffect(() => {
    let published: string | null = null;
    try {
      published = sessionStorage.getItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      return;
    }
    if (published !== feedbackId) return;

    const element = document.getElementById(feedbackElementId(feedbackId));
    if (!element) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    element.focus({ preventScroll: true });
    element.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [feedbackId]);

  return null;
}
