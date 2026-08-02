import { supabase } from "../lib/auth";
import type { BlogPost } from "../types/blog";

const TABLE_NAME = "blogs";

export async function fetchBlogs() {
  return supabase.from(TABLE_NAME).select("*").order("created_at", { ascending: false });
}

export async function fetchPublishedBlogs() {
  return supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });
}

export async function fetchBlogCategories() {
  return supabase.from("categories").select("*").order("name", { ascending: true });
}

export async function fetchBlogTagRelations() {
  return supabase.from("blog_tag").select("blog_id, tags(name, slug)").order("blog_id", { ascending: true });
}

export async function fetchBlogBySlug(slug: string) {
  return supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
}

export async function fetchBlogById(id: string) {
  return supabase.from(TABLE_NAME).select("*").eq("id", id).maybeSingle();
}

export async function createBlog(payload: BlogPost) {
  return supabase.from(TABLE_NAME).insert(payload).select().single();
}

export async function updateBlog(id: string, payload: Partial<BlogPost>) {
  return supabase.from(TABLE_NAME).update(payload).eq("id", id).select().single();
}

export async function deleteBlog(id: string) {
  return supabase.from(TABLE_NAME).delete().eq("id", id);
}

export async function publishBlog(id: string) {
  return supabase
    .from(TABLE_NAME)
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
}

export async function unpublishBlog(id: string) {
  return supabase
    .from(TABLE_NAME)
    .update({
      status: "draft",
      published_at: null,
    })
    .eq("id", id)
    .select()
    .single();
}
