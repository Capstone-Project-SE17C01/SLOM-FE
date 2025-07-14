'use client';
import React, { useState, useRef, useEffect } from "react";
import { OPENROUTER_CONFIG } from "@/services/openrouter/config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${OPENROUTER_CONFIG.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          ...OPENROUTER_CONFIG.headers,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ""}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_CONFIG.model,
          messages: [
            {
              role: "system",
              content: "You are a friendly AI assistant. Answer concisely and clearly in English.",
            },
            ...[...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Failed to connect to OpenRouter API." },
        ]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content?.trim() || "No response received.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An error occurred while sending the message." },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <>
      {/* Floating round button */}
      <div
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 10000,
        }}
      >
        {!open && (
          <button
            aria-label="Open chatbot"
            onClick={() => setOpen(true)}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #a259ff 0%, #6d28d9 100%)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {/* Icon chat bubble tím, nhỏ */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#a259ff" opacity="0.15"/>
              <path d="M7 8h10M7 12h6m-6 4h4" stroke="#a259ff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M5 19l2.5-2.5" stroke="#a259ff" strokeWidth="2" strokeLinecap="round"/>
              <ellipse cx="12" cy="12" rx="7" ry="6" fill="#fff" opacity="0.7"/>
              <ellipse cx="12" cy="12" rx="5" ry="4" fill="#a259ff" opacity="0.15"/>
              <circle cx="9.5" cy="12" r="1" fill="#a259ff"/>
              <circle cx="12" cy="12" r="1" fill="#a259ff"/>
              <circle cx="14.5" cy="12" r="1" fill="#a259ff"/>
            </svg>
          </button>
        )}

        {/* Chat window */}
        {open && (
          <div
            style={{
              position: "fixed",
              bottom: 32,
              right: 32,
              width: 340,
              maxHeight: 500,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              zIndex: 10001,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "fadeInUp .2s",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #a259ff 0%, #6d28d9 100%)",
                color: "#fff",
                padding: "12px 16px",
                fontWeight: 600,
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{marginRight: 8}}>
                <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.15"/>
                <path d="M7 8h10M7 12h6m-6 4h4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <ellipse cx="12" cy="12" rx="7" ry="6" fill="#fff" opacity="0.7"/>
                <ellipse cx="12" cy="12" rx="5" ry="4" fill="#a259ff" opacity="0.15"/>
                <circle cx="9.5" cy="12" r="1" fill="#a259ff"/>
                <circle cx="12" cy="12" r="1" fill="#a259ff"/>
                <circle cx="14.5" cy="12" r="1" fill="#a259ff"/>
              </svg>
              Chatbot AI
              <button
                aria-label="Close chatbot"
                onClick={() => setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#fff",
                  fontSize: 22,
                  cursor: "pointer",
                  marginLeft: 8,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                flex: 1,
                padding: 12,
                overflowY: "auto",
                background: "#f9f9f9",
              }}
            >
              {messages.length === 0 && (
                <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
                  Hello! How can I help you?
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    margin: "8px 0",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: 16,
                      background: msg.role === "user" ? "#e6f0ff" : "#e9e9e9",
                      color: "#222",
                      maxWidth: 240,
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div
              style={{
                display: "flex",
                borderTop: "1px solid #eee",
                padding: 8,
                background: "#fff",
              }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "8px 12px",
                  borderRadius: 8,
                  fontSize: 15,
                  background: "#f5f5f5",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  marginLeft: 8,
                  background: "linear-gradient(135deg, #a259ff 0%, #6d28d9 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;