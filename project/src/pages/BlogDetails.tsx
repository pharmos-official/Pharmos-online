import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BlogPostView from "../components/blog/BlogPostView";
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
  const currentTags = useMemo(
    () => (currentPost?.id ? tagsByPost[currentPost.id] ?? [] : []),
    [currentPost?.id, tagsByPost],
  );

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm text-slate-400">Article not found.</p>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${currentPost.slug}`
    : `https://example.com/blog/${currentPost.slug}`;

  return (
    <BlogPostView
      post={currentPost}
      categoryName={currentCategory?.name}
      tags={currentTags}
      authorName="Pharmos Online"
      previousPost={previousPost}
      nextPost={nextPost}
      relatedPosts={relatedPosts}
      shareUrl={shareUrl}
    />
  );
}