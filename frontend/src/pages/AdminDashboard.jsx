import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import api from "../services/api";

const AdminDashboard = () => {
  const [tab, setTab] = useState("pending"); // "pending" | "active" | "courses"
  const [pending, setPending] = useState([]);
  const [active, setActive] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState(null); // which enrollment is being rejected (shows reason input)
  const [rejectionReason, setRejectionReason] = useState("");
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState(null); // object URL of the screenshot currently being viewed
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendingRes, activeRes, coursesRes] = await Promise.all([
        api.get("/enrollments/pending"),
        api.get("/enrollments/active"),
        api.get("/courses/admin/all"),
      ]);
      setPending(pendingRes.data);
      setActive(activeRes.data);
      setCourses(coursesRes.data);
    } catch (err) {
      // basic error handling for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewScreenshot = async (enrollmentId) => {
  setScreenshotLoading(true);

  try {
    const res = await api.get(`/enrollments/${enrollmentId}/screenshot`);

    setScreenshotUrl(res.data.url);
  } catch (err) {
    alert("Could not load the screenshot. Please try again.");
  } finally {
    setScreenshotLoading(false);
  }
};

  const closeScreenshotModal = () => {
    setScreenshotUrl(null);
  };

  const handleApprove = async (id) => {
    await api.put(`/enrollments/${id}/approve`);
    loadData();
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) return;
    await api.put(`/enrollments/${id}/reject`, { reason: rejectionReason });
    setRejectingId(null);
    setRejectionReason("");
    loadData();
  };

  const handleRevoke = async (id, studentName) => {
    // simple browser confirm - this is a destructive, immediate action so a confirmation step matters
    if (!window.confirm(`Revoke access for ${studentName}? They will lose access immediately.`)) return;
    await api.put(`/enrollments/${id}/revoke`);
    loadData();
  };

  const handleTogglePublish = async (course) => {
    await api.put(`/courses/${course._id}`, { isPublished: !course.isPublished });
    loadData();
  };

  if (loading) return <p className="text-center mt-10 text-warm-grey">Loading dashboard...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-6">Admin Dashboard</h1>

      <div className="flex gap-6 mb-6 border-b border-ink/10">
        <button
          onClick={() => setTab("pending")}
          className={`pb-3 font-medium text-sm transition-colors ${
            tab === "pending" ? "border-b-2 border-correction text-correction" : "text-warm-grey hover:text-white"
          }`}
        >
          Pending Payments ({pending.length})
        </button>
        <button
          onClick={() => setTab("active")}
          className={`pb-3 font-medium text-sm transition-colors ${
            tab === "active" ? "border-b-2 border-correction text-correction" : "text-warm-grey hover:text-white"
          }`}
        >
          Active Students ({active.length})
        </button>
        <button
          onClick={() => setTab("courses")}
          className={`pb-3 font-medium text-sm transition-colors ${
            tab === "courses" ? "border-b-2 border-correction text-correction" : "text-warm-grey hover:text-white"
          }`}
        >
          Manage Courses
        </button>
      </div>

      {tab === "pending" && (
        <div className="space-y-3">
          {pending.length === 0 && <p className="text-warm-grey">No pending payments to review.</p>}
          {pending.map((enrollment) => (
            <div key={enrollment._id} className="border border-ink/15 rounded-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink">
                    {enrollment.student?.name} ({enrollment.student?.email})
                  </p>
                  <p className="text-sm text-warm-grey">
                    {enrollment.course?.title} — Rs. {enrollment.course?.price}
                  </p>
                </div>
                <button
                  onClick={() => handleViewScreenshot(enrollment._id)}
                  disabled={screenshotLoading}
                  className="text-sm text-correction font-medium hover:text-correction-dark disabled:opacity-50"
                >
                  {screenshotLoading ? "Loading..." : "View Screenshot"}
                </button>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(enrollment._id)}
                  className="bg-sage text-cream px-4 py-1.5 rounded-sm text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Approve
                </button>
                <button
                  onClick={() => setRejectingId(rejectingId === enrollment._id ? null : enrollment._id)}
                  className="bg-correction text-cream px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-correction-dark transition-colors"
                >
                  Reject
                </button>
              </div>

              {rejectingId === enrollment._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Reason for rejection (shown to student)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="flex-1 border border-ink/15 rounded-sm px-3 py-1.5 text-sm bg-cream focus:outline-none focus:border-correction transition-colors"
                  />
                  <button
                    onClick={() => handleReject(enrollment._id)}
                    className="bg-correction-dark text-cream px-3 py-1.5 rounded-sm text-sm font-medium"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "active" && (
        <div className="space-y-3">
          {active.length === 0 && <p className="text-warm-grey">No active students right now.</p>}
          {active.map((enrollment) => (
            <div
              key={enrollment._id}
              className="border border-ink/15 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <p className="font-semibold text-ink">
                  {enrollment.student?.name} ({enrollment.student?.email})
                </p>
                <p className="text-sm text-warm-grey">{enrollment.course?.title}</p>
                <p className="text-xs text-warm-grey mt-1">
                  Access until {new Date(enrollment.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleRevoke(enrollment._id, enrollment.student?.name)}
                className="bg-correction text-cream px-4 py-1.5 rounded-sm text-sm font-medium hover:bg-correction-dark transition-colors"
              >
                Revoke Access
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "courses" && (
        <div>
          <button
            onClick={() => setShowCourseForm(!showCourseForm)}
            className="bg-ink text-cream px-4 py-2 rounded-sm font-medium mb-4 hover:bg-ink/85 transition-colors"
          >
            {showCourseForm ? "Cancel" : "+ Add New Course"}
          </button>

          {showCourseForm && (
            <CourseForm
              onCreated={() => {
                setShowCourseForm(false);
                loadData();
              }}
            />
          )}

          <div className="space-y-2 mt-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border border-ink/15 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-ink">{course.title}</p>
                  <p className="text-sm text-warm-grey">
                    {course.category} — Rs. {course.price} — {course.lessons.length} lessons
                  </p>
                </div>
                <button
                  onClick={() => handleTogglePublish(course)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    course.isPublished ? "bg-sage/15 text-ink" : "bg-ink/5 text-warm-grey"
                  }`}
                >
                  {course.isPublished ? "Published (click to unpublish)" : "Draft (click to publish)"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshot viewer modal - rendered via a portal directly into document.body, so it always
          overlays and centers correctly regardless of any parent container's CSS (e.g. a transform
          or overflow rule on an ancestor, which can otherwise silently break `position: fixed`). */}
      {screenshotUrl && createPortal(
        <div
          onClick={closeScreenshotModal}
          className="fixed inset-0 bg-ink/70 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-sm p-4 max-w-lg w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-3 sticky top-0 bg-cream">
              <p className="font-display text-ink">Payment Screenshot</p>
              <button onClick={closeScreenshotModal} className="text-warm-grey hover:text-ink text-lg leading-none">
                ✕
              </button>
            </div>
            <img src={screenshotUrl} alt="Payment proof" className="w-full rounded-sm object-contain" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Simple inline form for creating a new course - kept in this file since it's only used here
const CourseForm = ({ onCreated }) => {
  const [form, setForm] = useState({ title: "", description: "", category: "grammar", price: "", thumbnail: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/courses", { ...form, price: Number(form.price) });
      onCreated();
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyles =
    "w-full border border-ink/15 rounded-sm px-3 py-2 bg-cream focus:outline-none focus:border-correction transition-colors";

  return (
    <form onSubmit={handleSubmit} className="border border-ink/15 rounded-sm p-4 space-y-3 mb-4">
      <input
        type="text" placeholder="Course title" required
        value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
        className={inputStyles}
      />
      <textarea
        placeholder="Description" required
        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        className={inputStyles}
      />
      <select
        value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
        className={inputStyles}
      >
        <option value="grammar">Grammar</option>
        <option value="speaking">Speaking</option>
        <option value="writing">Writing</option>
      </select>
      <input
        type="number" placeholder="Price (PKR)" required
        value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
        className={inputStyles}
      />
      <input
        type="text" placeholder="Thumbnail image URL (optional)"
        value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
        className={inputStyles}
      />
      <p className="text-xs text-warm-grey">
        Lessons can be added after creating the course — that part comes in a later update.
      </p>
      <button
        type="submit" disabled={submitting}
        className="bg-ink text-cream px-4 py-2 rounded-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
};

export default AdminDashboard;
