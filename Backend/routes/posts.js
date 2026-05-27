const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// ===========================
// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
// ===========================
router.post("/", auth, upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: "🚫 Title and content are required.",
      });
    }

    // Get image path if file was uploaded
    const imagePath = req.file ? req.file.path : null;
    
    console.log('📸 File upload debug:', {
      hasFile: !!req.file,
      filename: req.file?.filename,
      path: imagePath,
      mimetype: req.file?.mimetype,
    });

    const newPost = new Post({
      title: title.trim(),
      content: content.trim(),
      image: imagePath,
      author: req.user._id, // user from auth middleware
    });

    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate(
      "author",
      "firstName emailId role"
    );

    console.log('✅ Post created with image:', imagePath);
    res.status(201).json({ success: true, post: populatedPost });
  } catch (err) {
    console.error("❌ Post creation error:", err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "❌ Error creating post." });
  }
});

// ===========================
// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
// ===========================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName emailId role")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error("❌ Fetch posts error:", err.message);
    res.status(500).json({ success: false, message: "❌ Error fetching posts." });
  }
});

// ===========================
// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Public
// ===========================
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "firstName emailId role")
      .lean();

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "⚠️ Post not found." });
    }

    res.status(200).json({ success: true, post });
  } catch (err) {
    console.error("❌ Fetch single post error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "❌ Error fetching the post." });
  }
});

// ===========================
// @route   PUT /api/posts/:id
// @desc    Update post (by author or admin)
// @access  Private
// ===========================
router.put("/:id", auth, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "⚠️ Post not found." });
    }

    const isOwner = post.author.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "⛔ Unauthorized to edit this post.",
      });
    }

    const { title, content } = req.body;
    if (title?.trim()) post.title = title.trim();
    if (content?.trim()) post.content = content.trim();
    
    // Update image if a new file was uploaded
    if (req.file) {
      post.image = req.file.path;
    }

    const updated = await post.save();
    const populated = await updated.populate(
      "author",
      "firstName emailId role"
    );

    res.json({ success: true, post: populated });
  } catch (err) {
    console.error("❌ Post update error:", err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: err.message });
    }
    res.status(500).json({ success: false, message: "❌ Error updating post." });
  }
});

// ===========================
// @route   DELETE /api/posts/:id
// @desc    Delete post (by admin only)
// @access  Private
// ===========================
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "⚠️ Post not found." });
    }

    // ✅ Only admins can delete (for now)
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "⛔ Only admins can delete posts.",
      });
    }

    await post.deleteOne();
    res.json({ success: true, message: "🗑️ Post deleted successfully." });
  } catch (err) {
    console.error("❌ Post deletion error:", err.message);
    res.status(500).json({ success: false, message: "❌ Error deleting post." });
  }
});

// ===========================
// @route   POST /api/posts/:id/reactions
// @desc    Add reaction to post
// @access  Public
// ===========================
router.post("/:id/reactions", async (req, res) => {
  try {
    const { type } = req.body;
    const validReactions = ['fire', 'love', 'heart', 'laugh', 'wow', 'sad'];

    if (!validReactions.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid reaction type."
      });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "⚠️ Post not found."
      });
    }

    // Initialize reactions if not present
    if (!post.reactions) {
      post.reactions = { fire: 0, love: 0, heart: 0, laugh: 0, wow: 0, sad: 0 };
    }

    // Increment reaction count
    post.reactions[type] = (post.reactions[type] || 0) + 1;

    const updated = await post.save();
    const populated = await updated.populate("author", "firstName emailId role");

    res.json({ success: true, message: "👍 Reaction added!", post: populated });
  } catch (err) {
    console.error("❌ Reaction error:", err.message);
    res.status(500).json({ success: false, message: "❌ Error adding reaction." });
  }
});

module.exports = router;


