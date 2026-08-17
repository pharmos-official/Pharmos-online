import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface ClassicTemplateProps {
  data: BlogTemplateData;
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-white text-slate-900">
      {blog.featured_image_url ? (
        <img src={blog.featured_image_url} alt={blog.title} className="h-72 w-full object-cover" />
      ) : null}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-4xl font-bold md:text-5xl">{blog.title}</h1>

        <div className="mt-3 text-sm text-slate-500">
          <span>Author: {data.authorName ?? "Pharmos Online"}</span>
        </div>

        <BlogMeta
          data={data}
          className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500"
        />

        {blog.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-slate-600">{blog.excerpt}</p>
        ) : null}

        <BlogTags
          tags={data.tags ?? []}
          className="mt-6 flex flex-wrap gap-2"
          itemClassName="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
        />

        <hr className="my-8 border-slate-200" />

        <ContentRenderer
          blocks={blocks}
          paragraphClassName="my-5 leading-relaxed text-slate-700"
          headingClassName="mt-10 mb-4 font-bold text-slate-900"
        />
      </div>
    </div>
  );
}