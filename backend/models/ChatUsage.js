const mongoose = require("mongoose");

const chatUsageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD" - simple string, easy to compare/reset daily
  count: { type: Number, default: 0 },
});

// One usage record per user per day - prevents duplicate rows and makes lookups fast
chatUsageSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("ChatUsage", chatUsageSchema);
