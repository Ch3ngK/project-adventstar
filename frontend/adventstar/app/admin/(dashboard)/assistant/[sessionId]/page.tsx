"use client";

import { useEffect, useRef, useState } from "react";

//useParams is a React Router hook that gets dynamic values from the current URL.
import { useParams } from "next/navigation";

import AssistantSidebar from "@/components/admin/AssistantSidebar";

type ChatMessage = {
    id: number;
    session_id: number;
    role: string;
    body: string;
    created_at: string;
}

type ChatSendResponse = {
    user_message: ChatMessage;
    assistant_message: ChatMessage;
};

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminAssistantThreadPage() {
    const params = useParams<{ sessionId: string }>();
    const sessionId = params.sessionId;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [composerBody, setComposerBody] = useState("");
    const [isSending, setIsSending] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isCancelled = false; 

        async function loadMessages() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/admin/assistant/sessions/${sessionId}/messages`);
                if (!response.ok) {
                    throw new Error("Failed to fetch messages.");
                }
                
                const data = await response.json();
                if (!isCancelled) {
                    setMessages(data);
                    setErrorMessage("");
                }
            } catch {
                if (!isCancelled) {
                    setErrorMessage("Unable to load messages.");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadMessages();

        return () => {
            isCancelled = true;
        };
    }, [sessionId])

    async function handleSend(event: React.FormEvent) {
        event.preventDefault(); // Prevents default browser behaviour.

        if (!composerBody.trim()) {
            return;
        }

        try {
            setIsSending(true);
            setErrorMessage("");

            const response = await fetch(`/api/admin/assistant/sessions/${sessionId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: composerBody }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message.");
            }

            const data: ChatSendResponse = await response.json();
            setMessages((current) => [...current, data.user_message, data.assistant_message]);
            setComposerBody("");
        } catch {
            setErrorMessage("Unable to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
                <AssistantSidebar activeSessionId={sessionId} />

                <section className="flex flex-1 flex-col gap-4">
                    {errorMessage ? (
                        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {errorMessage}
                        </p>
                    ) : null}

                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-16 w-2/3 rounded-[1.25rem] bg-slate-100" />
                                <div className="ml-auto h-16 w-2/3 rounded-[1.25rem] bg-slate-100" />
                            </div>
                        ) : messages.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                Ask about pricing, stock, customers, quotes, or orders.
                            </p>
                        ) : (
                            messages.map((message) => {
                                const isUser = message.role === "user";

                                return (
                                    <div
                                        key={message.id}
                                        className={`max-w-lg rounded-[1.25rem] px-4 py-3 text-sm leading-6 ${
                                            isUser
                                                ? "ml-auto bg-[#10284a] text-white"
                                                : "mr-auto bg-slate-100 text-slate-800"
                                        }`}
                                    >
                                        <p className="whitespace-pre-line">{message.body}</p>
                                        <p className={`mt-2 text-[0.7rem] ${isUser ? "text-white/60" : "text-slate-400"}`}>
                                            {formatTimestamp(message.created_at)}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                        <div ref={bottomRef} />
                    </div>

                    <form
                        onSubmit={handleSend}
                        className="flex items-end gap-3 rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 shadow-sm"
                    >
                        <textarea
                            value={composerBody}
                            onChange={(event) => setComposerBody(event.target.value)}
                            rows={2}
                            placeholder="Ask the assistant..."
                            className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                        />
                        <button
                            type="submit"
                            disabled={isSending || !composerBody.trim()}
                            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#10284a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c1f3a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSending ? "Thinking..." : "Send"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
}