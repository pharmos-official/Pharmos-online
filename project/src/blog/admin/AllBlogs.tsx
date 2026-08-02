import type { BlogPost } from "../../types/blog";

interface AllBlogsProps {
  blogs: BlogPost[];
  onEdit: (blog: BlogPost) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, shouldPublish: boolean) => void;
}

export default function AllBlogs({ blogs, onEdit, onDelete, onTogglePublish }: AllBlogsProps) {
  return (
    <div className="space-y-3">
      {blogs.map((blog) => (
        <div key={blog.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{blog.title}</h3>
              <p className="text-sm text-slate-500">/{blog.slug}</p>
              <p className="text-xs text-slate-500">Status: {blog.status}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onEdit(blog)}
                className="rounded-lg bg-sky-700 px-3 py-2 text-xs font-semibold text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onTogglePublish(blog.id ?? "", blog.status !== "published")}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white"
              >
                {blog.status === "published" ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => onDelete(blog.id ?? "")}
                className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
