import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-toastify";
// import "./EditPost.css";


const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    // 🔹 Fetch existing post data and prefill
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        const post = res.data?.post || res.data || {};

        setTitle(post.title || "");
        setContent(post.content || "");

        if (post.image) {
          const previewUrl = post.image.startsWith("http")
            ? post.image
            : `http://localhost:5000/${post.image}`;
          setImagePreview(previewUrl);
        }
      } catch (err) {
        toast.error("❌ Failed to load post");
      }
    };
    fetchPost();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      await api.put(`/posts/${id}`, formData);
      toast.success("✅ Post updated!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("❌ Update failed");
    }
  };

return (
  <div className="edit-post-container">

    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="back-btn"
    >
      ← Back
    </button>

    <form onSubmit={handleSubmit} className="edit-form">
      <h2 className="edit-post-title">✏️ Edit Post</h2>

      {imagePreview && (
        <div className="edit-image-preview">
          <img src={imagePreview} alt="Post preview" />
        </div>
      )}

      <div className="image-upload-section">
      
        <input
          id="edit-image-input"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="upload-input"
        />
      </div>

      <input
        type="text"
        className="edit-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
        required
      />

      <textarea
        className="edit-textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter post content"
        required
      />

      <button type="submit" className="save-btn">
        Update Post
      </button>
    </form>
  </div>
);
};

export default EditPost;
