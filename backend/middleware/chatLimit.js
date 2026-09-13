const ChatUsage = require("../models/ChatUsage");

const DAILY_LIMIT = 15;

const checkChatLimit = async (req, res, next) => {
  const userId = req.user._id;
  const today = new Date().toISOString().split("T")[0]; // e.g. "2026-08-28"

  let usage = await ChatUsage.findOne({ user: userId, date: today });
  if (!usage) {
    usage = await ChatUsage.create({ user: userId, date: today, count: 0 });
  }

  if (usage.count >= DAILY_LIMIT) {
    return res.status(429).json({
      error: `You've reached today's limit of ${DAILY_LIMIT} questions. Try again tomorrow!`,
      remaining: 0,
    });
  }

  req.chatUsage = usage; // passed along so the controller can increment it after a successful answer
  next();
};

module.exports = { checkChatLimit, DAILY_LIMIT };
