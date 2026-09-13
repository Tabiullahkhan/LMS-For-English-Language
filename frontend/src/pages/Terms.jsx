const Terms = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 prose">
      <h1 className="text-2xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-600 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-lg font-bold mt-6 mb-2">1. Enrollment & Access</h2>
      <p className="text-gray-700 text-sm">
        Course access is granted for 30 days from the date your payment is approved. Access must be
        renewed after 30 days to continue viewing course content. We reserve the right to suspend or
        revoke access at our discretion, including for suspected misuse or sharing of account credentials.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">2. Payments</h2>
      <p className="text-gray-700 text-sm">
        Payments are made via EasyPaisa or JazzCash directly to the instructor. After payment, you must
        upload a screenshot as proof; access is granted once this is manually verified by an administrator.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">3. Acceptable Use</h2>
      <p className="text-gray-700 text-sm">
        Course content, videos, and materials are for your personal use only. Sharing your account,
        downloading and redistributing videos, or reselling access to course content is prohibited.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">4. Chatbot Usage</h2>
      <p className="text-gray-700 text-sm">
        The English tutor chatbot is provided as a learning aid and is limited to a daily number of
        questions per student. Responses are AI-generated and may occasionally be inaccurate; use your
        judgment and consult your instructor for anything critical.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">5. Changes</h2>
      <p className="text-gray-700 text-sm">
        These terms may be updated from time to time. Continued use of the platform after changes means
        you accept the updated terms.
      </p>
    </div>
  );
};

export default Terms;
