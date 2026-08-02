import { useEffect, useMemo, useState } from "react";
import BlogList from "../components/blog/BlogList";
import {
  fetchBlogCategories,
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

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [tagRelations, setTagRelations] = useState<TagRelationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [page, setPage] = useState(1);

  const pageSize = 6;

  useEffect(() => {
    const loadBlogPage = async () => {
      const [postsResult, categoriesResult, tagsResult] = await Promise.all([
        fetchPublishedBlogs(),
        fetchBlogCategories(),
        fetchBlogTagRelations(),
      ]);

      const fetchedPosts = (postsResult.data ?? []) as BlogPost[];
      const fetchedCategories = (categoriesResult.data ?? []) as CategoryRecord[];
      const fetchedTagRelations = (tagsResult.data ?? []) as TagRelationRecord[];

      setPosts(fetchedPosts);
      setCategories(fetchedCategories);
      setTagRelations(fetchedTagRelations);
      setLoading(false);
    };

    void loadBlogPage();
  }, []);

  const categoriesById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories],
  );

  const tagsByPost = useMemo(() => {
    return tagRelations.reduce<Record<string, Array<TagRecord>>>((accumulator, relation) => {
      if (!relation.blog_id) {
        return accumulator;
      }

      const normalized = normalizeTags(relation.tags);
      if (normalized.length === 0) {
        return accumulator;
      }

      const existing = accumulator[relation.blog_id] ?? [];
      accumulator[relation.blog_id] = [...existing, ...normalized];
      return accumulator;
    }, {});
  }, [tagRelations]);

  const allTags = useMemo(() => {
    return Array.from(
      new Map(
        Object.values(tagsByPost)
          .flat()
          .map((tag) => [tag.slug, tag]),
      ).values(),
    );
  }, [tagsByPost]);

  const filteredPosts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return [...posts]
      .filter((post) => {
        const matchesSearch = !query || [post.title, post.excerpt ?? "", post.content, post.slug]
          .join(" ")
          .toLowerCase()
          .includes(query);

        const matchesCategory = !selectedCategory || post.category_id === selectedCategory;
        const postTags = tagsByPost[post.id ?? ""] ?? [];
        const matchesTag = !selectedTag || postTags.some((tag) => tag.slug === selectedTag);

        return matchesSearch && matchesCategory && matchesTag;
      })
      .sort((left, right) => {
        const leftDate = new Date(left.published_at ?? left.created_at ?? Date.now().toString()).getTime();
        const rightDate = new Date(right.published_at ?? right.created_at ?? Date.now().toString()).getTime();
        return rightDate - leftDate;
      });
  }, [posts, searchTerm, selectedCategory, selectedTag, tagsByPost]);

  const featuredPosts = useMemo(() => {
    return filteredPosts.filter((post) => Boolean(post.featured_image_url)).slice(0, 3);
  }, [filteredPosts]);

  const latestPosts = useMemo(() => {
    return filteredPosts.slice(0, 3);
  }, [filteredPosts]);

  const popularPosts = useMemo(() => {
    return [...filteredPosts]
      .sort((left, right) => (right.reading_time ?? 0) - (left.reading_time ?? 0))
      .slice(0, 3);
  }, [filteredPosts]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedPosts = filteredPosts.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, selectedTag]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">Insights</p>
          <h1 className="text-3xl font-bold text-slate-900 md:text-5xl">Latest articles</h1>
          <p className="max-w-2xl text-slate-600">Discover healthcare insights, product updates, and expert-led content from Pharmos online.</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Search</label>
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title, excerpt, or content"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-900">Tags</h2>
            {selectedTag ? (
              <button type="button" onClick={() => setSelectedTag("")} className="text-xs font-semibold text-sky-700">
                Clear tag
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag.slug}
                type="button"
                onClick={() => setSelectedTag(tag.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedTag === tag.slug ? "bg-sky-700 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Featured Posts</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{featuredPosts.length}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {featuredPosts.map((post) => (
                <article key={post.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {post.featured_image_url ? (
                    <img src={post.featured_image_url} alt={post.title} className="mb-3 h-40 w-full rounded-xl object-cover" />
                  ) : null}
                  <h3 className="font-bold text-slate-900">{post.title}</h3>
                  <a href={`/blog/${post.slug}`} className="mt-3 inline-flex text-sm font-semibold text-sky-700">Read now</a>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
              <h2 className="mb-3 text-lg font-bold text-slate-900">Latest Posts</h2>
              <div className="space-y-3">
                {latestPosts.map((post) => (
                  <a key={post.id} href={`/blog/${post.slug}`} className="block rounded-xl bg-slate-50 p-3 hover:bg-sky-50">
                    <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{post.reading_time ?? 0} min read</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
              <h2 className="mb-3 text-lg font-bold text-slate-900">Popular Posts</h2>
              <div className="space-y-3">
                {popularPosts.map((post) => (
                  <a key={post.id} href={`/blog/${post.slug}`} className="block rounded-xl bg-slate-50 p-3 hover:bg-sky-50">
                    <p className="text-sm font-semibold text-slate-900">{post.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{post.reading_time ?? 0} min read</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Article Index</h2>
            <span className="text-sm text-slate-500">{filteredPosts.length} results</span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading blog posts...</p>
          ) : (
            <>
              <BlogList posts={paginatedPosts} categories={categoriesById} tagsByPost={tagsByPost} />

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage === 1}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600">
                  Page {safePage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
