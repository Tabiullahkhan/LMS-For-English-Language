const express = require("express");
const router = express.Router();
const {
  submitEnrollment,
  getMyEnrollments,
  getPendingEnrollments,
  getActiveEnrollments,
  approveEnrollment,
  rejectEnrollment,
  revokeEnrollment,
  getPaymentScreenshot,
} = require("../controllers/enrollmentController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../config/upload");

// Student routes
router.post("/:courseId", protect, upload.single("screenshot"), submitEnrollment);
router.get("/my", protect, getMyEnrollments);

// Admin routes
router.get("/pending", protect, adminOnly, getPendingEnrollments);
router.get("/active", protect, adminOnly, getActiveEnrollments);
router.get("/:id/screenshot", protect, adminOnly, getPaymentScreenshot);
router.put("/:id/approve", protect, adminOnly, approveEnrollment);
router.put("/:id/reject", protect, adminOnly, rejectEnrollment);
router.put("/:id/revoke", protect, adminOnly, revokeEnrollment);

module.exports = router;
