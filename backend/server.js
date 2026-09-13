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

connectDB();
startExpiryCron();
startReminderCron();

app.use(cors());
app.use(express.json()); // parses incoming JSON request bodies

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => {
  res.send("Course platform API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
