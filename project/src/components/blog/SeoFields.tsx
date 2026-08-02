import type { BlogPost } from "../../types/blog";

interface SeoFieldsProps {
  blog: Partial<BlogPost>;
  onChange: (patch: Partial<BlogPost>) => void;
}

export default function SeoFields({ blog, onChange }: SeoFieldsProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">SEO Settings</h3>
        <span className="rounded-full bg-sky-100 px-2 py-1 text-[10px] font-semibold text-sky-700">Structured metadata</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Meta Title
          <input
            value={blog.seo_title ?? ""}
            onChange={(event) => onChange({ seo_title: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Canonical URL
          <input
            value={blog.canonical_url ?? ""}
            onChange={(event) => onChange({ canonical_url: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Meta Description
        <textarea
          value={blog.seo_description ?? ""}
          onChange={(event) => onChange({ seo_description: event.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          rows={3}
        />
      </label>

      <label className="block text-sm font-semibold text-slate-700">
        Keywords
        <input
          value={blog.seo_keywords ?? ""}
          onChange={(event) => onChange({ seo_keywords: event.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Open Graph Title
          <input
            value={blog.og_title ?? ""}
            onChange={(event) => onChange({ og_title: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="OG title"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Open Graph Description
          <input
            value={blog.og_description ?? ""}
            onChange={(event) => onChange({ og_description: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            placeholder="OG description"
          />
        </label>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Twitter Card
        <input
          value={blog.twitter_card ?? ""}
          onChange={(event) => onChange({ twitter_card: event.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          placeholder="summary_large_image"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Breadcrumb Schema
          <input
            value={blog.breadcrumb_schema ?? ""}
            onChange={(event) => onChange({ breadcrumb_schema: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          FAQ Schema
          <input
            value={blog.faq_schema ?? ""}
            onChange={(event) => onChange({ faq_schema: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-slate-700">
          Article Schema
          <input
            value={blog.article_schema ?? ""}
            onChange={(event) => onChange({ article_schema: event.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Reading Time (minutes)
          <input
            type="number"
            min={1}
            value={blog.reading_time ?? ""}
            onChange={(event) => onChange({ reading_time: Number(event.target.value) || 0 })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </label>
      </div>
    </div>
  );
}
