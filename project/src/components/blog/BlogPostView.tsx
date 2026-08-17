import { useCallback, useEffect, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { ArrowLeft, ArrowRight, Calendar, Clock, Copy, Check, Twitter, Linkedin, X, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import type { BlogPost } from "../../types/blog";
import { parseBlogContent } from "../../utils/blogContent";
import { ContentRenderer } from "./templates/SharedComponents";

interface BlogPostViewProps {
  post: BlogPost;
  categoryName?: string;
  tags?: Array<{ name: string; slug: string }>;
  authorName?: string;
  previousPost: BlogPost | null;
  nextPost: BlogPost | null;
  relatedPosts: BlogPost[];
  shareUrl: string;
}

interface LightboxState {
  src: string;
  alt: string;
  index: number;
}

export default function BlogPostView({
  post,
  categoryName,
  tags,
  authorName = "Pharmos Online",
  previousPost,
  nextPost,
  relatedPosts,
  shareUrl,
}: BlogPostViewProps) {
  const [copied, setCopied] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const blocks = parseBlogContent(post.content);

  // Collect all images from the content blocks for lightbox navigation
  // This includes standalone image blocks AND images embedded inside paragraphs
  const contentImages = useMemo(() => {
    const images: Array<{ src: string; alt: string }> = [];

    blocks.forEach((block) => {
      if (block.type === "image") {
        images.push({ src: block.src, alt: block.alt });
      } else if (block.type === "paragraph" || block.type === "html") {
        // Extract images from HTML content using DOM parsing
        const template = document.createElement("template");
        template.innerHTML = block.html;
        template.content.querySelectorAll("img").forEach((img) => {
          images.push({ src: img.getAttribute("src") ?? "", alt: img.getAttribute("alt") ?? "" });
        });
      }
    });

    return images;
  }, [blocks]);

  const dateText = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Draft";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const openLightbox = useCallback(
    (src: string, alt: string) => {
      const index = contentImages.findIndex((image: { src: string; alt: string }) => image.src === src);
      setLightbox({ src, alt, index: Math.max(0, index) });
    },
    [contentImages],
  );

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const navigateLightbox = useCallback(
    (direction: 1 | -1) => {
      if (!lightbox || contentImages.length === 0) {
        return;
      }
      const nextIndex = (lightbox.index + direction + contentImages.length) % contentImages.length;
      const nextImage = contentImages[nextIndex];
      setLightbox({ src: nextImage.src, alt: nextImage.alt, index: nextIndex });
    },
    [lightbox, contentImages],
  );

  // Escape key to close lightbox
  useEffect(() => {
    if (!lightbox) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
      if (event.key === "ArrowLeft") {
        navigateLightbox(-1);
      }
      if (event.key === "ArrowRight") {
        navigateLightbox(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox, closeLightbox, navigateLightbox]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightbox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  // Handle clicks on images embedded inside paragraphs (rendered via dangerouslySetInnerHTML)
  const handleContentClick = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        const src = img.getAttribute("src") ?? "";
        const alt = img.getAttribute("alt") ?? "";
        if (src) {
          openLightbox(src, alt);
        }
      }
    },
    [openLightbox],
  );

  const faqItems = (() => {
    if (!post.faq_schema) return [];
    try {
      const parsed = JSON.parse(post.faq_schema) as Array<{ question: string; answer: string }>;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero / Cover Image */}
      <div className="relative w-full bg-slate-900">
        {post.featured_image_url ? (
          <>
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="mx-auto max-h-[520px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          </>
        ) : (
          <div className="h-64 w-full bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-900 md:h-96" />
        )}
      </div>

      {/* Article Container */}
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <article className="-mt-16 rounded-t-3xl bg-white px-5 pt-10 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] md:-mt-24 md:rounded-t-4xl md:px-12 md:pt-14">
          {/* Category + Breadcrumb */}
          <div className="flex flex-wrap items-center gap-3">
            {categoryName ? (
              <span className="rounded-full bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700">
                {categoryName}
              </span>
            ) : null}
            <span className="text-xs text-slate-400">•</span>
            <nav className="flex items-center gap-1.5 text-xs text-slate-500">
              <a href="/blog" className="transition-colors hover:text-sky-700">
                Blog
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-slate-700">{post.title.length > 30 ? `${post.title.slice(0, 30)}...` : post.title}</span>
            </nav>
          </div>

          {/* Title */}
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl md:leading-[1.1]">
            {post.title}
          </h1>

          {/* Author + Date + Reading Time */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">
                {authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{authorName}</p>
                <p className="text-xs text-slate-500">Author</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.published_at ?? undefined}>{dateText}</time>
            </div>
            {post.reading_time ? (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time} min read</span>
              </div>
            ) : null}
            {blocks.length > 0 ? (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <BookOpen className="h-4 w-4" />
                <span>{blocks.length} sections</span>
              </div>
            ) : null}
          </div>

          {/* Excerpt / Description */}
          {post.excerpt ? (
            <div className="mt-6 border-l-4 border-sky-600 bg-sky-50/50 px-5 py-4">
              <p className="text-base leading-relaxed text-slate-700 md:text-lg">{post.excerpt}</p>
            </div>
          ) : null}

          {/* Tags */}
          {tags && tags.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.slug}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          ) : null}

          {/* Full Blog Content */}
          <div className="blog-content-view mt-8" onClick={handleContentClick}>
            <ContentRenderer
              blocks={blocks}
              paragraphClassName="my-6 text-base leading-relaxed text-slate-700 md:text-lg md:leading-[1.85]"
              headingClassName="mt-12 mb-5 text-xl font-bold text-slate-900 md:text-2xl"
              onImageClick={openLightbox}
            />
          </div>

          {/* FAQ Section */}
          {faqItems.length > 0 ? (
            <div className="mt-12 border-t border-slate-200 pt-8">
              <h2 className="mb-5 text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqItems.map((item) => (
                  <div key={item.question} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                    <p className="font-semibold text-slate-900">{item.question}</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Share Section */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-900">Share this article</h3>
            <div className="flex items-center gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Read ${post.title} on Pharmos Online`)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all hover:scale-110 hover:bg-slate-700"
                aria-label="Share on X"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-700 text-white transition-all hover:scale-110 hover:bg-sky-600"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-all hover:scale-110 hover:border-slate-400 hover:text-slate-900"
                aria-label="Copy link"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
              </button>
              {copied ? <span className="text-xs font-semibold text-green-600">Link copied!</span> : null}
            </div>
          </div>
        </article>

        {/* Previous / Next Navigation */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {previousPost ? (
            <a
              href={`/blog/${previousPost.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg"
            >
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <ArrowLeft className="h-3.5 w-3.5" /> Previous Blog
              </p>
              <p className="mt-2 line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                {previousPost.title}
              </p>
              {previousPost.reading_time ? (
                <p className="mt-2 text-xs text-slate-500">{previousPost.reading_time} min read</p>
              ) : null}
            </a>
          ) : (
            <div className="hidden md:block" />
          )}

          {nextPost ? (
            <a
              href={`/blog/${nextPost.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-right transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg"
            >
              <p className="flex items-center justify-end gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Next Blog <ArrowRight className="h-3.5 w-3.5" />
              </p>
              <p className="mt-2 line-clamp-2 text-base font-bold text-slate-900 transition-colors group-hover:text-sky-700">
                {nextPost.title}
              </p>
              {nextPost.reading_time ? (
                <p className="mt-2 text-xs text-slate-500">{nextPost.reading_time} min read</p>
              ) : null}
            </a>
          ) : (
            <div className="hidden md:block" />
          )}
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 ? (
          <div className="mt-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Related Articles</h2>
              <a href="/blog" className="text-sm font-semibold text-sky-700 transition-colors hover:text-sky-600">
                View all
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 3).map((entry) => (
                <a
                  key={entry.id}
                  href={`/blog/${entry.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  {entry.featured_image_url ? (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={entry.featured_image_url}
                        alt={entry.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-sky-900 to-indigo-900 p-4 text-center text-sm font-semibold text-white">
                      {entry.title}
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-sky-700">
                      {entry.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-500">{entry.reading_time ?? 0} min read</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {/* Back to Blog */}
      <div className="pb-16 text-center">
        <a
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:border-sky-400 hover:text-sky-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </a>
      </div>

      {/* Image Lightbox / Fullscreen View */}
      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image fullscreen view"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev button */}
          {contentImages.length > 1 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigateLightbox(-1);
              }}
              className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}

          {/* Next button */}
          {contentImages.length > 1 ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigateLightbox(1);
              }}
              className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          ) : null}

          {/* Image */}
          <figure className="max-h-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-2xl"
            />
            {lightbox.alt ? (
              <figcaption className="mt-4 text-center text-sm text-white/80">{lightbox.alt}</figcaption>
            ) : null}
            {contentImages.length > 1 ? (
              <p className="mt-2 text-center text-xs text-white/60">
                {lightbox.index + 1} / {contentImages.length}
              </p>
            ) : null}
          </figure>
        </div>
      ) : null}

      {/* Premium typography for blog content */}
      <style>{`
        .blog-content-view h2,
        .blog-content-view h3,
        .blog-content-view h4 {
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0f172a;
        }
        .blog-content-view h2 {
          font-size: 1.5rem;
          line-height: 1.3;
        }
        .blog-content-view h3 {
          font-size: 1.3rem;
          line-height: 1.35;
        }
        .blog-content-view h4 {
          font-size: 1.125rem;
          line-height: 1.4;
        }
        .blog-content-view p {
          font-size: 1rem;
          line-height: 1.75;
          color: #334155;
        }
        @media (min-width: 768px) {
          .blog-content-view h2 {
            font-size: 1.75rem;
          }
          .blog-content-view h3 {
            font-size: 1.5rem;
          }
          .blog-content-view p {
            font-size: 1.125rem;
            line-height: 1.85;
          }
        }
        .blog-content-view blockquote {
          border-left: 4px solid #0369a1;
          padding-left: 1.5rem;
          margin: 2rem 0;
          font-style: italic;
          color: #475569;
          font-size: 1.05rem;
          background: #f0f9ff;
          padding-top: 1rem;
          padding-bottom: 1rem;
          border-radius: 0 0.75rem 0.75rem 0;
        }
        .blog-content-view blockquote p {
          margin: 0;
          color: inherit;
        }
        .blog-content-view ul,
        .blog-content-view ol {
          padding-left: 1.5rem;
          margin: 1.5rem 0;
        }
        .blog-content-view li {
          margin-bottom: 0.5rem;
          font-size: 1rem;
          line-height: 1.75;
          color: #334155;
        }
        @media (min-width: 768px) {
          .blog-content-view li {
            font-size: 1.125rem;
          }
        }
        .blog-content-view a {
          color: #0369a1;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .blog-content-view a:hover {
          color: #0284c7;
        }
        .blog-content-view pre {
          overflow-x: auto;
          border-radius: 0.75rem;
          background: #0f172a;
          padding: 1.25rem;
          margin: 1.75rem 0;
          font-size: 0.875rem;
          line-height: 1.7;
          color: #e2e8f0;
        }
        .blog-content-view figure {
          margin: 2rem 0;
        }
        .blog-content-view figure img {
          border-radius: 0.75rem;
          width: 100%;
          object-fit: cover;
          cursor: zoom-in;
          transition: transform 0.3s ease;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
        }
        .blog-content-view figure img:hover {
          transform: scale(1.01);
        }
        .blog-content-view figure figcaption {
          margin-top: 0.75rem;
          text-align: center;
          font-size: 0.875rem;
          color: #64748b;
        }
        .blog-content-view img {
          border-radius: 0.75rem;
          cursor: zoom-in;
        }
        /* Line clamp utilities */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .rounded-t-4xl {
          border-top-left-radius: 2.5rem;
          border-top-right-radius: 2.5rem;
        }
      `}</style>
    </main>
  );
}