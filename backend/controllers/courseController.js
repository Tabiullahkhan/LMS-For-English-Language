const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// @route GET /api/courses/admin/all  (admin only)
// Unlike getAllCourses, this includes unpublished (draft) courses so admin can manage them before going live
exports.getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", details: err.message });
  }
};

// @route GET /api/courses
// Public: list all published courses. Lessons are NOT sent here - just enough to show a course card.
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select(
      "title description category thumbnail price createdAt"
    );
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", details: err.message });
  }
};

// @route GET /api/courses/:id
// Public, but lesson visibility depends on enrollment status:
// - Not logged in / not enrolled: only lessons marked isPreview:true are returned in full,
//   other lessons are listed by title only (no videoUrl) so the page can still show "what's inside"
// - Enrolled + approved + not expired: full lesson list with videoUrl
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isPublished) {
      return res.status(404).json({ error: "Course not found" });
    }

    let hasAccess = false;
    let enrollmentStatus = null; // null = never enrolled; otherwise pending/approved/rejected/expired/revoked

    // req.user is only set if the request came through optionalAuth middleware and had a valid token
    if (req.user) {
      // Get the most recent enrollment attempt for this student+course, regardless of status
      const latestEnrollment = await Enrollment.findOne({
        student: req.user._id,
        course: course._id,
      }).sort({ createdAt: -1 });

      if (latestEnrollment) {
        enrollmentStatus = latestEnrollment.status;

        if (latestEnrollment.status === "approved" && latestEnrollment.expiresAt > new Date()) {
          hasAccess = true;
        } else if (latestEnrollment.status === "approved" && latestEnrollment.expiresAt <= new Date()) {
          // lazily flip to expired the moment someone loads the page past expiry
          latestEnrollment.status = "expired";
          await latestEnrollment.save();
          enrollmentStatus = "expired";
        }
      }
    }

    const lessons = course.lessons.map((lesson) => {
      if (hasAccess || lesson.isPreview) {
        return lesson; // full lesson including videoUrl
      }
      // locked lesson - title only, no video link leaked to non-paying visitors
      return { title: lesson.title, duration: lesson.duration, isPreview: false, locked: true };
    });

    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      category: course.category,
      thumbnail: course.thumbnail,
      price: course.price,
      lessons,
      hasAccess,
      enrollmentStatus,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course", details: err.message });
  }
};

// @route POST /api/courses  (admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, thumbnail, price, lessons } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
      thumbnail,
      price,
      lessons: lessons || [],
      createdBy: req.user._id,
      isPublished: false, // admin publishes explicitly once content is ready - matches "gradual upload" requirement
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to create course", details: err.message });
  }
};

// @route PUT /api/courses/:id  (admin only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to update course", details: err.message });
  }
};
