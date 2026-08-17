import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface HeroMagazineTemplateProps {
  data: BlogTemplateData;
}

export default function HeroMagazineTemplate({ data }: HeroMagazineTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-white font-serif text-slate-900">
      {blog.featured_image_url ? (
        <div className="relative h-[480px] w-full">
          <img src={blog.featured_image_url} alt={blog.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
                {data.categoryName ?? "Featured Story"}
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">{blog.title}</h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-3xl px-6 pt-16">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            {data.categoryName ?? "Featured Story"}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">{blog.title}</h1>
        </div>
      )}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <BlogMeta data={data} className="flex flex-wrap items-center gap-2 text-sm text-slate-500" />

        {blog.excerpt ? <p className="mt-6 text-xl leading-relaxed text-slate-700">{blog.excerpt}</p> : null}

        <BlogTags tags={data.tags ?? []} className="mt-6 flex flex-wrap gap-2" itemClassName="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900" />

        <hr className="my-10 border-slate-200" />

        <ContentRenderer
          blocks={blocks}
          paragraphClassName="my-6 text-lg leading-relaxed text-slate-700"
          headingClassName="mt-12 mb-4 text-3xl font-extrabold"
        />
      </div>
    </div>
  );
}