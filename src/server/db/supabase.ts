import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/server/env";
import type { Database } from "./types";

let client: SupabaseClient<Database> | undefined;

/** Cliente Supabase com a secret key. Uso exclusivo no servidor. */
export function getSupabase(): SupabaseClient<Database> {
  if (!client) {
    const env = getServerEnv();
    client = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
