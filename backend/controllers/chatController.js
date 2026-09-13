const ChatCache = require("../models/ChatCache");
const getGeminiResponse = require("../config/gemini");
const { DAILY_LIMIT } = require("../middleware/chatLimit");

// Collapses whitespace and lowercases - matches how questions are stored in ChatCache
const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, " ");

// @route POST /api/chat/ask
exports.askChatbot = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Please type a question" });
    }

    const normalizedQuestion = normalize(question);

    // 1. Check cache first - if a near-identical question was answered before, reuse it for
    // free and WITHOUT counting against the student's daily limit (this is the whole point
    // of caching: common questions shouldn't cost the student their limited daily quota).
    const cached = await ChatCache.findOne({ normalizedQuestion });
    if (cached) {
      cached.hitCount += 1;
      await cached.save();
      return res.json({
        answer: cached.answer,
        fromCache: true,
        remaining: DAILY_LIMIT - req.chatUsage.count, // limit untouched for cached answers
      });
    }

    // 2. Not cached - this call actually uses the Gemini API and counts against the limit
    const answer = await getGeminiResponse(question);

    // Save to cache for next time, and increment this student's daily usage
    await ChatCache.create({ normalizedQuestion, answer });
    req.chatUsage.count += 1;
    await req.chatUsage.save();

    res.json({
      answer,
      fromCache: false,
      remaining: DAILY_LIMIT - req.chatUsage.count,
    });
  } catch (err) {
    console.error("Chatbot error:", err.message); // so we can see the real cause in the terminal
    res.status(500).json({ error: "The tutor bot is a bit busy right now. Please try again shortly." });
  }
};
