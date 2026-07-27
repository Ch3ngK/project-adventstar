"use client";

import { useEffect, useState } from "react";
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

const POLL_INTERVAL_MS = 9000;

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminConversationPage() {
    const [conversations, setConversations] = useState<ConversationSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isCancelled = false;

        async function loadConversations() {
            try {
                const response = await fetch("/api/admin/conversations");
                if (!response.ok) {
                    throw new Error("Failed to fetch conversations.");
                }

                const data = await response.json();
                if (!isCancelled) {
                    setConversations(data);
                    setErrorMessage("");
                }
            } catch {
                if (!isCancelled) {
                    setErrorMessage("Unable to load conversations.");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadConversations();

        const intervalId = setInterval(() => {
            if (document.visibilityState === "visible") {
                loadConversations();
            }
        }, POLL_INTERVAL_MS);

        return () => {
            isCancelled = true;
            clearInterval(intervalId);
        };
    }, []);

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-5xl space-y-8">
                <header>
                    <h1 className="text-4xl font-semibold text-slate-950">
                        Inbox
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                        WhatsApp conversations with leads, auto-replied by the AI assistant
                        or waiting for your review.
                    </p>
                </header>

                {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                ) : null}

                <section className="grid gap-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm"
                            >
                                <div className="animate-pulse space-y-4">
                                    <div className="h-6 w-1/3 rounded-full bg-slate-200" />
                                    <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                                </div>
                            </div>
                        ))
                    ) : conversations.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm">
                            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                No conversations yet
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                                WhatsApp messages from leads will show up here.
                            </h2>
                        </div>
                    ) : (
                        conversations.map((conversation) => (
                            <Link
                                key={conversation.id}
                                href={`/admin/conversations/${conversation.id}`}
                                className="block rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:border-[#10284a]/30"
                            >
                                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-semibold text-slate-950">
                                                {conversation.contact_name}
                                            </h2>
                                            {conversation.needs_review ? (
                                                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                                                    Needs review
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-slate-600">
                                            {conversation.company_name ?? conversation.phone_number}
                                        </p>
                                        <p className="mt-2 truncate text-sm text-slate-500">
                                            {conversation.last_message_preview}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-xs text-slate-400">
                                        {formatTimestamp(conversation.last_message_at)}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </section>
            </div>
        </main>
    );
}
