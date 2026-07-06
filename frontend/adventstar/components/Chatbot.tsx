"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ChatLink = {
  label: string;
  href: string;
};

type Message = {
  role: "user" | "bot";
  text: string;
  links?: ChatLink[];
};

type ChatResponse = {
  reply: string;
  links?: ChatLink[]
}

const SUGGESTIONS = [
  "I need a quote",
  "What industries do you serve?",
  "Embroidery and printing options",
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  // useRef creates a react object with this shape:
  //
  // { 
  //    current: null    
  // }
  // current refers to what that ref is currently pointing to
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(overrideText?: string) {
    const userText = (overrideText ?? input).trim();

    if (!userText || isLoading ) {
      return;
    }
    const userMessage: Message = {
      role: "user",
      text: userText,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.text, 
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to get chatbot reply.");
      }
      const linksHeader = response.headers.get("X-Chat-Links");
      const links = linksHeader
          ? (JSON.parse(decodeURIComponent(linksHeader)) as ChatLink[])
          : undefined;
      
      setMessages((current) => [...current, { role: "bot", text: "" , links }])
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        setMessages((current) => {
            const updated = [...current];
            const last = updated[updated.length - 1];
            updated[updated.length - 1] = { ...last, text: last.text + chunk };
            return updated;
        });
    }
    } catch {
        setMessages((current) => [
            ...current,
            {
                role: "bot",
                text: "Sorry, I'm having trouble right now.",
                links: [{ label: "Go to Enquiry Form", href: "/enquiry" }],
            },
        ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {isOpen ? (
        <div className="mb-4 w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">
          <div>
            <p className="font-semibold text-slate-900">T-shirt Terry</p>
            <p className="mt-1 text-sm text-slate-500">
              Ask me about uniforms, quotations, or enquiries.
            </p>
          </div>

          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">
                  Hi! How can I help you today?
                </p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleSend(suggestion)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs
                          text-slate-700 hover:border-slate-900 hover:text-slate-900"
                        >
                          {suggestion}
                        </button>
                    ))}
                </div>
              </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-[85%] rounded-2xl bg-slate-900 p-3 text-sm text-white"
                        : "mr-auto max-w-[85%] rounded-2xl bg-slate-100 p-3 text-sm text-slate-700"
                    }
                  >
                    <p>{message.text}</p>

                    {message.links?.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="mt-2 block font-semibold underline"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type your question..."
              className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-900"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-lg"
      >
        <Image
          src="/chatbot.png"
          alt="Open Advent Star chat"
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </button>
    </div>
  );
}
