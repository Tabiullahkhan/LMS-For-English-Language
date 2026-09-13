import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ChatWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! Ask me anything about English grammar, speaking, or writing." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chatbot is only for logged-in students - not shown to anonymous visitors at all
  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setSending(true);

    try {
      const res = await api.post("/chat/ask", { question });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.answer }]);
      setRemaining(res.data.remaining);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { role: "bot", text: errorMsg }]);
      if (err.response?.data?.remaining !== undefined) setRemaining(err.response.data.remaining);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex justify-end">
      {open ? (
        <div className="w-full sm:w-80 h-96 bg-cream dark:bg-ink border border-ink/15 dark:border-cream/15 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-colors">
          <div className="bg-ink text-cream px-4 py-3 flex items-center justify-between">
            <span className="font-display text-sm">English Tutor Bot</span>
            <button onClick={() => setOpen(false)} className="text-cream/80 hover:text-cream">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-correction text-cream ml-auto"
                    : "bg-ink/5 text-ink dark:bg-cream/10 dark:text-cream"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {sending && <div className="text-xs text-warm-grey">Typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {remaining !== null && (
            <p className="text-xs text-warm-grey px-3 pb-1">{remaining} question(s) left today</p>
          )}

          <form onSubmit={handleSend} className="border-t border-ink/15 dark:border-cream/15 p-2 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-ink/15 dark:border-cream/20 rounded-lg px-3 py-1.5 text-sm
                         bg-cream dark:bg-ink text-ink dark:text-cream
                         placeholder-warm-grey focus:outline-none focus:border-correction transition-colors"
            />
            <button
              type="submit"
              disabled={sending}
              className="bg-ink text-cream px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-ink text-cream w-14 h-14 rounded-full shadow-lg text-sm font-display hover:bg-ink/85 transition-colors flex items-center justify-center"
        >
          Ask
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
