import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const Enroll = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Please select a screenshot of your payment.");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("screenshot", file);
      await api.post(`/enrollments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl mb-3">Payment submitted</h1>
        <p className="text-warm-grey mb-8 leading-relaxed">
          Your screenshot is under review. You'll get access once it's approved.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-correction text-cream px-6 py-3 font-medium hover:bg-correction-dark transition-colors"
        >
          Go to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Confirm Your Payment</h1>
      <p className="text-warm-grey mb-8 leading-relaxed">
        Pay via EasyPaisa or JazzCash, then upload a screenshot of the transaction.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-line p-6 text-center">
          {preview ? (
            <img src={preview} alt="Payment screenshot preview" className="max-h-64 mx-auto" />
          ) : (
            <p className="text-warm-grey text-sm">No screenshot selected yet</p>
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="mt-4 text-sm text-warm-grey"
          />
        </div>

        {error && <p className="text-correction text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-correction text-cream py-3 font-medium hover:bg-correction-dark transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Payment Proof"}
        </button>
      </form>
    </div>
  );
};

export default Enroll;
