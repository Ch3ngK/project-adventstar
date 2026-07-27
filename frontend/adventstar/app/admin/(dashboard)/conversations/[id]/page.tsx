"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type ConversationSummary = {
    id: number;
    lead_id: number;
    phone_number: string;
    contact_name: string;
    company_name: string | null;
    last_message_at: string;
    last_message_preview: string;
    needs_review: boolean;
    created_at: string;
};

type MessageResponse = {
    id: number;
    conversation_id: number;
    direction: string;
    sender_type: string;
    status: string;
    body: string;
    ai_reasoning: string | null;
    twilio_message_sid: string | null;
    sent_by_user_id: number | null;
    created_at: string;
};

const POLL_INTERVAL_MS = 8000;

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminConversationThreadPage() {
    const params = useParams<{ id: string }>();
    const conversationId = params.id; 

    const [conversation, setConversation] = useState<ConversationSummary | null>(null);
    const [messages, setMessages] = useState<MessageResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [composerBody, setComposerBody] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [draftEdits, setDraftEdits] = useState<Record<number, string>>({});
    const [approvingMessageId, setApprovingMessageId] = useState<number | null>(null);

     useEffect(() => {
        async function loadConversationHeader() {
            try {
                const response = await fetch("/api/admin/conversations");
                if (!response.ok) {
                    return;
                }

                const data: ConversationSummary[] = await response.json();
                const match = data.find((item) => String(item.id) === conversationId);
                if (match) {
                    setConversation(match);
                }
            } catch {
                // Header is a nice-to-have; thread polling below carries its own error state.
            }
        }

        loadConversationHeader();
    }, [conversationId]);

    useEffect(() => {
        let isCancelled = false;

        async function loadMessages() {
            try {
                const response = await fetch(`/api/admin/conversations/${conversationId}/messages`);
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

        const intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                loadMessages();
            }
        }, POLL_INTERVAL_MS);

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
        };
    }, [conversationId]);

    async function handleSend(event: React.FormEvent) {
        event.preventDefault();

        if (!composerBody.trim()) {
            return;
        }

        try {
            setIsSending(true);
            setErrorMessage("");

            const response = await fetch(`/api/admin/conversations/${conversationId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: composerBody }),
            });

            if (!response.ok) {
                throw new Error("Failed to send message.");
            }

            const newMessage: MessageResponse = await response.json();
            setMessages((current) => [...current, newMessage]);
            setComposerBody("");
        } catch {
            setErrorMessage("Unable to send message.");
        } finally {
            setIsSending(false);
        }
    }

    async function handleApproveDraft(messageId: number) {
        const editedBody = draftEdits[messageId];
        const message = messages.find((item) => item.id === messageId);
        const bodyToSend = editedBody ?? message?.body ?? "";

        try {
            setApprovingMessageId(messageId);
            setErrorMessage("");

            const response = await fetch(`/api/admin/messages/${messageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: bodyToSend }),
            });

            if (!response.ok) {
                throw new Error("Failed to send draft.");
            }

            const updatedMessage: MessageResponse = await response.json();
            setMessages((current) =>
                current.map((item) => (item.id === messageId ? updatedMessage : item)));
        } catch {
            setErrorMessage("Unable to send draft.");
        } finally {
            setApprovingMessageId(null);
        }
    }
    
    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <div>
                    <Link
                        href="/admin/conversations"
                        className="text-sm font-semibold text-slate-500 hover:text-slate-800"
                    >
                        ← Back to Inbox
                    </Link>
                    <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                        {conversation?.contact_name ?? "Conversation"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        {conversation?.company_name ?? conversation?.phone_number ?? ""}
                    </p>
                </div>

                {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                ) : null}

                <section className="flex flex-col gap-4 rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
                    {isLoading ? (
                        <div className="animate-pulse space-y-4">
                            <div className="h-16 w-2/3 rounded-[1.25rem] bg-slate-100" />
                            <div className="ml-auto h-16 w-2/3 rounded-[1.25rem] bg-slate-100" />
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="text-sm text-slate-500">No messages yet.</p>
                    ) : (
                        messages.map((message) => {
                            const isInbound = message.direction === "inbound";
                            const isDraft = message.status === "draft_pending_review";
                            const isFailed = message.status === "failed";

                            if (isDraft) {
                                return (
                                    <div
                                        key={message.id}
                                        className="ml-auto w-full max-w-sm rounded-[1.25rem] border border-amber-300 bg-amber-50 p-4"
                                    >
                                        <p className="text-xs font-semibold tracking-[0.14em] text-amber-800 uppercase">
                                            Draft — needs review
                                        </p>
                                        <textarea
                                            value={draftEdits[message.id] ?? message.body}
                                            onChange={(event) =>
                                                setDraftEdits((current) => ({
                                                    ...current,
                                                    [message.id]: event.target.value,
                                                }))}
                                            rows={3}
                                            className="mt-2 w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-amber-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleApproveDraft(message.id)}
                                            disabled={approvingMessageId === message.id}
                                            className="mt-3 inline-flex items-center justify-center rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {approvingMessageId === message.id ? "Sending..." : "Edit & Send"}
                                        </button>
                                    </div>
                                );
                            }

                            return (
                                <div
                                    key={message.id}
                                    className={`max-w-sm rounded-[1.25rem] px-4 py-3 text-sm leading-6 ${
                                        isInbound
                                            ? "mr-auto bg-slate-100 text-slate-800"
                                            : isFailed
                                            ? "ml-auto border border-red-300 bg-red-50 text-red-800"
                                            : "ml-auto bg-[#10284a] text-white"
                                    }`}
                                >
                                    <p className="whitespace-pre-line">{message.body}</p>
                                    <p
                                        className={`mt-2 text-[0.7rem] ${
                                            isInbound ? "text-slate-400" : isFailed ? "text-red-500" : "text-white/60"
                                        }`}
                                    >
                                        {isFailed ? "Failed to send · " : ""}
                                        {formatTimestamp(message.created_at)}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </section>

                <form
                    onSubmit={handleSend}
                    className="flex items-end gap-3 rounded-[1.75rem] border border-slate-200 bg-white/90 p-4 shadow-sm"
                >
                    <textarea
                        value={composerBody}
                        onChange={(event) => setComposerBody(event.target.value)}
                        rows={2}
                        placeholder="Type a message..."
                        className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                    />
                    <button
                        type="submit"
                        disabled={isSending || !composerBody.trim()}
                        className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#10284a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c1f3a] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSending ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </main>
    );
}