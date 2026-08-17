import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, ContentRenderer } from "./SharedComponents";

interface NewspaperTemplateProps {
  data: BlogTemplateData;
}

export default function NewspaperTemplate({ data }: NewspaperTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  return (
    <div className="bg-stone-50 font-serif text-stone-900">
      <header className="border-b-4 border-double border-stone-900 py-8 text-center">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-stone-500">The Daily Gazette</p>
          <h1 className="mt-4 text-5xl font-black md:text-6xl">{blog.title}</h1>
          <div className="mx-auto mt-4 h-px max-w-md bg-stone-300" />
          {blog.excerpt ? <p className="mx-auto mt-4 max-w-2xl text-lg italic text-stone-600">{blog.excerpt}</p> : null}
          <BlogMeta data={data} className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-stone-500" />
        </div>
      </header>

      <div className="border-b-4 border-double border-stone-900" />

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {blog.featured_image_url ? (
              <figure className="mb-8">
                <img src={blog.featured_image_url} alt={blog.title} className="w-full object-cover" loading="lazy" />
                <figcaption className="mt-2 border-b border-stone-300 pb-2 text-xs italic text-stone-500">{blog.title}</figcaption>
              </figure>
            ) : null}

            <ContentRenderer
              blocks={blocks}
              paragraphClassName="my-5 text-base leading-relaxed text-stone-700"
              headingClassName="mt-10 mb-4 border-b-2 border-stone-900 pb-2 text-2xl font-bold"
            />
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-8">
              <div className="border-t-4 border-stone-900 pt-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-stone-500">Sidebar</p>
                <BlogTags tags={data.tags ?? []} className="flex flex-wrap gap-2" itemClassName="rounded-full border border-stone-300 px-3 py-1 text-xs text-stone-700" />
              </div>
              <div className="border-t-4 border-stone-900 pt-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-stone-500">Quick facts</p>
                <div className="space-y-2 text-sm text-stone-700">
                  <p>Author: {data.authorName ?? "Pharmos Online"}</p>
                  <p>Category: {data.categoryName ?? "General"}</p>
                  <p>Reading time: {blog.reading_time ?? 5} min</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <footer className="border-t-4 border-double border-stone-900 py-6 text-center text-xs uppercase tracking-[0.3em] text-stone-500">
        End of Article
      </footer>
    </div>
  );
}