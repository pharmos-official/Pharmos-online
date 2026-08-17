import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface PremiumTemplateProps {
  data: BlogTemplateData;
}

export default function PremiumTemplate({ data }: PremiumTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-amber-50 font-serif text-amber-950">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-amber-700">✦ Pharmos Premium ✦</p>
          <div className="mx-auto mt-6 h-px w-40 bg-amber-700" />
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">{blog.title}</h1>
          <div className="mx-auto mt-6 h-px w-40 bg-amber-700" />
          <BlogMeta data={data} className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-amber-700" />
        </header>

        {blog.featured_image_url ? (
          <figure className="mt-14">
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full rounded-sm object-cover shadow-2xl ring-1 ring-amber-900/20"
            />
            <figcaption className="mt-3 text-center text-xs italic text-amber-700/80">{blog.title}</figcaption>
          </figure>
        ) : null}

        <div className="mt-14">
          {blog.excerpt ? (
            <p className="text-center text-2xl italic leading-relaxed text-amber-900">{blog.excerpt}</p>
          ) : null}
        </div>

        {data.categoryName ? (
          <div className="mt-8 text-center">
            <span className="rounded-full bg-amber-900 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-amber-50">
              {data.categoryName}
            </span>
          </div>
        ) : null}

        <BlogTags
          tags={data.tags ?? []}
          className="mt-8 flex flex-wrap justify-center gap-2"
          itemClassName="rounded-full border border-amber-700 px-3 py-1 text-xs tracking-wide text-amber-800"
        />

        <div className="mt-16 border-t border-amber-900/20 pt-10">
          <ContentRenderer
            blocks={blocks}
            paragraphClassName="my-8 text-lg leading-[1.9] text-amber-900/90"
            headingClassName="mt-14 mb-6 text-3xl font-bold text-center"
          />
        </div>

        <footer className="mt-16 border-t border-amber-900/20 pt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700">Fin</p>
        </footer>
      </div>
    </div>
  );
}