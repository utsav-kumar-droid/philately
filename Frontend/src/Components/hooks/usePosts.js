import { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/posts");

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.posts || [];

      setPosts(data);
    } catch {
      toast.error("❌ Failed to fetch posts");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("🗑️ Post deleted");
    } catch {
      toast.error("❌ Delete failed");
    }
  };

  return { posts, loading, fetchPosts, deletePost };
};