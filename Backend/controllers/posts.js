const Post = require('../models/Post');

// ===========================
// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
// ===========================
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'firstName emailId role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, posts });
  } catch (err) {
    console.error('❌ Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Server error fetching posts' });
  }
};

// ===========================
// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
// ===========================
exports.createPost = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ success: false, message: '🚫 Title and content required' });
    }

    const post = await Post.create({
      title: title.trim(),
      content: content.trim(),
      image: image || null,
      author: req.user._id,
    });

    const populated = await post.populate('author', 'firstName emailId role');
    res.status(201).json({ success: true, message: '✅ Post created', post: populated });
  } catch (err) {
    console.error('❌ Error creating post:', err);
    res.status(500).json({ success: false, message: 'Server error creating post' });
  }
};

// ===========================
// @desc    Update post (by author or admin)
// @route   PUT /api/posts/:id
// @access  Private
// ===========================
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: '⚠️ Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: '⛔ Not authorized to update' });
    }

    if (req.body.title) post.title = req.body.title.trim();
    if (req.body.content) post.content = req.body.content.trim();
    if (req.body.image !== undefined) post.image = req.body.image;

    const updated = await post.save();
    const populated = await updated.populate('author', 'firstName emailId role');

    res.status(200).json({ success: true, message: '✏️ Post updated', post: populated });
  } catch (err) {
    console.error('❌ Error updating post:', err);
    res.status(500).json({ success: false, message: 'Server error updating post' });
  }
};

// ===========================
// @desc    Delete post (admin only)
// @route   DELETE /api/posts/:id
// @access  Private
// ===========================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: '⚠️ Post not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: '⛔ Only admins can delete posts' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: '🗑️ Post deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting post:', err);
    res.status(500).json({ success: false, message: 'Server error deleting post' });
  }
};

