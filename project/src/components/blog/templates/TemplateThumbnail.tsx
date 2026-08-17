import type { BlogTemplateData, BlogTemplateMeta } from "../../../types/blogTemplate";

interface TemplateThumbnailProps {
  meta: BlogTemplateMeta;
  data: BlogTemplateData;
  selected: boolean;
  onSelect: () => void;
}

export default function TemplateThumbnail({ meta, data, selected, onSelect }: TemplateThumbnailProps) {
  const { blog } = data;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Select ${meta.name} template`}
      className={`group relative w-full overflow-hidden rounded-xl border-2 bg-white text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
        selected ? "border-sky-600 shadow-md ring-2 ring-sky-600/20" : "border-slate-200 hover:border-sky-300 hover:shadow-md"
      }`}
    >
      <div className={`relative aspect-[4/3] w-full overflow-hidden ${meta.previewBg}`}>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 p-3">
          <div className="flex flex-col items-center gap-1 text-center">
            <span className={`line-clamp-2 w-full text-xs font-bold leading-tight ${meta.previewText}`}>
              {blog.title || "Your Blog Title"}
            </span>
            <span className="line-clamp-2 w-full text-[9px] leading-tight text-slate-400">
              {blog.excerpt || "Your blog description will appear here..."}
            </span>
          </div>

          {blog.featured_image_url ? (
            <div className="relative h-16 w-full overflow-hidden rounded-md">
              <img src={blog.featured_image_url} alt={meta.name} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-16 w-full rounded-md bg-slate-100">
              <div className="flex h-full items-center justify-center">
                <span className="text-[10px] font-semibold text-slate-400">No cover</span>
              </div>
            </div>
          )}
        </div>

        {selected ? (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white shadow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="h-3.5 w-3.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 p-3">
        <span className={`h-2 w-2 shrink-0 rounded-full ${meta.accent}`} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{meta.name}</p>
          <p className="line-clamp-1 text-[10px] text-slate-400">{meta.description}</p>
        </div>
      </div>
    </button>
  );
}