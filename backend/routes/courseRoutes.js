const express = require("express");
const router = express.Router();
const { getAllCourses, getCourseById, createCourse, updateCourse, getAllCoursesAdmin } = require("../controllers/courseController");
const { protect, adminOnly, optionalAuth } = require("../middleware/authMiddleware");

router.get("/", getAllCourses); // public
router.get("/admin/all", protect, adminOnly, getAllCoursesAdmin); // admin only - includes drafts
router.get("/:id", optionalAuth, getCourseById); // public, but access level depends on login+enrollment

router.post("/", protect, adminOnly, createCourse); // admin only
router.put("/:id", protect, adminOnly, updateCourse); // admin only

module.exports = router;
