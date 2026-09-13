const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getGeminiResponse = async (question) => {
  const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

  // System-style instruction baked into the prompt itself, since this call doesn't use a
  // separate system role. Keeps answers focused on English learning, not open-ended topics.
  const prompt = `You are a friendly, patient English language tutor helping students of Tabi Khan's English Academy.
Answer clearly and simply, with a short example where it helps. Keep answers concise (2-4 sentences)
unless the question genuinely needs more detail. If the question isn't related to English language
learning (grammar, vocabulary, speaking, writing), politely redirect the student back to English topics.

Student's question: ${question}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
};

module.exports = getGeminiResponse;
