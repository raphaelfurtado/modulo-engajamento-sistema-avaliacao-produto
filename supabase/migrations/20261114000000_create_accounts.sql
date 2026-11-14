-- Tabela de contas (spec: specs/sign-up.md)
create table if not exists public.accounts (
  id          text primary key,                       -- nanoid gerado na camada de API
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  password    text not null,                          -- hash bcrypt
  salt        text not null,                          -- salt bcrypt (ex.: $2b$12$...)
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint accounts_email_key unique (email)
);

-- Mantém updated_at sincronizado em qualquer UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists accounts_set_updated_at on public.accounts;
create trigger accounts_set_updated_at
  before update on public.accounts
  for each row execute function public.set_updated_at();

-- RLS ligado e sem policies: a tabela fica inacessível pelas chaves públicas (anon/publishable).
-- Apenas o servidor, usando a secret key, consegue ler/escrever.
alter table public.accounts enable row level security;
