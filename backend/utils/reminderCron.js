const cron = require("node-cron");
const Enrollment = require("../models/Enrollment");
const sendEmail = require("./mailer");

// Finds approved enrollments expiring within the next 3 days that haven't been reminded yet,
// emails the student, and marks reminderSent so they don't get the same email daily.
const runReminderCheck = async () => {
  try {
    const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const enrollments = await Enrollment.find({
      status: "approved",
      reminderSent: false,
      expiresAt: { $lte: threeDaysFromNow, $gt: new Date() }, // expiring soon, but not already expired
    })
      .populate("student", "name email")
      .populate("course", "title");

    for (const enrollment of enrollments) {
      const daysLeft = Math.ceil((enrollment.expiresAt - new Date()) / (1000 * 60 * 60 * 24));

      const sent = await sendEmail({
        to: enrollment.student.email,
        subject: `Your access to "${enrollment.course.title}" expires soon`,
        html: `
          <p>Hi ${enrollment.student.name},</p>
          <p>Your access to <strong>${enrollment.course.title}</strong> expires in ${daysLeft} day(s).</p>
          <p>Renew now to keep learning without interruption.</p>
        `,
      });

      // Only mark as sent if the email actually went through - if it failed, we want to retry tomorrow
      if (sent) {
        enrollment.reminderSent = true;
        await enrollment.save();
      }
    }

    if (enrollments.length > 0) {
      console.log(`[reminder-check] Processed ${enrollments.length} expiry reminder(s)`);
    }
  } catch (err) {
    console.error("[reminder-check] Failed:", err.message);
  }
};

// Runs daily at 9:00 AM - a reasonable hour for a student to see and act on the email
const startReminderCron = () => {
  cron.schedule("0 9 * * *", runReminderCheck);
  console.log("Expiry reminder cron job scheduled (daily at 9:00 AM)");
};

module.exports = startReminderCron;
