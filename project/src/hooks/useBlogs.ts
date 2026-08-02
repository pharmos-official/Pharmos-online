import { useCallback, useEffect, useState } from "react";
import {
  createBlog,
  deleteBlog,
  fetchBlogs,
  publishBlog,
  unpublishBlog,
  updateBlog,
} from "../services/blogService";
import type { BlogPost } from "../types/blog";

export default function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshBlogs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchBlogs();
    setLoading(false);

    if (!error) {
      setBlogs((data ?? []) as BlogPost[]);
    }

    return { data: (data ?? []) as BlogPost[], error };
  }, []);

  useEffect(() => {
    void refreshBlogs();
  }, [refreshBlogs]);

  const addBlog = useCallback(async (blog: BlogPost) => {
    const { data, error } = await createBlog(blog);

    if (error) {
      throw new Error(error.message);
    }

    await refreshBlogs();
    return { data, error };
  }, [refreshBlogs]);

  const editBlog = useCallback(async (id: string, blog: Partial<BlogPost>) => {
    const { data, error } = await updateBlog(id, blog);

    if (error) {
      throw new Error(error.message);
    }

    await refreshBlogs();
    return { data, error };
  }, [refreshBlogs]);

  const removeBlog = useCallback(async (id: string) => {
    const { error } = await deleteBlog(id);

    if (error) {
      throw new Error(error.message);
    }

    await refreshBlogs();
    return { error };
  }, [refreshBlogs]);

  const togglePublish = useCallback(async (id: string, shouldPublish: boolean) => {
    const request = shouldPublish ? publishBlog(id) : unpublishBlog(id);
    const { data, error } = await request;

    if (error) {
      throw new Error(error.message);
    }

    await refreshBlogs();
    return { data, error };
  }, [refreshBlogs]);

  return {
    blogs,
    loading,
    refreshBlogs,
    addBlog,
    editBlog,
    removeBlog,
    togglePublish,
  };
}
