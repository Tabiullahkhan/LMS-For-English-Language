const nodemailer = require("nodemailer");

// Uses Gmail's SMTP via an "app password" (not your regular Gmail password - Google requires
// a separate 16-character app password for this, generated from Google Account > Security >
// 2-Step Verification > App Passwords). Free, no email service subscription needed.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Tabi Khan English Academy" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    return false; // don't throw - a failed email shouldn't crash whatever triggered it
  }
};

module.exports = sendEmail;
