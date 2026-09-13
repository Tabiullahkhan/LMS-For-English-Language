const RefundPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Refund Policy</h1>
      <p className="text-gray-600 text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>

      <h2 className="text-lg font-bold mt-6 mb-2">Payment Verification</h2>
      <p className="text-gray-700 text-sm">
        Since payments are made manually via EasyPaisa/JazzCash, please double-check the payment amount
        and course before uploading your screenshot. If your submission is rejected, you will see the
        reason on your dashboard and can resubmit at no extra cost.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Requesting a Refund</h2>
      <p className="text-gray-700 text-sm">
        If you believe you were charged in error, or enrolled in the wrong course, contact us within 3
        days of payment via WhatsApp or the contact details in the footer. Refunds are considered on a
        case-by-case basis and are not guaranteed once course content has been accessed.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">No Refunds After Access Granted</h2>
      <p className="text-gray-700 text-sm">
        Once your enrollment is approved and you have accessed course lessons, the purchase is generally
        considered final, except in cases of a genuine payment or enrollment error on our part.
      </p>

      <h2 className="text-lg font-bold mt-6 mb-2">Expired Access</h2>
      <p className="text-gray-700 text-sm">
        Access automatically ends 30 days after approval. This is not eligible for a refund — it reflects
        the normal, expected duration of a single course payment cycle.
      </p>
    </div>
  );
};

export default RefundPolicy;
