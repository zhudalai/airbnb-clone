"use client";

import { useState, useRef, useEffect } from "react";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_API_URL =
  process.env.NEXT_PUBLIC_CHAT_API_URL || "http://localhost:8000";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "こんにちは！民泊マーケティングのAIカスタマーサポートです。チェックイン時間、キャンセルポリシー、設備などご質問があればお気軽にどうぞ。",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${CHAT_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "申し訳ございません。応答を取得できませんでした。" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "申し訳ございません。現在チャットサーバーに接続できません。しばらく経ってからお試しください。",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="チャットを開く"
      >
        {isOpen ? <IoClose size={24} /> : <IoChatbubbleEllipses size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-rose-500 text-white px-4 py-3 flex items-center gap-2">
            <IoChatbubbleEllipses size={20} />
            <span className="font-semibold text-sm">AIカスタマーサポート</span>
            <span className="text-xs opacity-75 ml-auto">民泊マーケティング</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-rose-500 text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="メッセージを入力..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-rose-500 transition"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 text-white rounded-full p-2 transition"
                aria-label="送信"
              >
                <IoSend size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
