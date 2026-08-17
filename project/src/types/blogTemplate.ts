import type { BlogPost } from "./blog";

export type TemplateId =
  | "classic"
  | "hero-magazine"
  | "magazine"
  | "newspaper"
  | "editorial"
  | "modern"
  | "story"
  | "minimal"
  | "travel"
  | "premium";

export const DEFAULT_TEMPLATE_ID: TemplateId = "classic";

export interface BlogTemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  accent: string;
  previewBg: string;
  previewText: string;
  previewAccent: string;
}

export interface BlogTemplateData {
  blog: BlogPost;
  categoryName?: string;
  tags?: Array<{ name: string; slug: string }>;
  authorName?: string;
}

export type ContentBlock =
  | { type: "paragraph"; html: string; text: string }
  | { type: "heading"; level: 1 | 2 | 3; html: string; text: string }
  | { type: "image"; src: string; alt: string; caption?: string; html: string }
  | { type: "blockquote"; html: string; text: string }
  | { type: "list"; ordered: boolean; html: string; items: string[] }
  | { type: "code"; html: string; text: string }
  | { type: "video"; html: string }
  | { type: "html"; html: string };

export function isTemplateId(value: string | null | undefined): value is TemplateId {
  if (!value) {
    return false;
  }
  return [
    "classic",
    "hero-magazine",
    "magazine",
    "newspaper",
    "editorial",
    "modern",
    "story",
    "minimal",
    "travel",
    "premium",
  ].includes(value);
}