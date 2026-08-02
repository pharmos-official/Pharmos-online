import { type FormEvent, useEffect, useMemo, useState } from "react";
import BlogEditor from "../../components/blog/BlogEditor";
import ImageUploader from "../../components/blog/ImageUploader";
import SeoFields from "../../components/blog/SeoFields";
import type { BlogPost } from "../../types/blog";
import { slugify } from "../../utils/slug";

interface EditBlogProps {
  blog: BlogPost | null;
  onSubmit: (id: string, payload: Partial<BlogPost>) => Promise<void>;
}

export default function EditBlog({ blog, onSubmit }: EditBlogProps) {
  const [title, setTitle] = useState(blog?.title ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [status, setStatus] = useState<BlogPost["status"]>(blog?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState(blog?.published_at ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(blog?.featured_image_url ?? null);
  const [seo, setSeo] = useState<Partial<BlogPost>>({
    seo_title: blog?.seo_title ?? "",
    seo_description: blog?.seo_description ?? "",
    seo_keywords: blog?.seo_keywords ?? "",
    canonical_url: blog?.canonical_url ?? "",
    og_title: blog?.og_title ?? "",
    og_description: blog?.og_description ?? "",
    twitter_card: blog?.twitter_card ?? "",
    breadcrumb_schema: blog?.breadcrumb_schema ?? "",
    faq_schema: blog?.faq_schema ?? "",
    article_schema: blog?.article_schema ?? "",
    reading_time: blog?.reading_time ?? 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setTitle(blog?.title ?? "");
    setContent(blog?.content ?? "");
    setExcerpt(blog?.excerpt ?? "");
    setStatus(blog?.status ?? "draft");
    setPublishedAt(blog?.published_at ?? "");
    setFeaturedImageUrl(blog?.featured_image_url ?? null);
    setSeo({
      seo_title: blog?.seo_title ?? "",
      seo_description: blog?.seo_description ?? "",
      seo_keywords: blog?.seo_keywords ?? "",
      canonical_url: blog?.canonical_url ?? "",
      og_title: blog?.og_title ?? "",
      og_description: blog?.og_description ?? "",
      twitter_card: blog?.twitter_card ?? "",
      breadcrumb_schema: blog?.breadcrumb_schema ?? "",
      faq_schema: blog?.faq_schema ?? "",
      article_schema: blog?.article_schema ?? "",
      reading_time: blog?.reading_time ?? 0,
    });
  }, [blog]);

  const slug = useMemo(() => slugify(title), [title]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");
    setIsSaving(true);

    if (!blog?.id) {
      setIsSaving(false);
      return;
    }

    try {
      await onSubmit(blog.id, {
        title,
        slug,
        excerpt,
        content,
        status,
        featured_image_url: featuredImageUrl,
        published_at: publishedAt || null,
        ...seo,
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to update blog right now.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-4 shadow-sm md:p-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Title</label>
        <input value={title} onChange={(event) => setTitle(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Slug</label>
        <input value={slug} className="w-full rounded-xl border border-slate-300 px-4 py-3" readOnly />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Excerpt</label>
        <textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" rows={3} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Featured Image</label>
        <ImageUploader label="Featured Image" value={featuredImageUrl} onChange={setFeaturedImageUrl} />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Inline Images</label>
        <ImageUploader
          label="Inline Image"
          value={null}
          onChange={() => undefined}
          onInsertIntoContent={(url) => {
            setContent((current) => `${current}<p><img src="${url}" alt="Inline upload" style="max-width:100%;" /></p>`);
          }}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Content</label>
        <BlogEditor
          value={content}
          onChange={setContent}
          autosaveKey={blog?.id ? `blog-editor-${blog.id}` : "blog-editor-edit"}
          placeholder="Edit your article here..."
        />
      </div>

      <SeoFields blog={seo} onChange={(patch) => setSeo((current) => ({ ...current, ...patch }))} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value as BlogPost["status"])} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Published Date
          <input type="datetime-local" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" />
        </label>
      </div>

      {submitError ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{submitError}</p> : null}

      <button type="submit" disabled={isSaving} className="rounded-xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
        {isSaving ? "Updating..." : "Update Blog"}
      </button>
    </form>
  );
}
