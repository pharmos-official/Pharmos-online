import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface EditorialTemplateProps {
  data: BlogTemplateData;
}

export default function EditorialTemplate({ data }: EditorialTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-white font-serif text-slate-900">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 py-16 md:py-24">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">
            {data.categoryName ?? "Editorial"}
          </p>
          <h1 className="mt-5 text-5xl font-light leading-[1.1] tracking-tight md:text-6xl">{blog.title}</h1>
          <BlogMeta data={data} className="mt-6 flex flex-wrap gap-2 text-sm text-slate-400" />
        </div>

        <div className="mb-12 h-px w-full bg-slate-200" />

        {blog.featured_image_url ? (
          <img src={blog.featured_image_url} alt={blog.title} className="mb-12 w-full object-cover" loading="lazy" />
        ) : null}

        {blog.excerpt ? (
          <p className="mb-10 text-2xl leading-relaxed text-slate-600">{blog.excerpt}</p>
        ) : null}

        <BlogTags
          tags={data.tags ?? []}
          className="mb-10 flex flex-wrap gap-2"
          itemClassName="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800"
        />

        <ContentRenderer
          blocks={blocks}
          paragraphClassName="my-8 text-lg leading-[1.9] text-slate-700"
          headingClassName="mt-14 mb-5 text-4xl font-light tracking-tight"
        />
      </div>
    </div>
  );
}