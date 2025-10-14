
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, Send, X, Bot, User, Loader2, Copy, Check } from "lucide-react";
import axiosInstance from "../lib/axios";

const STORAGE_KEY = "ayubo-chat-history-v1";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [messages, setMessages] = useState(() => {
    
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        role: "assistant",
        text:
          "Hi! I'm the Ayubo Lanka assistant. Ask me about products, doctor channeling, prices, or orders. Sinhala/Singlish OK! 🌿",
        ts: Date.now(),
      },
    ];
  });

  const [online, setOnline] = useState(() => navigator.onLine);
  const listRef = useRef(null);
  const textareaRef = useRef(null);

  
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

 
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "0px";
    const h = Math.min(160, textareaRef.current.scrollHeight);
    textareaRef.current.style.height = `${h}px`;
  }, [input]);

  const suggestions = useMemo(
    () => [
      "What oil is best for hair fall?",
      "Book an appointment with a doctor",
      "Payment methods for orders?",
      "Ayurvedic solution for gastritis?",
    ],
    []
  );

  const copyMsg = async (idx, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {}
  };

  const send = async (customText) => {
    const msg = (customText ?? input).trim();
    if (!msg || busy) return;

    
    if (!online) {
      setMessages((m) => [
        ...m,
        { role: "user", text: msg, ts: Date.now() },
        {
          role: "assistant",
          text: "You're offline at the moment. Please check your internet connection and try again.",
          ts: Date.now(),
        },
      ]);
      setInput("");
      return;
    }

    setInput("");
    setMessages((m) => [...m, { role: "user", text: msg, ts: Date.now() }]);

    try {
      setBusy(true);
      const { data } = await axiosInstance.post("/chat/ask", { message: msg });
      const reply = data?.reply || "Sorry, I couldn't answer that.";
      setMessages((m) => [...m, { role: "assistant", text: reply, ts: Date.now() }]);
    } catch (e) {
      const err = e?.response?.data?.message || "Network error";
      setMessages((m) => [...m, { role: "assistant", text: `⚠️ ${err}`, ts: Date.now() }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-emerald-600 text-white p-4 shadow-lg hover:bg-emerald-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-40 w-[28rem] md:w-[34rem] max-h-[85vh] bg-white/95 backdrop-blur border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[fadeIn_.2s_ease]"
          role="dialog"
          aria-label="Ayubo Lanka Assistant chat"
          aria-modal="true"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div className="leading-tight">
                <div className="font-semibold">Ayubo Lanka Assistant</div>
                <div className="text-[11px] text-white/85">
                  Products • Channeling • Orders {online ? "• Online" : "• Offline"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white/10 hover:bg-white/20 p-1"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          {/* Suggestions (only when short history) */}
          {messages.length <= 2 && (
            <div className="px-3 pt-3 bg-emerald-50/60 border-b">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs rounded-full border bg-white hover:bg-emerald-50 px-3 py-1 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!online && (
                <div className="mt-2 text-[11px] text-amber-700">
                  You’re offline. Replies will resume when back online.
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          <div
            ref={listRef}
            className="flex-1 overflow-auto p-3 space-y-3 bg-emerald-50/40"
            aria-live="polite"
          >
            {messages.map((m, i) => {
              const isUser = m.role === "user";
              return (
                <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  {/* bubble */}
                  <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
                    {/* avatar */}
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                        isUser ? "bg-gray-200 text-gray-700" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {isUser ? <User size={14} /> : <Bot size={14} />}
                    </div>

                    {/* message + tools */}
                    <div className="group">
                      <div
                        className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${
                          isUser
                            ? "bg-emerald-600 text-white rounded-br-none"
                            : "bg-white border rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                      <div className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        <span className="text-[10px] text-gray-500">
                          {new Date(m.ts || Date.now()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {!isUser && (
                          <button
                            onClick={() => copyMsg(i, m.text)}
                            className="opacity-0 group-hover:opacity-100 transition inline-flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700"
                            title="Copy message"
                          >
                            {copiedIdx === i ? (
                              <>
                                <Check size={12} /> Copied
                              </>
                            ) : (
                              <>
                                <Copy size={12} /> Copy
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Loader2 className="animate-spin" size={14} />
                Thinking…
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-2 flex items-end gap-2 border-t bg-white">
            <textarea
              ref={textareaRef}
              rows={1}
              className="flex-1 resize-none border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200 max-h-[128px]"
              placeholder={busy ? "Thinking…" : "Type your message"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={busy}
              aria-label="Message input"
            />
            <button
              onClick={() => send()}
              disabled={busy || !input.trim()}
              className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 transition-colors"
              aria-label="Send"
            >
              {busy ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
