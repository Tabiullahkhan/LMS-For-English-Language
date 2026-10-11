require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const chatRoutes = require("./routes/chatRoutes");
const startExpiryCron = require("./utils/expiryCron");
const startReminderCron = require("./utils/reminderCron");

const app = express();

app.use(cors());
app.use(express.json());

// Make sure the database is connected before handling any request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/chat", chatRoutes);

// Vercel calls these on a schedule (see vercel.json). The secret stops anyone else from triggering them.
const requireCronSecret = (req, res, next) => {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};
app.get("/api/cron/expire", requireCronSecret, async (req, res) => {
  await startExpiryCron.run();
  res.json({ ok: true });
});
app.get("/api/cron/remind", requireCronSecret, async (req, res) => {
  await startReminderCron.run();
  res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("Course platform API is running");
});

// Local development only: on Vercel the app is exported instead of listening on a port
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  connectDB().then(() => {
    startExpiryCron();
    startReminderCron();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  });
}

module.exports = app;