import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import usePageTitle from "../utils/usePageTitle";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  usePageTitle(course?.title); // updates once the course data loads, falls back to the default title until then

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data);
      } catch (err) {
        setError("Course not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <p className="max-w-3xl mx-auto px-6 py-16 text-warm-grey">Loading...</p>;
  if (error) return <p className="max-w-3xl mx-auto px-6 py-16 text-correction">{error}</p>;
  if (!course) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
      <p className="flex items-center gap-1.5 text-sm text-sage font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
        {course.category}
      </p>
      <h1 className="font-display text-3xl sm:text-4xl mt-2">{course.title}</h1>
      <p className="text-warm-grey mt-4 leading-relaxed max-w-xl">{course.description}</p>

      {!course.hasAccess && (
        <div className="mt-8">
          {course.enrollmentStatus === "revoked" && (
            <div className="mb-3 p-4 border-l-2 border-correction bg-correction/5 text-ink text-sm font-medium">
              Your access was revoked by admin.
            </div>
          )}
          {course.enrollmentStatus === "rejected" && (
            <div className="mb-3 p-4 border-l-2 border-correction bg-correction/5 text-ink text-sm">
              Your last payment was rejected. You can submit a new payment below.
            </div>
          )}
          {course.enrollmentStatus === "expired" && (
            <div className="mb-3 p-4 border-l-2 border-sage bg-sage/5 text-ink text-sm font-medium">
              Your access has expired. Renew below to continue.
            </div>
          )}
          {course.enrollmentStatus === "pending" ? (
            <div className="p-5 border border-ink/10 text-warm-grey text-sm">
              Your payment is under review. You'll get access once it's approved.
            </div>
          ) : (
            <div className="p-5 border border-ink/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-display text-2xl">Rs. {course.price}<span className="text-sm text-warm-grey font-body"> / month</span></p>
                <p className="text-sm text-warm-grey mt-1">Pay via EasyPaisa or JazzCash to enroll</p>
              </div>
              <button
                onClick={() => navigate(`/enroll/${course._id}`)}
                className="bg-correction text-cream px-6 py-2.5 rounded-sm font-medium hover:bg-correction-dark transition-colors whitespace-nowrap"
              >
                {course.enrollmentStatus ? "Renew" : "Enroll now"}
              </button>
            </div>
          )}
        </div>
      )}

      <h2 className="font-display text-xl mt-12 mb-4">Course content</h2>
      <div className="border-t border-ink/10">
        {course.lessons.length === 0 && (
          <p className="py-5 text-warm-grey text-sm">Lessons will be added soon.</p>
        )}
        {course.lessons.map((lesson, index) => (
          <div key={index} className="py-4 border-b border-ink/10 flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-3 min-w-0">
              <span className="text-warm-grey text-sm font-display flex-shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <p className="font-medium truncate">{lesson.title}</p>
                {lesson.duration && <p className="text-xs text-warm-grey">{lesson.duration}</p>}
              </div>
            </div>
            {lesson.locked ? (
              <span className="text-xs text-warm-grey border border-ink/10 px-2.5 py-1 rounded-sm flex-shrink-0">
                Locked
              </span>
            ) : (
              <a
                href={lesson.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-correction font-medium hover:underline flex-shrink-0"
              >
                {lesson.isPreview ? "Preview" : "Watch"}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
