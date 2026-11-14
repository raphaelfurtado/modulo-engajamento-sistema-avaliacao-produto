-- Tabela de produtos (spec: specs/home.md · plano: plans/home.md)
create table if not exists public.products (
  id             text primary key,                -- nanoid gerado na camada de API
  name           text not null,
  description    text,                            -- opcional
  image_url      text not null,                   -- D3: URL externa (https)
  external_link  text not null,
  score          boolean not null default false,  -- D2: mantido como na spec, sem uso na interface
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Paginação por cursor (keyset) na home: ordem (created_at desc, id desc).
create index if not exists products_created_at_id_idx
  on public.products (created_at desc, id desc);

-- Mantém updated_at sincronizado (função criada na migration de accounts).
drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- RLS ligado e sem policies: só o servidor, com a secret key, lê e escreve.
alter table public.products enable row level security;
