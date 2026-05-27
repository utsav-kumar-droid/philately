const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      minlength: [10, "Content must be at least 10 characters long"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    image: {
      type: String,
      default: null, // Optional image URL
      trim: true,
    },
    reactions: {
      fire: { type: Number, default: 0 },
      heart: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // auto-manage createdAt & updatedAt
    versionKey: false, // removes __v field
  }
);

// ✅ Index for faster queries by author + date
postSchema.index({ author: 1, createdAt: -1 });

// ✅ Optional: text index for search functionality
postSchema.index({ title: "text", content: "text" });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;






