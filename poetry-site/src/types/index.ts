export type Poem = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  tags: string[];
  slug: string;
  excerpt?: string;
};

export type Database = {
  public: {
    Tables: {
      poems: {
        Row: Poem;
        Insert: Omit<Poem, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Poem, "id" | "created_at">>;
      };
    };
  };
};