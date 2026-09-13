const express = require("express");
const router = express.Router();
const { askChatbot } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");
const { checkChatLimit } = require("../middleware/chatLimit");

router.post("/ask", protect, checkChatLimit, askChatbot);

module.exports = router;
