const mongoose = require("mongoose");

const discourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Discourse title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    speaker: {
      type: String,
      default: "Unknown",
      trim: true,
    },
    youtubeUrl: {
      type: String,
      required: [true, "YouTube URL is required"],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now, // event/discourse date
    },
  },
  {
    timestamps: true, // auto-adds createdAt & updatedAt
    versionKey: false,
  }
);

// ✅ Index for better querying & sorting by event date
discourseSchema.index({ date: -1 });

const Discourse = mongoose.model("Discourse", discourseSchema);

module.exports = Discourse;


