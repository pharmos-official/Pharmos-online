import type { BlogTemplateData } from "../../../types/blogTemplate";
import { parseBlogContent } from "../../../utils/blogContent";
import { BlogMeta, BlogTags, BlockRenderer } from "./SharedComponents";

interface StoryTemplateProps {
  data: BlogTemplateData;
}

export default function StoryTemplate({ data }: StoryTemplateProps) {
  const { blog } = data;
  const blocks = parseBlogContent(blog.content);

  const imageBlocks = blocks.filter((block) => block.type === "image") as Array<{ src: string; alt: string }>;
  const contentBlocks = blocks.filter((block) => block.type !== "image");

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-100">
      {blog.featured_image_url ? (
        <div className="relative h-[70vh] w-full">
          <img src={blog.featured_image_url} alt={blog.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
          {data.categoryName ?? "A Story"}
        </p>
        <h1 className="mt-4 text-4xl font-black leading-tight md:text-5xl">{blog.title}</h1>

        <BlogMeta data={data} className="mt-6 flex flex-wrap gap-2 text-sm text-neutral-400" />

        {blog.excerpt ? (
          <p className="mt-8 text-xl italic leading-relaxed text-neutral-300">{blog.excerpt}</p>
        ) : null}

        <div className="my-10 h-px w-full bg-neutral-800" />

        <BlogTags
          tags={data.tags ?? []}
          className="mb-10 flex flex-wrap gap-2"
          itemClassName="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-amber-400"
        />

        <div className="space-y-10">
          {contentBlocks.map((block, index) => {
            if (block.type === "paragraph" && imageBlocks.length > index) {
              return (
                <div key={index} className="space-y-4">
                  <BlockRenderer block={block} className="text-lg leading-relaxed text-neutral-300" />
                  <img
                    src={imageBlocks[index].src}
                    alt={imageBlocks[index].alt}
                    className="w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                </div>
              );
            }
            return (
              <BlockRenderer
                key={index}
                block={block}
                className={
                  block.type === "paragraph"
                    ? "text-lg leading-relaxed text-neutral-300"
                    : block.type === "heading"
                      ? "text-3xl font-bold text-amber-400"
                      : block.type === "blockquote"
                        ? "text-2xl italic text-neutral-200"
                        : ""
                }
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}