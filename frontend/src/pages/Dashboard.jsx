import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import usePageTitle from "../utils/usePageTitle";

const statusLabels = {
  pending: { text: "Under review", color: "bg-sage/15 text-ink" },
  approved: { text: "Active", color: "bg-sage/20 text-ink" },
  rejected: { text: "Rejected", color: "bg-correction/10 text-correction" },
  expired: { text: "Expired", color: "bg-ink/5 text-warm-grey" },
  revoked: { text: "Access revoked by admin", color: "bg-correction/10 text-correction" },
};

const daysUntil = (dateString) => {
  const diffMs = new Date(dateString) - new Date();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
};

const Dashboard = () => {
  usePageTitle("My Courses");
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await api.get("/enrollments/my");
        setEnrollments(res.data);
      } catch (err) {
        // fail quietly for now
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-16 text-warm-grey">Loading your courses...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-8">My Courses</h1>

      {enrollments.length === 0 ? (
        <p className="text-warm-grey">
          You haven't enrolled in any courses yet.{" "}
          <Link to="/" className="text-correction underline underline-offset-2 hover:text-correction-dark">Browse courses</Link>
        </p>
      ) : (
        <div className="space-y-px bg-ink/10 border border-ink/10">
          {enrollments.map((enrollment) => {
            const statusInfo = statusLabels[enrollment.status];
            const daysLeft = enrollment.status === "approved" ? daysUntil(enrollment.expiresAt) : null;
            const isExpiringSoon = daysLeft !== null && daysLeft <= 3;

            return (
              <div key={enrollment._id} className="bg-cream p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg">{enrollment.course?.title}</p>
                    {enrollment.status === "rejected" && enrollment.rejectionReason && (
                      <p className="text-sm text-correction mt-1">Reason: {enrollment.rejectionReason}</p>
                    )}
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 whitespace-nowrap ${statusInfo.color}`}>
                    {statusInfo.text}
                  </span>
                </div>

                {enrollment.status === "approved" && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className={`text-sm ${isExpiringSoon ? "text-correction font-medium" : "text-warm-grey"}`}>
                      {daysLeft === 0 ? "Expires today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}
                    </p>
                    {isExpiringSoon && (
                      <Link
                        to={`/courses/${enrollment.course?._id}`}
                        className="text-sm bg-correction text-cream px-3 py-1.5 font-medium hover:bg-correction-dark"
                      >
                        Renew Now
                      </Link>
                    )}
                  </div>
                )}

                {(enrollment.status === "expired" || enrollment.status === "revoked" || enrollment.status === "rejected") && (
                  <div className="mt-3">
                    <Link
                      to={`/courses/${enrollment.course?._id}`}
                      className="text-sm text-correction underline underline-offset-2 hover:text-correction-dark"
                    >
                      {enrollment.status === "rejected" ? "Try again" : "Renew / Re-enroll"}
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
