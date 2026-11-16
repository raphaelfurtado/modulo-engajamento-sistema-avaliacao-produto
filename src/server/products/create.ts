import "server-only";
import { nanoid } from "nanoid";
import type { CreateProductData, Product } from "@/features/products/schema";
import { getSupabase } from "@/server/db/supabase";

/** Cadastra um produto. Recebe dados já validados pelo schema. */
export async function createProduct(data: CreateProductData): Promise<Product> {
  const { data: row, error } = await getSupabase()
    .from("products")
    .insert({
      id: nanoid(),
      name: data.name,
      description: null,
      image_url: data.imageUrl,
      external_link: data.externalLink,
    })
    .select("id, name, description, image_url, external_link, created_at")
    .single();

  if (error) {
    throw new Error(`Falha ao cadastrar produto: ${error.message}`, {
      cause: error,
    });
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    externalLink: row.external_link,
    createdAt: row.created_at,
  };
}
