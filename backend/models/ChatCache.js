const mongoose = require("mongoose");

const chatCacheSchema = new mongoose.Schema(
  {
    // The question, normalized (lowercased, trimmed, extra spaces collapsed) so
    // "What's the difference between affect and effect?" and "what is the difference
    // between affect and effect" both hit the same cache entry.
    normalizedQuestion: { type: String, required: true, unique: true, index: true },
    answer: { type: String, required: true },
    hitCount: { type: Number, default: 1 }, // how many times this cached answer has been reused
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatCache", chatCacheSchema);
