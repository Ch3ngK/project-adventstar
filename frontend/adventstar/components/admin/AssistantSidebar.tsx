"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ChatSessionSummary = {
    id: number;
    user_id: number;
    title: string; 
    created_at: string; 
    last_message_at: string; 
}

function formatTimestamp(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

type AssistantSidebarProps = {
    activeSessionId?: string;
}

export default function AssistantSidebar({ activeSessionId }: AssistantSidebarProps) {
    const router = useRouter();
    const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        let isCancelled = false; 

        async function loadSessions() {
            try {
                const response = await fetch("/api/admin/assistant/sessions");
                if (!response.ok) {
                    throw new Error("Failed to fetch sessions.");
                }

                const data: ChatSessionSummary[] = await response.json()
                if (!isCancelled) {
                    setSessions(data);
                }
            } catch {
                // Sidebar list is a nice-to-have; the active thread carries its own error state.
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadSessions();

        return () => {
            isCancelled = true;
        };
    }, [activeSessionId])

    async function handleNewChat() {
        try {
            setIsCreating(true);

            const response = await fetch("/api/admin/assistant/sessions", {
                method: "POST",
            });
            
            if (!response.ok) {
                throw new Error("Failed to create session.");
            }

            const newSession: ChatSessionSummary = await response.json();
            router.push(`/admin/assistant/${newSession.id}`);
        } catch {
            // Swallow - user can retry the click.
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <aside className="flex w-full flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm lg:w-72 lg:shrink-0">
            <button
                type="button"
                onClick={handleNewChat}
                disabled={isCreating}
                className="inline-flex items-center justify-center rounded-full bg-[#10284a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c1f3a] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isCreating ? "Starting..." : "+ New Chat"}
            </button>

            <div className="flex flex-col gap-1 overflow-y-auto">
                {isLoading ? (
                    <div className="animate-pulse space-y-2">
                        <div className="h-10 rounded-xl bg-slate-100" />
                        <div className="h-10 rounded-xl bg-slate-100" />
                    </div>
                ) : sessions.length === 0 ? (
                    <p className="px-2 py-3 text-sm text-slate-500">No chats yet.</p>
                ) : (
                    sessions.map((session) => {
                        const isActive = activeSessionId === String(session.id);

                        return (
                            <Link
                                key={session.id}
                                href={`/admin/assistant/${session.id}`}
                                className={`rounded-xl px-3 py-2.5 text-sm transition ${
                                    isActive
                                        ? "bg-[#10284a] text-white"
                                        : "text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                                <p className="truncate font-medium">{session.title}</p>
                                <p className={`mt-0.5 truncate text-xs ${isActive ? "text-white/60" : "text-slate-400"}`}>
                                    {formatTimestamp(session.last_message_at)}
                                </p>
                            </Link>
                        );
                    })
                )}
            </div>
        </aside>
    );
}