const cron = require("node-cron");
const Enrollment = require("../models/Enrollment");

// Finds every "approved" enrollment whose expiresAt has passed, and flips it to "expired".
// This is the proactive check - it runs on a schedule regardless of whether any student
// or admin visits the site that day. The reactive check in courseController (Day 5) is a
// backup that catches anything this job hasn't gotten to yet.
const runExpiryCheck = async () => {
  try {
    const result = await Enrollment.updateMany(
      { status: "approved", expiresAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[expiry-check] Expired ${result.modifiedCount} enrollment(s)`);
    }
  } catch (err) {
    console.error("[expiry-check] Failed:", err.message);
  }
};

// Runs once a day at 2:00 AM server time - a quiet hour, unlikely to overlap with real traffic.
// Cron syntax: minute hour day month weekday -> "0 2 * * *" = every day at 02:00
const startExpiryCron = () => {
  cron.schedule("0 2 * * *", runExpiryCheck);
  console.log("Expiry check cron job scheduled (daily at 2:00 AM)");

  // Also run once immediately on server startup - covers enrollments that expired
  // while the server was offline (free-tier hosting sleeps, so this matters here).
  runExpiryCheck();
};

module.exports = startExpiryCron;
