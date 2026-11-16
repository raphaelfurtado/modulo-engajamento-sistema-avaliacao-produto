import "server-only";
import { revalidateTag } from "next/cache";
import { getReviewSummaryAgent } from "@/server/ai/review-summary-agent";
import { getSupabase } from "@/server/db/supabase";
import { getServerEnv } from "@/server/env";
import { productCacheTag } from "./shared";

/** Com menos avaliações, o resumo só repetiria o que está logo abaixo. */
export const MIN_FEEDBACKS_FOR_SUMMARY = 3;

/** Limite de avaliações enviadas ao modelo (as mais recentes). */
const MAX_FEEDBACKS_IN_PROMPT = 100;
const MAX_SUMMARY_LENGTH = 800;

/**
 * Gera de novo o resumo de IA das avaliações de um produto e salva em
 * products.ai_summary. Feito para rodar em `after()`: nunca lança erro, só
 * registra no log, para não afetar a avaliação já publicada.
 */
export async function refreshProductSummary(productId: string): Promise<void> {
  try {
    const apiKey = getServerEnv().OPENAI_API_KEY;
    if (!apiKey) {
      console.warn(
        "OPENAI_API_KEY não definido no .env.local: resumo de IA não gerado.",
      );
      return;
    }

    const supabase = getSupabase();
    const {
      data: feedbacks,
      error,
      count,
    } = await supabase
      .from("products_feedbacks")
      .select("score, comment", { count: "exact" })
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(MAX_FEEDBACKS_IN_PROMPT);
    if (error) throw error;

    const total = count ?? feedbacks.length;
    if (total < MIN_FEEDBACKS_FOR_SUMMARY) return;

    const reviews = feedbacks
      .map(
        ({ score, comment }) =>
          `<avaliacao nota="${score}">\n${comment.replaceAll("<", "‹")}\n</avaliacao>`,
      )
      .join("\n");

    const response = await getReviewSummaryAgent(apiKey).generate(
      `Resuma estas ${feedbacks.length} avaliações.\n<avaliacoes>\n${reviews}\n</avaliacoes>`,
    );
    const summary = response.text.trim().slice(0, MAX_SUMMARY_LENGTH);
    if (!summary) return;

    // Duas avaliações quase simultâneas geram dois resumos; o filtro impede
    // que o mais antigo (com menos avaliações) sobrescreva o mais novo.
    const { error: updateError } = await supabase
      .from("products")
      .update({
        ai_summary: summary,
        ai_summary_feedback_count: total,
        ai_summary_generated_at: new Date().toISOString(),
      })
      .eq("id", productId)
      .or(
        `ai_summary_feedback_count.is.null,ai_summary_feedback_count.lte.${total}`,
      );
    if (updateError) throw updateError;

    revalidateTag(productCacheTag(productId), { expire: 0 });
  } catch (error) {
    console.error(
      `Falha ao gerar o resumo de IA do produto ${productId}:`,
      error,
    );
  }
}
