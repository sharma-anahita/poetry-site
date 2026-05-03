// Export a Poem type for convenience
export type Poem = Database["public"]["Tables"]["poems"]["Row"];
export type Database = {
  public: {
    Tables: {
      poems: {
        Row: {
          id: string;
          title: string;
          content: string;
          slug: string;
          tags: string[];
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          content: string;
          slug: string;
          tags?: string[];
          is_published?: boolean;
        };
        Update: {
          title?: string;
          content?: string;
          slug?: string;
          tags?: string[];
          is_published?: boolean;
          updated_at?: string;
        };
      };
    };
  };
};