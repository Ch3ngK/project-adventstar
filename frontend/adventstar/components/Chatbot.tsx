"use client";

import { useState } from "react";

type ChatLink = {
    label: string;
    href: string; 
};

type Message = {
    role: "user" | "bot" 
    text: string;
    links?: ChatLink[];
};

function getBotReply(userMessage: string) {
    const message = userMessage.toLowerCase();

    if (message.includes("quote") || message.includes("price")) {
        return {
            text: "You can request a quotation by submitting an enquiry form.",
            links: [{ label: "Go to Enquiry Form", href: "/enquiry" }],
        };
    }

    if (message.includes("uniform") || message.includes("shirt")) {
        return {
            text: "Advent Star supplies uniforms and apparel for schools, companies, and organizations.",
            links: [{ label: "Submit Uniform Enquiry", href: "/enquiry" }], 
        }
    }

     if (message.includes("contact") || message.includes("email")) {
        return {
            text: "You can contact Advent Star by submitting an enquiry. The team will follow up from there.",
            links: [{ label: "Contact Us", href: "/enquiry" }],
        };
    }

    return {
        text: "I can help with uniforms, quotations, and enquiries. You can start by submitting an enquiry form.",
        links: [{ label: "Start Enquiry", href: "/enquiry" }],
    };
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");

    function handleSend() {
        if (!input.trim()) {
            return; 
        }

        const userMessage: Message = {
            role: "user" ,
            text: input
        };

        const botReply: Message = {
            role: "bot",
            ...getBotReply(input), 
        };

        setMessages((currentMessages) => [
                ...currentMessages,
                userMessage,
                botReply,
        ]);

        setInput(""); 
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
                        <p className="rounded-2xl bg-slate-100 p-3 text-sm text-slate-600">
                        Hi! How can I help you today?
                        </p>
                    ) : (
                        messages.map((message, index) => (
                        <div
                            key={index}
                            className={
                            message.role === "user"
                                ? "ml-auto max-w-[85%] rounded-2xl bg-amber-600 p-3 text-sm text-white"
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
                        className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-amber-500"
                    />

                    <button
                        type="button"
                        onClick={handleSend}
                        className="rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                        Send
                    </button>
                    </div>
                </div>
                ) : null}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-amber-200 bg-white shadow-lg transition hover:scale-105"
                >
            <img
                src="/chatbot.png"
                alt="Open Advent Star chat"
                className="h-full w-full object-cover"
                />
            </button>
        </div>
    )
}