import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import usePageTitle from "../utils/usePageTitle";

const CourseList = () => {
  usePageTitle("English Grammar, Speaking & Writing Courses");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (err) {
        setError("Could not load courses. Please try again shortly.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      {/* Hero: the signature moment - a sentence with a correction mark, the most
          characteristic image in an English teacher's world. Not a generic gradient. */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <p className="text-warm-grey text-sm mb-4 font-body">Grammar &middot; Speaking &middot; Writing</p>
        <h1 className="font-display text-4xl sm:text-6xl leading-tight max-w-2xl text-ink dark:text-cream">
          Learn to write and speak{" "}
          <span className="relative inline-block">
            english
            <svg
              className="absolute left-0 -bottom-1 w-full"
              height="10"
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
            >
              <path
                d="M2 7 Q 50 2, 100 6 T 198 5"
                fill="none"
                stroke="#C1442D"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          with confidence.
        </h1>
        <p className="text-warm-grey mt-6 max-w-md text-base leading-relaxed">
          Structured courses taught by an experienced instructor, with a tutor bot on hand
          whenever you're stuck.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        {loading && <p className="text-warm-grey">Loading courses...</p>}
        {error && <p className="text-correction">{error}</p>}

        {!loading && !error && courses.length === 0 && (
          <p className="text-warm-grey">No courses available yet. Check back soon.</p>
        )}

        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-ink/10 dark:bg-cream/10 border border-ink/10 dark:border-cream/10">
            {courses.map((course) => (
              <Link
                to={`/courses/${course._id}`}
                key={course._id}
                className="bg-cream dark:bg-ink p-6 hover:bg-ink/[0.03] dark:hover:bg-cream/[0.03] transition-colors group"
              >
                <p className="flex items-center gap-1.5 text-sm text-sage font-medium mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
                  {course.category}
                </p>
                <h2 className="font-display text-xl mb-2 text-ink dark:text-cream group-hover:text-correction transition-colors">
                  {course.title}
                </h2>
                <p className="text-sm text-warm-grey leading-relaxed line-clamp-2 mb-4">
                  {course.description}
                </p>
                <p className="font-display text-lg text-ink dark:text-cream">Rs. {course.price}<span className="text-sm text-warm-grey font-body"> / month</span></p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CourseList;
