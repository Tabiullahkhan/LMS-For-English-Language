import { useState } from "react";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-3">Forgot password</h1>
      <p className="text-warm-grey text-sm mb-8">
        Enter your email and we'll send you a link to reset your password.
      </p>
      {message ? (
        <p className="text-sm bg-sage/10 border border-sage/30 rounded-sm p-4 text-ink">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-sm px-4 py-2.5 bg-cream focus:outline-none focus:border-correction transition-colors"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-correction text-cream py-3 rounded-sm font-medium hover:bg-correction-dark transition-colors disabled:opacity-50"
          >
            {submitting ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
