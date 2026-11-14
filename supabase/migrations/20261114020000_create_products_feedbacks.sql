-- Avaliações de produtos (spec: specs/feedback.md · plano: plans/feedback.md)
-- Roda depois de 20261114010000_create_products.sql (FK para products).
create table if not exists public.products_feedbacks (
  id          text primary key,                                         -- nanoid gerado na camada de API
  product_id  text not null,
  created_by  text not null,
  score       integer not null,                                         -- D1: inteiro de 0 a 5
  comment     text not null,
  created_at  timestamptz not null default now(),
  constraint products_feedbacks_product_id_fkey
    foreign key (product_id) references public.products (id) on delete cascade,
  constraint products_feedbacks_created_by_fkey
    foreign key (created_by) references public.accounts (id) on delete cascade,
  constraint products_feedbacks_score_check
    check (score between 0 and 5),
  constraint products_feedbacks_comment_check
    check (char_length(comment) between 10 and 2000),
  -- D7: uma avaliação por pessoa por produto (a API responde 409).
  constraint products_feedbacks_one_per_account unique (product_id, created_by)
);

-- Lista da página do produto: mais recentes primeiro.
create index if not exists products_feedbacks_product_created_idx
  on public.products_feedbacks (product_id, created_at desc);

-- Apoia o "on delete cascade" quando uma conta é apagada.
create index if not exists products_feedbacks_created_by_idx
  on public.products_feedbacks (created_by);

-- Sem trigger de média (D2): a página calcula a média a partir das avaliações.

-- RLS ligado e sem policies: só o servidor, com a secret key, lê e escreve.
alter table public.products_feedbacks enable row level security;
