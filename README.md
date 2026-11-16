# Prova

Avaliações de produtos feitas por quem comprou e usou, com nota de 0 a 5.

**Site publicado:** https://modulo-engajamento-sistema-avaliaca-ten.vercel.app

Cada produto tem uma etiqueta de nota, no formato das etiquetas de eficiência
dos eletrodomésticos, e um resumo das avaliações gerado por IA.

## Stack

Next.js 16, React, Tailwind CSS, shadcn/ui, tRPC, React Hook Form, Supabase,
Mastra (OpenAI `gpt-4o-mini`) e Bun. Deploy na Vercel a cada push no `main`.

## Rodar localmente

1. Copie `.env.example` para `.env.local` e preencha as variáveis (o arquivo
   explica cada uma).
2. Aplique as migrations de `supabase/migrations/` no seu projeto Supabase.
3. Instale e rode:

   ```bash
   bun install
   bun dev
   ```

4. Abra http://localhost:3000.

## Cadastro de produtos

`POST /api/v1/products` com o header `x-api-key` (valor de `PRODUCTS_API_KEY`) e
o corpo `{ "name": "...", "link": "https://...", "image": "https://..." }`.
Para cadastrar produtos de exemplo: `bun scripts/seed-products.ts`.

## Documentação

As especificações de cada funcionalidade e o design system estão em
[`specs/`](specs/).
