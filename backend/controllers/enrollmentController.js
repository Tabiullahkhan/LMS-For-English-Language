const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const cloudinary = require("../config/cloudinary");
const sendEmail = require("../utils/mailer");

// @route POST /api/enrollments/:courseId
// Student submits a payment screenshot to enroll in a course
exports.submitEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Payment screenshot is required" });
    }

    // Block a second pending/approved submission for the same course - avoids duplicate spam submissions
    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
      status: { $in: ["pending", "approved"] },
    });
    if (existing) {
      return res.status(400).json({
        error:
          existing.status === "pending"
            ? "You already have a submission under review for this course"
            : "You already have active access to this course",
      });
    }

 const uploadResult = await new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: "course-platform/payments",
      resource_type: "image",
    },
    (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }
  );

  stream.end(req.file.buffer);
});

const enrollment = await Enrollment.create({
  student: req.user._id,
  course: courseId,
  paymentScreenshot: uploadResult.secure_url,
  paymentScreenshotPublicId: uploadResult.public_id,
  status: "pending",
});

    res.status(201).json({
      message: "Payment submitted. You'll get access once admin approves it.",
      enrollment,
    });
  } catch (err) {
    res.status(500).json({ error: "Submission failed", details: err.message });
  }
};

// @route GET /api/enrollments/my
// Student: see all of their own enrollment attempts and statuses
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course", "title thumbnail price")
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch enrollments", details: err.message });
  }
};

// @route GET /api/enrollments/active  (admin only)
// Lists all currently-approved (non-expired) enrollments, so admin can find and revoke any student
exports.getActiveEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      status: "approved",
      expiresAt: { $gt: new Date() },
    })
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ expiresAt: 1 }); // soonest-to-expire first - useful for admin to see who's about to lapse
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active enrollments", details: err.message });
  }
};

// @route GET /api/enrollments/pending  (admin only)
exports.getPendingEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: "pending" })
      .populate("student", "name email")
      .populate("course", "title price")
      .sort({ createdAt: 1 }); // oldest first - fair review order
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pending enrollments", details: err.message });
  }
};

// @route PUT /api/enrollments/:id/approve  (admin only)
exports.approveEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title");
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });

    enrollment.status = "approved";
    enrollment.approvedAt = new Date();
    enrollment.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    await enrollment.save();

    sendEmail({
      to: enrollment.student.email,
      subject: `You're enrolled in "${enrollment.course.title}"`,
      html: `<p>Hi ${enrollment.student.name},</p><p>Your payment was approved. You now have access to <strong>${enrollment.course.title}</strong> for the next 30 days.</p>`,
    }); // fire-and-forget - don't make the admin wait on email delivery

    res.json({ message: "Enrollment approved", enrollment });
  } catch (err) {
    res.status(500).json({ error: "Approval failed", details: err.message });
  }
};

// @route PUT /api/enrollments/:id/reject  (admin only)
exports.rejectEnrollment = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: "A rejection reason is required" });
    }

    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title");
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });

    enrollment.status = "rejected";
    enrollment.rejectionReason = reason;
    await enrollment.save();

    sendEmail({
      to: enrollment.student.email,
      subject: `Update on your payment for "${enrollment.course.title}"`,
      html: `<p>Hi ${enrollment.student.name},</p><p>Your payment submission was not approved.</p><p><strong>Reason:</strong> ${reason}</p><p>You can submit a new payment screenshot anytime from the course page.</p>`,
    });

    res.json({ message: "Enrollment rejected", enrollment });
  } catch (err) {
    res.status(500).json({ error: "Rejection failed", details: err.message });
  }
};

// @route GET /api/enrollments/:id/screenshot  (admin only)
// Serves the payment screenshot file directly - this is the ONLY way to view it,
// since the /uploads folder itself is not exposed as a public static route.
exports.getPaymentScreenshot = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    if (!enrollment.paymentScreenshot) {
      return res.status(404).json({ error: "Screenshot not found" });
    }

    res.json({
      url: enrollment.paymentScreenshot,
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to load screenshot",
      details: err.message,
    });
  }
};
exports.revokeEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title");
    if (!enrollment) return res.status(404).json({ error: "Enrollment not found" });

    enrollment.status = "revoked";
    enrollment.revokedBy = req.user._id;
    enrollment.revokedAt = new Date();
    await enrollment.save();

    sendEmail({
      to: enrollment.student.email,
      subject: `Your access to "${enrollment.course.title}" was revoked`,
      html: `<p>Hi ${enrollment.student.name},</p><p>Your access to <strong>${enrollment.course.title}</strong> was revoked by admin.</p>`,
    });

    res.json({ message: "Access revoked", enrollment });
  } catch (err) {
    res.status(500).json({ error: "Revoke failed", details: err.message });
  }
};
