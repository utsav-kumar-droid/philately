import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
// import './PostForm.css';

const PostForm = () => {
  const { id } = useParams(); // id exists if editing
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!id) return; // creating new post

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/posts/${id}`);
        setTitle(res.data.title || '');
        setContent(res.data.content || '');
        if (res.data.image) {
          setImage(res.data.image);
          setImagePreview(res.data.image);
        }
      } catch (err) {
        console.error('Failed to load post:', err);
        toast.error('Failed to load post data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.warn('Please fill all fields');
      return;
    }

    if (title.trim().length < 3) {
      toast.warn('Title must be at least 3 characters long');
      return;
    }

    if (content.trim().length < 10) {
      toast.warn('Content must be at least 10 characters long');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      if (imageFile) {
        formData.append('image', imageFile);
        console.log('📸 Image selected:', imageFile.name);
      }

      let response;
      if (id) {
        response = await api.put(`/posts/${id}`, formData);
        console.log('✅ Post updated:', response.data);
        toast.success('✅ Post updated!');
      } else {
        response = await api.post('/posts', formData);
        console.log('✅ Post created:', response.data);
        toast.success('✅ Post created!');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Post submit failed:', err?.response?.data || err);
      toast.error(
        err?.response?.data?.message || err?.response?.data?.error ||
        err?.message ||
        '❌ Failed to save post.'
      );
    }
  };

  if (loading) return <div className="post-form-loading">⏳ Loading...</div>;

  return (
    <div className="post-form-container">
      <h2 className="post-form-title">{id ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit} className="post-form">
        {/* Image Preview */}
        {imagePreview && (
          <div className="post-image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        {/* Image Upload */}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="post-form-input"
          id="image-input"
        />
        <label htmlFor="image-input" className="post-form-label">
          📷 Choose Image (Optional)
        </label>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="post-form-input"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={8}
          className="post-form-textarea"
        />
        <button type="submit" className="post-form-button">
          {id ? 'Update Post' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default PostForm;






