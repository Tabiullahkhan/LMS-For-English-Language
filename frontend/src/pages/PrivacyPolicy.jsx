const PrivacyPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-600 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-lg font-bold mt-6 mb-2">What We Collect</h2>
      <p className="text-gray-700 text-sm">
        We collect your name, email address, password (stored securely, never in plain text), and the
        payment screenshots you upload to verify enrollment.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">How We Use It</h2>
      <p className="text-gray-700 text-sm">
        Your information is used to manage your account, verify course payments, send you enrollment and
        expiry notifications by email, and provide access to the chatbot and course content.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Payment Screenshots</h2>
      <p className="text-gray-700 text-sm">
        Screenshots are stored securely and are only accessible to administrators reviewing your
        enrollment. They are not shared with any third party.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Chatbot Questions</h2>
      <p className="text-gray-700 text-sm">
        Questions asked to the chatbot may be processed by Google's Gemini API to generate responses, and
        common questions may be cached to improve response speed for future students.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Your Data</h2>
      <p className="text-gray-700 text-sm">
        You may request deletion of your account and associated data by contacting us via the details in
        the footer.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
