const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },

    paymentScreenshot: { type: String, required: true }, // file path/URL, not publicly accessible
    paymentScreenshotPublicId: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "expired", "revoked"],
      default: "pending",
    },

    rejectionReason: { type: String }, // shown to student if status === "rejected"

    approvedAt: { type: Date },
    expiresAt: { type: Date }, // approvedAt + 30 days, set on approval

    revokedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // which admin revoked it
    revokedAt: { type: Date },

    reminderSent: { type: Boolean, default: false }, // true once the "expiring soon" email has gone out
  },
  { timestamps: true }
);

// A student shouldn't have two active enrollments for the same course at once
enrollmentSchema.index({ student: 1, course: 1 });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
