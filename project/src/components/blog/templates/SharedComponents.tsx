import type { ContentBlock, BlogTemplateData } from "../../../types/blogTemplate";

interface BlockRendererProps {
  block: ContentBlock;
  className?: string;
  onImageClick?: (src: string, alt: string) => void;
}

export function BlockRenderer({ block, className = "", onImageClick }: BlockRendererProps) {
  switch (block.type) {
    case "paragraph":
      return <p className={className} dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "heading":
      if (block.level === 1) {
        return <h2 className={className} dangerouslySetInnerHTML={{ __html: block.html }} />;
      }
      if (block.level === 2) {
        return <h3 className={className} dangerouslySetInnerHTML={{ __html: block.html }} />;
      }
      return <h4 className={className} dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "image":
      return (
        <figure className="my-8">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onImageClick?.(block.src, block.alt);
            }}
            className="block w-full cursor-zoom-in"
            aria-label={`View image: ${block.alt || "content image"}`}
          >
            <img src={block.src} alt={block.alt} loading="lazy" className="w-full rounded-xl object-cover" />
          </button>
          {block.caption ? <figcaption className="mt-2 text-center text-sm text-slate-500">{block.caption}</figcaption> : null}
        </figure>
      );
    case "blockquote":
      return (
        <blockquote className={`my-8 border-l-4 border-slate-900 pl-5 italic text-slate-700 ${className}`} dangerouslySetInnerHTML={{ __html: block.html }} />
      );
    case "list":
      if (block.ordered) {
        return (
          <ol className={`my-6 list-decimal space-y-2 pl-6 ${className}`}>
            {block.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        );
      }
      return (
        <ul className={`my-6 list-disc space-y-2 pl-6 ${className}`}>
          {block.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className={`my-6 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100 ${className}`} dangerouslySetInnerHTML={{ __html: block.html }} />
      );
    case "video":
      return <div className="my-6 aspect-video w-full overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "html":
      return <div className={`my-6 ${className}`} dangerouslySetInnerHTML={{ __html: block.html }} />;
    default:
      return null;
  }
}

interface MetaProps {
  data: BlogTemplateData;
  className?: string;
  dateClassName?: string;
  element?: "header" | "div";
}

export function BlogMeta({ data, className = "", dateClassName = "", element = "div" }: MetaProps) {
  const { blog, authorName } = data;
  const dateText = blog.published_at
    ? new Date(blog.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Draft";

  const Tag = element;

  return (
    <Tag className={className}>
      <span>{authorName ?? "Pharmos Online"}</span>
      <span aria-hidden="true">•</span>
      <time className={dateClassName} dateTime={blog.published_at ?? undefined}>
        {dateText}
      </time>
      {blog.reading_time ? (
        <>
          <span aria-hidden="true">•</span>
          <span>{blog.reading_time} min read</span>
        </>
      ) : null}
    </Tag>
  );
}

interface TagsProps {
  tags: Array<{ name: string; slug: string }>;
  className?: string;
  itemClassName?: string;
}

export function BlogTags({ tags, className = "", itemClassName = "" }: TagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {tags.map((tag) => (
        <span key={tag.slug} className={itemClassName}>
          #{tag.name}
        </span>
      ))}
    </div>
  );
}

interface ContentRendererProps {
  blocks: ContentBlock[];
  className?: string;
  paragraphClassName?: string;
  headingClassName?: string;
  onImageClick?: (src: string, alt: string) => void;
}

export function ContentRenderer({ blocks, className = "", paragraphClassName = "", headingClassName = "", onImageClick }: ContentRendererProps) {
  if (!blocks || blocks.length === 0) {
    return <p className="text-slate-600">No content yet.</p>;
  }

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <BlockRenderer
          key={index}
          block={block}
          className={block.type === "paragraph" ? paragraphClassName : block.type === "heading" ? headingClassName : ""}
          onImageClick={onImageClick}
        />
      ))}
    </div>
  );
}