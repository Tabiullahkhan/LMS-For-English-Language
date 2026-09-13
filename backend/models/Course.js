const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true }, // YouTube unlisted link or Bunny.net link
  duration: { type: String }, // e.g. "12:30" - just for display, not calculated
  isPreview: { type: Boolean, default: false }, // free preview lesson, viewable without enrollment
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["grammar", "speaking", "writing"],
      required: true,
    },
    thumbnail: { type: String }, // image URL for the course card
    price: { type: Number, required: true }, // in PKR
    lessons: [lessonSchema],
    isPublished: { type: Boolean, default: false }, // admin can prep courses before making them live
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // which admin added it
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
