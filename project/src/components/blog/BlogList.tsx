import type { BlogPost } from "../../types/blog";

interface BlogListProps {
  posts: BlogPost[];
  categories: Record<string, { name: string; slug: string }>;
  tagsByPost: Record<string, Array<{ name: string; slug: string }>>;
}

export default function BlogList({ posts, categories, tagsByPost }: BlogListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => {
        const category = post.category_id ? categories[post.category_id] : null;
        const tags = tagsByPost[post.id ?? ""] ?? [];

        return (
          <article key={post.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-sky-700">Published</span>
              {post.reading_time ? <span className="text-xs font-semibold text-slate-500">{post.reading_time} min read</span> : null}
            </div>

            {post.featured_image_url ? (
              <img src={post.featured_image_url} alt={post.title} className="mb-4 h-48 w-full rounded-xl object-cover" />
            ) : null}

            {category ? <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{category.name}</p> : null}
            <h2 className="text-xl font-bold text-slate-900">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{post.excerpt ?? "Read the latest article from Pharmos online."}</p>

            {tags.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={`${post.id}-${tag.slug}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                    #{tag.name}
                  </span>
                ))}
              </div>
            ) : null}

            <a href={`/blog/${post.slug}`} className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
              Read article
            </a>
          </article>
        );
      })}
    </div>
  );
}
