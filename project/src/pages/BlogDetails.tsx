import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchBlogCategories,
  fetchBlogBySlug,
  fetchBlogTagRelations,
  fetchPublishedBlogs,
} from "../services/blogService";
import type { BlogPost } from "../types/blog";

interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
}

interface TagRecord {
  name: string;
  slug: string;
}

interface TagRelationRecord {
  blog_id: string;
  tags: TagRecord | TagRecord[] | null;
}

function normalizeTags(tags: TagRecord | TagRecord[] | null): TagRecord[] {
  if (!tags) {
    return [];
  }

  return Array.isArray(tags) ? tags : [tags];
}

function buildJsonLd(post: BlogPost, categoryName?: string, tags?: TagRecord[]) {
  const faqEntries = (() => {
    if (!post.faq_schema) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(post.faq_schema) as Array<{ question: string; answer: string }>;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return undefined;
      }

      return parsed.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      }));
    } catch {
      return undefined;
    }
  })();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seo_description ?? post.excerpt ?? "",
    author: {
      "@type": "Organization",
      name: "Pharmos Online",
    },
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at ?? post.published_at ?? post.created_at,
    image: post.featured_image_url ?? undefined,
    keywords: post.seo_keywords ?? undefined,
    articleSection: categoryName ?? undefined,
    about: tags?.map((tag) => tag.name) ?? undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonical_url ?? `https://example.com/blog/${post.slug}`,
    },
    ...(faqEntries ? { mainEntity: faqEntries } : {}),
  };

  return JSON.stringify(schema);
}

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [tagRelations, setTagRelations] = useState<TagRelationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      const [postResult, postsResult, categoriesResult, tagsResult] = await Promise.all([
        fetchBlogBySlug(slug),
        fetchPublishedBlogs(),
        fetchBlogCategories(),
        fetchBlogTagRelations(),
      ]);

      const resolvedPost = (postResult.data ?? null) as BlogPost | null;
      const resolvedPosts = (postsResult.data ?? []) as BlogPost[];
      const resolvedCategories = (categoriesResult.data ?? []) as CategoryRecord[];
      const resolvedTagRelations = (tagsResult.data ?? []) as TagRelationRecord[];

      setPost(resolvedPost);
      setPosts(resolvedPosts);
      setCategories(resolvedCategories);
      setTagRelations(resolvedTagRelations);
      setLoading(false);
    };

    void loadPost();
  }, [slug]);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  );

  const tagsByPost = useMemo(() => {
    return tagRelations.reduce<Record<string, TagRecord[]>>((accumulator, relation) => {
      if (!relation.blog_id) {
        return accumulator;
      }

      const normalized = normalizeTags(relation.tags);
      if (normalized.length === 0) {
        return accumulator;
      }

      accumulator[relation.blog_id] = normalized;
      return accumulator;
    }, {});
  }, [tagRelations]);

  const currentPost = post;
  const currentCategory = currentPost?.category_id ? categoriesById[currentPost.category_id] : null;
  const currentTags = currentPost?.id ? tagsByPost[currentPost.id] ?? [] : [];

  const sortedPosts = useMemo(() => {
    return [...posts].sort((left, right) => {
      const leftDate = new Date(left.published_at ?? left.created_at ?? Date.now().toString()).getTime();
      const rightDate = new Date(right.published_at ?? right.created_at ?? Date.now().toString()).getTime();
      return rightDate - leftDate;
    });
  }, [posts]);

  const currentIndex = sortedPosts.findIndex((entry) => entry.slug === currentPost?.slug);
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : null;

  const relatedPosts = useMemo(() => {
    if (!currentPost) {
      return [];
    }

    const sameCategory = currentPost.category_id
      ? sortedPosts.filter(
          (entry) => entry.category_id === currentPost.category_id && entry.slug !== currentPost.slug,
        )
      : [];

    const byTag = sortedPosts.filter((entry) => {
      if (entry.slug === currentPost.slug) {
        return false;
      }

      const entryTags = tagsByPost[entry.id ?? ""] ?? [];
      return entryTags.some((tag) => currentTags.some((currentTag) => currentTag.slug === tag.slug));
    });

    return [...sameCategory, ...byTag].slice(0, 3);
  }, [currentPost, currentTags, sortedPosts, tagsByPost]);

  const faqItems = useMemo(() => {
    if (!currentPost?.faq_schema) {
      return [] as Array<{ question: string; answer: string }>;
    }

    try {
      const parsed = JSON.parse(currentPost.faq_schema) as Array<{ question: string; answer: string }>;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [currentPost]);

  useEffect(() => {
    if (!currentPost) {
      return;
    }

    const pageTitle = currentPost.seo_title ?? currentPost.title;
    const metaDescription = currentPost.seo_description ?? currentPost.excerpt ?? "";
    const keywords = currentPost.seo_keywords ?? "";
    const canonical = currentPost.canonical_url ?? `https://example.com/blog/${currentPost.slug}`;

    document.title = pageTitle;

    const setMeta = (name: string, value: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    const updateProperty = (property: string, value: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    setMeta("description", metaDescription);
    setMeta("keywords", keywords);

    updateProperty("og:title", currentPost.og_title ?? pageTitle);
    updateProperty("og:description", metaDescription);
    updateProperty("og:type", "article");
    updateProperty("twitter:card", currentPost.twitter_card ?? "summary_large_image");

    const canonicalTag = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (canonicalTag) {
      canonicalTag.href = canonical;
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonical;
      document.head.appendChild(link);
    }

    const jsonLd = document.getElementById("blog-json-ld");
    if (!jsonLd) {
      const script = document.createElement("script");
      script.id = "blog-json-ld";
      script.type = "application/ld+json";
      script.textContent = buildJsonLd(currentPost, currentCategory?.name, currentTags);
      document.head.appendChild(script);
    } else {
      jsonLd.textContent = buildJsonLd(currentPost, currentCategory?.name, currentTags);
    }
  }, [currentCategory?.name, currentPost, currentTags]);

  if (loading) {
    return <div className="p-8 text-sm text-slate-500">Loading article...</div>;
  }

  if (!currentPost) {
    return <div className="p-8 text-sm text-slate-500">Article not found.</div>;
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${currentPost.slug}`
    : `https://example.com/blog/${currentPost.slug}`;

  const shareText = encodeURIComponent(`Read ${currentPost.title} on Pharmos Online`);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <article className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            <span>Article</span>
            {currentCategory ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{currentCategory.name}</span> : null}
            {currentPost.reading_time ? <span className="text-slate-500">• {currentPost.reading_time} min read</span> : null}
          </div>

          {currentPost.featured_image_url ? (
            <img src={currentPost.featured_image_url} alt={currentPost.title} className="mb-6 h-[320px] w-full rounded-2xl object-cover" />
          ) : null}

          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>Author: Pharmos Online</span>
            <span>•</span>
            <span>{currentPost.published_at ? new Date(currentPost.published_at).toLocaleDateString() : "Draft"}</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">{currentPost.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{currentPost.excerpt}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <span key={`${currentPost.id}-${tag.slug}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                #{tag.name}
              </span>
            ))}
          </div>

          <div className="mt-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: currentPost.content }} />
        </section>

        {faqItems.length > 0 ? (
          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">FAQ</h2>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{item.question}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Related Posts</h2>
            <div className="flex flex-wrap gap-2">
              <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-white">
                Share on X
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white">
                Share on LinkedIn
              </a>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                }}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700"
              >
                Copy link
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {relatedPosts.map((entry) => (
              <a key={entry.id} href={`/blog/${entry.slug}`} className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
                {entry.featured_image_url ? (
                  <img src={entry.featured_image_url} alt={entry.title} className="mb-3 h-36 w-full rounded-xl object-cover" />
                ) : null}
                <h3 className="font-semibold text-slate-900">{entry.title}</h3>
                <p className="mt-2 text-xs text-slate-500">{entry.reading_time ?? 0} min read</p>
              </a>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {previousPost ? (
            <a href={`/blog/${previousPost.slug}`} className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Previous</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{previousPost.title}</p>
            </a>
          ) : null}

          {nextPost ? (
            <a href={`/blog/${nextPost.slug}`} className="rounded-3xl bg-white p-5 text-right shadow-sm md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Next</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{nextPost.title}</p>
            </a>
          ) : null}
        </section>
      </article>
    </main>
  );
}
