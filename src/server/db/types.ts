// Tipos do banco usados pelo cliente Supabase.
// Quando o projeto crescer, gere automaticamente com:
//   npx supabase gen types typescript --project-id <project-ref> > src/server/db/types.ts

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

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: AccountRow;
        Insert: AccountInsert;
        Update: Partial<AccountInsert>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
