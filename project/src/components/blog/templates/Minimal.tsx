import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface MinimalTemplateProps {
  data: BlogTemplateData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-white text-zinc-900">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
          {data.categoryName ?? "Article"}
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">{blog.title}</h1>

        <BlogMeta data={data} className="mt-6 flex flex-wrap gap-2 text-sm text-zinc-400" />

        <div className="mt-10 space-y-6">
          {blog.excerpt ? <p className="text-lg leading-relaxed text-zinc-600">{blog.excerpt}</p> : null}

          {blog.featured_image_url ? (
            <img src={blog.featured_image_url} alt={blog.title} className="w-full object-cover" loading="lazy" />
          ) : null}

          <BlogTags
            tags={data.tags ?? []}
            className="flex flex-wrap gap-2 pt-2"
            itemClassName="text-xs font-medium text-zinc-400"
          />

          <div className="pt-2">
            <ContentRenderer
              blocks={blocks}
              paragraphClassName="my-6 leading-relaxed text-zinc-700"
              headingClassName="mt-12 mb-4 text-2xl font-bold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}