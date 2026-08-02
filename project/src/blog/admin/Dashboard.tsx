import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Folder,
  LayoutGrid,
  PencilLine,
  Plus,
  RefreshCcw,
  Rocket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useBlogs from "../../hooks/useBlogs";
import { signOut } from "../../lib/auth";
import { fetchBlogCategories } from "../../services/blogService";
import type { BlogPost } from "../../types/blog";
import AllBlogs from "./AllBlogs";
import EditBlog from "./EditBlog";
import NewBlog from "./NewBlog";

export default function Dashboard() {
  const navigate = useNavigate();
  const { blogs, addBlog, editBlog, removeBlog, togglePublish } = useBlogs();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await fetchBlogCategories();
      setCategoryCount((data ?? []).length);
    };

    void loadCategories();
  }, []);

  const stats = useMemo(() => {
    const totalBlogs = blogs.length;
    const published = blogs.filter((blog) => blog.status === "published").length;
    const drafts = blogs.filter((blog) => blog.status === "draft").length;
    const estimatedViews = blogs.reduce((sum, blog) => sum + (blog.reading_time ?? 0) * 28, 0);

    return {
      totalBlogs,
      published,
      drafts,
      categories: categoryCount,
      views: estimatedViews,
    };
  }, [blogs, categoryCount]);

  const recentBlogs = useMemo(() => {
    return [...blogs]
      .sort((left, right) => {
        const leftDate = new Date(left.updated_at ?? left.created_at ?? Date.now().toString()).getTime();
        const rightDate = new Date(right.updated_at ?? right.created_at ?? Date.now().toString()).getTime();
        return rightDate - leftDate;
      })
      .slice(0, 4);
  }, [blogs]);

  const latestActivity = useMemo(() => {
    return [...blogs]
      .sort((left, right) => {
        const leftDate = new Date(left.updated_at ?? left.created_at ?? Date.now().toString()).getTime();
        const rightDate = new Date(right.updated_at ?? right.created_at ?? Date.now().toString()).getTime();
        return rightDate - leftDate;
      })
      .slice(0, 5)
      .map((blog) => ({
        title: blog.title,
        status: blog.status,
        time: blog.updated_at ?? blog.created_at ?? "Just now",
      }));
  }, [blogs]);

  const hasBlogs = useMemo(() => blogs.length > 0, [blogs.length]);

  const handleLogout = async () => {
    const { error } = await signOut();

    if (error) {
      console.error(error.message);
      return;
    }

    navigate("/admin", { replace: true });
  };

  const handleCreate = async (payload: BlogPost) => {
    await addBlog(payload);
    setSelectedBlog(null);
  };

  const handleEdit = async (id: string, payload: Partial<BlogPost>) => {
    await editBlog(id, payload);
    setSelectedBlog(null);
  };

  const handleDelete = async (id: string) => {
    await removeBlog(id);
  };

  const handleTogglePublish = async (id: string, shouldPublish: boolean) => {
    await togglePublish(id, shouldPublish);
  };

  const statCards = [
    {
      label: "Total Blogs",
      value: stats.totalBlogs,
      icon: FileText,
      accent: "bg-sky-100 text-sky-700",
    },
    {
      label: "Published",
      value: stats.published,
      icon: CheckCircle2,
      accent: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Drafts",
      value: stats.drafts,
      icon: Clock3,
      accent: "bg-amber-100 text-amber-700",
    },
    {
      label: "Categories",
      value: stats.categories,
      icon: Folder,
      accent: "bg-violet-100 text-violet-700",
    },
    {
      label: "Views",
      value: stats.views,
      icon: Eye,
      accent: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl bg-white p-5 shadow-lg md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">Pharmos CMS</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-slate-600 md:text-base">Create, edit, publish, manage categories, and monitor post momentum across your blog.</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedBlog(null)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                New draft
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{card.label}</p>
                    <p className="mt-3 text-2xl font-bold text-slate-900">{card.value}</p>
                  </div>
                  <div className={`rounded-2xl p-3 ${card.accent}`}>
                    <Icon size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                  <Plus size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Create Blog</h2>
              </div>
              <NewBlog onSubmit={handleCreate} />
            </div>

            {selectedBlog ? (
              <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                    <PencilLine size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Edit Blog</h2>
                </div>
                <EditBlog blog={selectedBlog} onSubmit={handleEdit} />
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700">
                  <Rocket size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
              </div>

              <div className="grid gap-3">
                <button type="button" onClick={() => setSelectedBlog(null)} className="rounded-xl bg-slate-900 px-4 py-3 text-left text-sm font-semibold text-white">
                  Create a new blog post
                </button>
                <button type="button" onClick={() => window.location.assign("/blog")} className="rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  View public blog listing
                </button>
                <button type="button" onClick={() => window.location.assign("/admin/dashboard")} className="rounded-xl border border-slate-300 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                  Refresh dashboard metrics
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
                  <Clock3 size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Latest Activity</h2>
              </div>

              <div className="space-y-3">
                {latestActivity.map((entry) => (
                  <div key={`${entry.title}-${entry.time}`} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="mt-0.5 rounded-full bg-white p-1 text-slate-500">
                      <RefreshCcw size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
                      <p className="text-xs text-slate-500">{entry.status} • {new Date(entry.time).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
                  <LayoutGrid size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Recent Blogs</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{recentBlogs.length}</span>
            </div>

            <div className="space-y-3">
              {recentBlogs.map((blog) => (
                <div key={blog.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{blog.title}</p>
                    <p className="text-xs text-slate-500">{blog.status} • {new Date(blog.updated_at ?? blog.created_at ?? Date.now().toString()).toLocaleDateString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBlog(blog)}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm md:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-violet-100 p-2 text-violet-700">
                  <Folder size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">All Blogs</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{blogs.length}</span>
            </div>

            {hasBlogs ? (
              <AllBlogs
                blogs={blogs}
                onEdit={setSelectedBlog}
                onDelete={handleDelete}
                onTogglePublish={handleTogglePublish}
              />
            ) : (
              <p className="text-sm text-slate-500">No blogs yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
