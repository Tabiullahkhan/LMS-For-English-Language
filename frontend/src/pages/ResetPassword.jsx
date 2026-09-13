import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed. The link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-8">Set a new password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="New password (min 6 characters)"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-ink/15 rounded-sm px-4 py-2.5 bg-cream focus:outline-none focus:border-correction transition-colors"
        />
        {error && <p className="text-correction text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-correction text-cream py-3 rounded-sm font-medium hover:bg-correction-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
