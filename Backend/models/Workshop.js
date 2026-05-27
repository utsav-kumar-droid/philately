const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Workshop title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Workshop description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
    },
    image: {
      type: String,
      trim: true,
      default: "https://via.placeholder.com/400x300", // fallback image
    },
    date: {
      type: Date,
      default: Date.now, // optional event date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin/user who created it
      required: false, // ✅ made optional to avoid breaking AdminPanel prompt-based create
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    versionKey: false,
  }
);

// ✅ Index for better sorting/filtering by creation date
workshopSchema.index({ createdAt: -1 });

const Workshop = mongoose.model("Workshop", workshopSchema);

module.exports = Workshop;


