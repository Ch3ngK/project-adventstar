"use client";

import AssistantSidebar from "@/components/admin/AssistantSidebar";

export default function AdminAssistantPage() {
    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
                <AssistantSidebar />

                <section className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-sm">
                    <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                        Business Assistant
                    </p>
                    <h1 className="text-2xl font-semibold text-slate-950">
                        Start a new chat to ask about pricing, stock, customers, quotes, or orders.
                    </h1>
                </section>
            </div>
        </main>
    );
}