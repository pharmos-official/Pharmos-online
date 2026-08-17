import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface TravelTemplateProps {
  data: BlogTemplateData;
}

export default function TravelTemplate({ data }: TravelTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-teal-50 text-slate-900">
      {blog.featured_image_url ? (
        <div className="relative h-[420px] w-full md:h-[520px]">
          <img src={blog.featured_image_url} alt={blog.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-teal-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
                  ✦ {data.categoryName ?? "Destination"}
                </span>
              </div>
              <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">{blog.title}</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl px-6 pt-16">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">
            ✦ {data.categoryName ?? "Destination"}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{blog.title}</h1>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex flex-wrap items-center gap-2">
          <BlogMeta data={data} className="flex flex-wrap gap-2 text-sm text-slate-500" />
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-teal-200" />
          <span className="text-teal-600">✦</span>
          <div className="h-px flex-1 bg-teal-200" />
        </div>

        {blog.excerpt ? (
          <p className="text-xl leading-relaxed text-slate-700">{blog.excerpt}</p>
        ) : null}

        <BlogTags
          tags={data.tags ?? []}
          className="mt-6 flex flex-wrap gap-2"
          itemClassName="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800"
        />

        <ContentRenderer
          blocks={blocks}
          paragraphClassName="my-6 leading-relaxed text-slate-700"
          headingClassName="mt-10 mb-4 text-3xl font-extrabold text-teal-900"
        />
      </div>
    </div>
  );
}