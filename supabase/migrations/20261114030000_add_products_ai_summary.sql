-- Resumo das avaliações gerado por IA (Mastra + openai/gpt-4o-mini).
-- Roda depois de 20261114020000_create_products_feedbacks.sql.
-- Gerado no servidor a cada nova avaliação, a partir de 3 avaliações.
alter table public.products
  add column if not exists ai_summary text,                       -- null = sem resumo
  add column if not exists ai_summary_feedback_count integer,     -- quantas avaliações o resumo considerou
  add column if not exists ai_summary_generated_at timestamptz;
