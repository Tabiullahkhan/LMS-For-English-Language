import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../utils/usePageTitle";

const Signup = () => {
  usePageTitle("Sign Up");
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-8">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-4 py-2.5 bg-cream focus:outline-none focus:border-correction transition-colors"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-4 py-2.5 bg-cream focus:outline-none focus:border-correction transition-colors"
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/15 rounded-sm px-4 py-2.5 bg-cream focus:outline-none focus:border-correction transition-colors"
        />
        {error && <p className="text-correction text-sm">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-correction text-cream py-3 rounded-sm font-medium hover:bg-correction-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
      <p className="text-sm text-warm-grey mt-5">
        Already have an account? <Link to="/login" className="text-correction hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
