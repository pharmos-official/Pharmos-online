import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, BlockRenderer } from "./SharedComponents";

interface ModernTemplateProps {
  data: BlogTemplateData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  const imageBlocks = blocks.filter((block) => block.type === "image") as Array<{ src: string; alt: string }>;
  const contentBlocks = blocks.filter((block) => block.type !== "image");

  return (
    <div className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-8 md:p-12">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-400">
            {data.categoryName ?? "Modern Article"}
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-5xl">{blog.title}</h1>
          <BlogMeta data={data} className="mt-6 flex flex-wrap gap-2 text-sm text-slate-300" />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">About</p>
            <p className="mt-3 text-sm text-slate-600">Written by {data.authorName ?? "Pharmos Online"}</p>
            <p className="mt-2 text-sm text-slate-600">{blog.reading_time ?? 5} min read</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Summary</p>
            <p className="mt-3 text-lg leading-relaxed text-slate-700">{blog.excerpt ?? "A modern take on this important topic."}</p>
          </div>
        </div>

        <BlogTags tags={data.tags ?? []} className="mt-6 flex flex-wrap gap-2" itemClassName="rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700" />

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm md:p-10">
          <div className="space-y-8">
            {contentBlocks.map((block, index) => {
              if (block.type === "heading" && index > 0 && imageBlocks.length > 0) {
                const image = imageBlocks[0];
                return (
                  <div key={index}>
                    <BlockRenderer block={block} className="text-3xl font-bold text-slate-900" />
                    <img src={image.src} alt={image.alt} className="mt-5 w-full rounded-xl object-cover" loading="lazy" />
                  </div>
                );
              }
              return (
                <BlockRenderer
                  key={index}
                  block={block}
                  className={
                    block.type === "paragraph"
                      ? "leading-relaxed text-slate-700"
                      : block.type === "heading"
                        ? "text-3xl font-bold text-slate-900"
                        : ""
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}