"use client";
import React, { useState, useRef, useEffect } from "react";
import { GeminiService } from "@/services/gemini/config";
import { useTheme } from "@/contexts/ThemeContext";
import { useTranslations } from "next-intl";
import websiteInfo from "@/utils/websiteInfo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Chatbot: React.FC = () => {
  const t_chatbot = useTranslations("chatbot");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

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
      const gemini = new GeminiService(
        process.env.NEXT_PUBLIC_GEMINI_KEY || "free"
      );

      const language =
        typeof window !== "undefined" && localStorage.getItem("language") === "vn"
          ? "Vietnamese"
          : "English";

      // Chuẩn bị thông tin website để cung cấp cho chatbot
      const websiteInfoString = JSON.stringify({
        name: websiteInfo.name,
        description: websiteInfo.description,
        features: websiteInfo.features,
        pricing: websiteInfo.pricing,
        about: websiteInfo.about,
        signLanguageInfo: websiteInfo.signLanguageInfo,
        deafCommunity: websiteInfo.deafCommunity
      });

      const systemMessage = {
        role: "system" as const,
        content:
          `You are a friendly AI assistant for ${websiteInfo.name} (${websiteInfo.description}). 
          Our app has the following components: 
          1. Online meeting that allows users to meet and translate sign language in real-time
          2. Messaging for chat between users
          3. Courses for learning sign language
          4. Translator for sign language translation
          5. Q&A section for users to ask questions

          We have two pricing plans:
          - Free plan: ${websiteInfo.pricing.free.description}
          - Pro plan: ${websiteInfo.pricing.pro.description} at ${websiteInfo.pricing.pro.price}đ per month

          You have extensive knowledge about sign language and deaf communities:
          - ${websiteInfo.signLanguageInfo.definition}
          - We support multiple sign languages including ${websiteInfo.signLanguageInfo.types.vsl.name}, ${websiteInfo.signLanguageInfo.types.asl.name}, and others
          - ${websiteInfo.deafCommunity.culture}
          - ${websiteInfo.deafCommunity.statistics.global}
          - ${websiteInfo.deafCommunity.statistics.vietnam}

          ONLY answer questions about sign language, deaf-related topics, or our website/app features.
          If the user asks questions not related to these topics, politely respond with:
          "Sorry, I can only answer questions related to sign language, deaf community, or our app features. Please ask another question."
          
          Answer concisely and clearly in ${language}.
          
          Website information: ${websiteInfoString}`,
      };

      const chatMessages = [
        systemMessage,
        ...[...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const reply = await gemini.chat(chatMessages, {
        temperature: 0.7,
        maxTokens: 1000,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply || t_chatbot("noResponse") },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t_chatbot("error") },
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
              <circle cx="12" cy="12" r="12" fill="#a259ff" opacity="0.15" />
              <path
                d="M7 8h10M7 12h6m-6 4h4"
                stroke="#a259ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M5 19l2.5-2.5"
                stroke="#a259ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <ellipse
                cx="12"
                cy="12"
                rx="7"
                ry="6"
                fill="#fff"
                opacity="0.7"
              />
              <ellipse
                cx="12"
                cy="12"
                rx="5"
                ry="4"
                fill="#a259ff"
                opacity="0.15"
              />
              <circle cx="9.5" cy="12" r="1" fill="#a259ff" />
              <circle cx="12" cy="12" r="1" fill="#a259ff" />
              <circle cx="14.5" cy="12" r="1" fill="#a259ff" />
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
              background: isDarkMode ? "#1f2937" : "#fff",
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
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                style={{ marginRight: 8 }}
              >
                <circle cx="12" cy="12" r="12" fill="#fff" opacity="0.15" />
                <path
                  d="M7 8h10M7 12h6m-6 4h4"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="7"
                  ry="6"
                  fill="#fff"
                  opacity="0.7"
                />
                <ellipse
                  cx="12"
                  cy="12"
                  rx="5"
                  ry="4"
                  fill="#a259ff"
                  opacity="0.15"
                />
                <circle cx="9.5" cy="12" r="1" fill="#a259ff" />
                <circle cx="12" cy="12" r="1" fill="#a259ff" />
                <circle cx="14.5" cy="12" r="1" fill="#a259ff" />
              </svg>
              {t_chatbot("chatbotAI")}
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
                background: isDarkMode ? "#374151" : "#f9f9f9",
              }}
            >
              {messages.length === 0 && (
                <div style={{ 
                  color: isDarkMode ? "#9ca3af" : "#888", 
                  textAlign: "center", 
                  marginTop: 40 
                }}>
                  {t_chatbot("hello")}
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
                      background: msg.role === "user" 
                        ? (isDarkMode ? "#3b82f6" : "#e6f0ff") 
                        : (isDarkMode ? "#4b5563" : "#e9e9e9"),
                      color: isDarkMode ? "#f9fafb" : "#222",
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
                borderTop: `1px solid ${isDarkMode ? "#4b5563" : "#eee"}`,
                padding: 8,
                background: isDarkMode ? "#1f2937" : "#fff",
              }}
            >
              <input
                type="text"
                placeholder={t_chatbot("typeYourMessage")}
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
                  background: isDarkMode ? "#374151" : "#f5f5f5",
                  color: isDarkMode ? "#f9fafb" : "#222",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                style={{
                  marginLeft: 8,
                  background:
                    "linear-gradient(135deg, #a259ff 0%, #6d28d9 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {t_chatbot("send")}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
