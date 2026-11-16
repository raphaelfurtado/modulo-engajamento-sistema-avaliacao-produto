// Tipos do banco usados pelo cliente Supabase.
// Contrato compartilhado entre features (plans/_orquestracao.md): só o orquestrador edita.
// Quando o projeto crescer, gere automaticamente com:
//   npx supabase gen types typescript --project-id <project-ref> > src/server/db/types.ts

/* accounts: supabase/migrations/20261114000000_create_accounts.sql */
export type AccountRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  salt: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type AccountInsert = Omit<
  AccountRow,
  "active" | "created_at" | "updated_at"
> &
  Partial<Pick<AccountRow, "active" | "created_at" | "updated_at">>;

/* products: supabase/migrations/20261114010000_create_products.sql */
export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string;
  external_link: string;
  /** Mantido como boolean conforme a spec (D2). Sem uso na interface por enquanto. */
  score: boolean;
  /* supabase/migrations/20261114030000_add_products_ai_summary.sql */
  /** Resumo das avaliações gerado por IA; null enquanto não houver. */
  ai_summary: string | null;
  /** Quantas avaliações o resumo considerou. */
  ai_summary_feedback_count: number | null;
  ai_summary_generated_at: string | null;
  created_at: string;
  updated_at: string;
};

type ProductOptionalColumns =
  | "description"
  | "score"
  | "ai_summary"
  | "ai_summary_feedback_count"
  | "ai_summary_generated_at"
  | "created_at"
  | "updated_at";

export type ProductInsert = Omit<ProductRow, ProductOptionalColumns> &
  Partial<Pick<ProductRow, ProductOptionalColumns>>;

/* products_feedbacks: supabase/migrations/20261114020000_create_products_feedbacks.sql */
export type ProductFeedbackRow = {
  id: string;
  product_id: string;
  created_by: string;
  /** Inteiro de 0 a 5 (D1). */
  score: number;
  comment: string;
  created_at: string;
};

export type ProductFeedbackInsert = Omit<ProductFeedbackRow, "created_at"> &
  Partial<Pick<ProductFeedbackRow, "created_at">>;

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: AccountRow;
        Insert: AccountInsert;
        Update: Partial<AccountInsert>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: Partial<ProductInsert>;
        Relationships: [];
      };
      products_feedbacks: {
        Row: ProductFeedbackRow;
        Insert: ProductFeedbackInsert;
        Update: Partial<ProductFeedbackInsert>;
        Relationships: [
          {
            foreignKeyName: "products_feedbacks_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_feedbacks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
