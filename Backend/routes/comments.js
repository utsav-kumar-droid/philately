// routes/comments.js
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Comment = require('../models/Comment');

router.get('/:postId', async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate('author', 'firstName')
    .sort({ createdAt: -1 });
  res.json(comments);
});

router.post('/:postId', protect, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: '❌ Comment text is required'
      });
    }
    
    const comment = await Comment.create({
      text: text.trim(),
      post: req.params.postId,
      author: req.user._id,
    });
    
    // Populate author details before sending
    const populatedComment = await comment.populate('author', 'firstName emailId');
    
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error('❌ Error creating comment:', err);
    res.status(500).json({
      success: false,
      message: '❌ Failed to create comment'
    });
  }
});

module.exports = router;
