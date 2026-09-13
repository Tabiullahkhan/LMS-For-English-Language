import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../utils/usePageTitle";

const Login = () => {
  usePageTitle("Log In");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display text-3xl mb-8">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          placeholder="Password"
          required
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
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
      <p className="text-sm text-warm-grey mt-5">
        <Link to="/forgot-password" className="text-correction hover:underline">Forgot password?</Link>
      </p>
      <p className="text-sm text-warm-grey mt-2">
        Don't have an account? <Link to="/signup" className="text-correction hover:underline">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
