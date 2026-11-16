import { z } from "zod";

/** Tamanho padrão de cada página da listagem. */
export const PRODUCTS_PAGE_SIZE = 12;
export const PRODUCTS_MAX_PAGE_SIZE = 48;

/** Query do GET /api/v1/products (`limit` chega como texto na URL). */
export const listProductsSchema = z.object({
  cursor: z
    .string()
    .trim()
    .min(1, "Cursor inválido.")
    .max(256, "Cursor inválido.")
    .optional(),
  limit: z.coerce
    .number("Informe um número.")
    .int("Use um número inteiro.")
    .min(1, "Use um valor entre 1 e 48.")
    .max(PRODUCTS_MAX_PAGE_SIZE, "Use um valor entre 1 e 48.")
    .default(PRODUCTS_PAGE_SIZE),
});

export type ListProductsInput = z.input<typeof listProductsSchema>;
export type ListProductsData = z.output<typeof listProductsSchema>;

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "Informe uma URL http ou https válida.",
});

/**
 * Body do POST /api/v1/products (público, sem autenticação).
 * `{ name, link, image }` vira `{ name, externalLink, imageUrl }`
 * (colunas name, external_link, image_url).
 */
export const createProductSchema = z
  .object({
    name: z
      .string("Informe o nome do produto.")
      // Nomes raspados de lojas trazem quebras de linha e espaços repetidos.
      .transform((value) => value.replace(/\s+/g, " ").trim())
      .pipe(
        z
          .string()
          .min(1, "Informe o nome do produto.")
          .max(200, "Use no máximo 200 caracteres."),
      ),
    link: z.string("Informe o link do produto.").trim().pipe(httpUrl),
    // As imagens passam pelo next/image, que só aceita origens https (next.config.ts).
    image: z
      .string("Informe a URL da imagem.")
      .trim()
      .pipe(
        z.url({
          protocol: /^https$/,
          error: "Informe uma URL https válida para a imagem.",
        }),
      ),
  })
  .transform(({ name, link, image }) => ({
    name,
    externalLink: link,
    imageUrl: image,
  }));

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductData = z.output<typeof createProductSchema>;

/** O que a home mostra de cada produto. */
export type ProductSummary = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
};

/** Uma página da listagem. `nextCursor` é opaco; `null` = fim da lista. */
export type ProductsPage = {
  items: ProductSummary[];
  nextCursor: string | null;
};

/** Produto completo, retornado pelo POST. */
export type Product = ProductSummary & {
  externalLink: string;
  createdAt: string;
};
