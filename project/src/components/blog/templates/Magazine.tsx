import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, BlockRenderer } from "./SharedComponents";

interface MagazineTemplateProps {
  data: BlogTemplateData;
}

export default function MagazineTemplate({ data }: MagazineTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);
  const firstImage = blocks.find((block) => block.type === "image") as { src: string; alt: string } | undefined;
  const contentBlocks = blocks.filter((block) => block.type !== "image");

  return (
    <div className="bg-amber-50 text-slate-900">
      <header className="border-b-4 border-rose-900 py-8 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-rose-800">The Magazine</p>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">{blog.title}</h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {data.categoryName ?? "Feature"}
          </p>
          <BlogMeta data={data} className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-slate-600" />
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {firstImage ? (
          <img src={firstImage.src} alt={firstImage.alt} className="mb-8 h-96 w-full rounded-lg object-cover shadow-lg" />
        ) : blog.featured_image_url ? (
          <img src={blog.featured_image_url} alt={blog.title} className="mb-8 h-96 w-full rounded-lg object-cover shadow-lg" />
        ) : null}

        {blog.excerpt ? (
          <p className="mb-8 border-l-4 border-rose-800 pl-5 text-xl italic leading-relaxed text-slate-700">{blog.excerpt}</p>
        ) : null}

        <BlogTags tags={data.tags ?? []} className="mb-8 flex flex-wrap gap-2" itemClassName="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-900" />

        <div className="grid gap-10 md:grid-cols-12">
          <aside className="md:col-span-3">
            <div className="rounded-lg border-2 border-rose-800 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-800">In this issue</p>
              <p className="mt-2 text-sm text-slate-600">{blog.reading_time ?? 5} min read • {blog.title}</p>
            </div>
          </aside>

          <div className="md:col-span-9">
            {contentBlocks.map((block, index) => (
              <BlockRenderer
                key={index}
                block={block}
                className={
                  block.type === "paragraph"
                    ? "my-5 leading-relaxed text-slate-700"
                    : block.type === "heading"
                      ? "mt-8 mb-4 text-3xl font-extrabold italic text-rose-900"
                      : block.type === "blockquote"
                        ? "my-8 border-l-4 border-rose-800 pl-5 text-2xl italic text-slate-700"
                        : ""
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}