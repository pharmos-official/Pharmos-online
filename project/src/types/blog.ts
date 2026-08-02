export type BlogStatus = "draft" | "published" | "archived";

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  status: BlogStatus;
  featured_image_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  twitter_card?: string | null;
  breadcrumb_schema?: string | null;
  faq_schema?: string | null;
  article_schema?: string | null;
  reading_time?: number | null;
  author_id?: string | null;
  category_id?: string | null;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}
