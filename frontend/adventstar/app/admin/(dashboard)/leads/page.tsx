"use client";

import { useState, useEffect } from "react";
import { buildMailtoHref } from "@/lib/mailto";

type Lead = {
    id: number;
    contact_name: string;
    company_name: string;
    email: string;
    phone: string | null;
    notes: string;
    created_at: string;
}

type EmailDraftResponse = {
    id: number;
    kind: string;
    lead_id: number | null;
    subject: string;
    body: string;
    open_questions: string[];
    created_at: string;
}

function formatSubmittedAt(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // create-lead form fields 
    const [contactName, setContactName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [isCreatingLead, setIsCreatingLead] = useState(false);

    // outreach drafts 
    const [generatingEmailDraftId, setGeneratingEmailDraftId] = useState<number | null>(null);
    const [emailDraftsByLeadId, setEmailDraftsByLeadId] = useState<Record<number, EmailDraftResponse[]>>({});
    const [viewingEmailDraftsLeadId, setViewingEmailDraftsLeadId] = useState<number | null>(null);
    const [loadingEmailDraftsLeadId, setLoadingEmailDraftsLeadId] = useState<number | null>(null);
    const [copiedEmailDraftId, setCopiedEmailDraftId] = useState<number | null>(null);

    useEffect(() => {
        async function loadLeads() {
            try {
                const response = await fetch("/api/admin/leads");
                if (!response.ok) {
                    throw new Error("Failed to fetch leads.");
                }

                const data = await response.json();
                setLeads(data);
                setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load leads.");
            } finally {
                setIsLoading(false);
            }
        }

        loadLeads();
    }, []);

    async function handleCreateLead(event: React.FormEvent) {
        event.preventDefault();
        try {
            setIsCreatingLead(true);
            setErrorMessage("");
            const response = await fetch("/api/admin/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contact_name: contactName,
                    company_name: companyName,
                    email,
                    phone: phone || null,
                    notes,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create lead.");
            }

            const newLead: Lead = await response.json(); 
            setLeads((current) => [newLead, ...current]);
            setContactName("");
            setCompanyName("");
            setEmail("");
            setPhone("");
            setNotes("");
        } catch {
            setErrorMessage("Unable to create lead.");
        } finally {
            setIsCreatingLead(false);
        }
    }

    async function handleGenerateEmailDraft(leadId: number) {
        try {
            setGeneratingEmailDraftId(leadId);
            setErrorMessage("");
            const response = await fetch(`/api/admin/leads/${leadId}/draft-email`, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to generate draft");
            }

            const newDraft: EmailDraftResponse = await response.json();

            setEmailDraftsByLeadId((current) => ({
                ...current,
                [leadId]: [newDraft, ...(current[leadId] ?? [])],
            }));
        } catch {
            setErrorMessage("Unable to generate email draft.");
        } finally {
            setGeneratingEmailDraftId(null);
        }
    }

    async function handleToggleEmailDrafts(leadId: number) {
        if (viewingEmailDraftsLeadId === leadId) {
            setViewingEmailDraftsLeadId(null);
            return;
        }

        setViewingEmailDraftsLeadId(leadId);

        if (emailDraftsByLeadId[leadId]) {
            return;
        }

        try {
            setLoadingEmailDraftsLeadId(leadId);
            setErrorMessage("");

            const response = await fetch(`/api/admin/leads/${leadId}/draft-email`);

            if (!response.ok) {
                throw new Error("Failed to load drafts");
            }

            const drafts: EmailDraftResponse[] = await response.json();

            setEmailDraftsByLeadId((current) => ({
                ...current,
                [leadId]: drafts,
            }));
        } catch {
            setErrorMessage("Unable to load email drafts.");
        } finally {
            setLoadingEmailDraftsLeadId(null);
        }
    }

    async function handleCopyEmailDraft(draft: EmailDraftResponse) {
        try {
            await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`);
            setCopiedEmailDraftId(draft.id);
            setTimeout(() => setCopiedEmailDraftId((current) => (current === draft.id ? null : current)), 2000);
        } catch {
            setErrorMessage("Unable to copy draft to clipboard.");
        }
    }

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-7xl space-y-8">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold text-slate-950">
                            Leads
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                            Track prospects who haven&apos;t contacted us yet, and generate
                            personalized cold outreach emails to introduce Advent Star.
                        </p>
                    </div>
                </header>

                {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                ) : null}

                <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <h2 className="text-lg font-semibold text-slate-950">Add a Lead</h2>
                    <form onSubmit={handleCreateLead} className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div>
                            <label
                                htmlFor="lead-contact-name"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Contact Name
                            </label>
                            <input
                                id="lead-contact-name"
                                type="text"
                                required
                                value={contactName}
                                onChange={(event) => setContactName(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lead-company-name"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Company
                            </label>
                            <input
                                id="lead-company-name"
                                type="text"
                                required
                                value={companyName}
                                onChange={(event) => setCompanyName(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lead-email"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Email
                            </label>
                            <input
                                id="lead-email"
                                type="email"
                                required
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="lead-phone"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Phone (optional)
                            </label>
                            <input
                                id="lead-phone"
                                type="tel"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label
                                htmlFor="lead-notes"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Notes
                            </label>
                            <textarea
                                id="lead-notes"
                                required
                                rows={3}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Context to personalize the outreach email — how you found them, shared connections, relevant details."
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <button
                                type="submit"
                                disabled={isCreatingLead}
                                className="inline-flex items-center justify-center rounded-full bg-[#10284a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c1f3a] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isCreatingLead ? "Adding..." : "Add Lead"}
                            </button>
                        </div>
                    </form>
                </section>

                <section className="grid gap-4">
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div
                                key={index}
                                className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-6 shadow-sm"
                            >
                                <div className="animate-pulse space-y-4">
                                    <div className="h-6 w-1/3 rounded-full bg-slate-200" />
                                    <div className="h-4 w-1/4 rounded-full bg-slate-200" />
                                    <div className="h-4 w-2/3 rounded-full bg-slate-200" />
                                    <div className="h-24 rounded-[1.25rem] bg-slate-100" />
                                </div>
                            </div>
                        ))
                    ) : leads.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm">
                            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                No leads yet
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                                Add your first lead above.
                            </h2>
                        </div>
                    ) : (
                        leads.map((lead) => {
                            const leadEmailDrafts = emailDraftsByLeadId[lead.id] ?? [];

                            return (
                                <article
                                    key={lead.id}
                                    className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-950">
                                                {lead.contact_name}
                                            </h2>
                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                                {lead.company_name}
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                {lead.email}
                                                {lead.phone ? ` · ${lead.phone}` : ""}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Added {formatSubmittedAt(lead.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleGenerateEmailDraft(lead.id)}
                                                disabled={generatingEmailDraftId === lead.id}
                                                className="inline-flex items-center justify-center rounded-full border border-[#10284a]/25 bg-[#10284a]/5 px-4 py-2 text-sm font-semibold text-[#10284a] transition hover:bg-[#10284a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {generatingEmailDraftId === lead.id ? "Generating..." : "Generate Outreach Draft"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleToggleEmailDrafts(lead.id)}
                                                disabled={loadingEmailDraftsLeadId === lead.id}
                                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {loadingEmailDraftsLeadId === lead.id
                                                    ? "Loading..."
                                                    : viewingEmailDraftsLeadId === lead.id
                                                    ? "Hide Drafts"
                                                    : "View Drafts"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-5">
                                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                            Notes
                                        </p>
                                        <p className="mt-3 text-sm leading-7 text-slate-700">
                                            {lead.notes}
                                        </p>
                                    </div>

                                    {viewingEmailDraftsLeadId === lead.id ? (
                                        <div className="mt-5 space-y-4">
                                            {leadEmailDrafts.length === 0 ? (
                                                <p className="text-sm text-slate-500">
                                                    {loadingEmailDraftsLeadId === lead.id
                                                        ? "Loading drafts..."
                                                        : "No email drafts yet. Generate one above."}
                                                </p>
                                            ) : (
                                                leadEmailDrafts.map((draft) => (
                                                    <div
                                                        key={draft.id}
                                                        className="rounded-[1.5rem] border border-sky-200 bg-sky-50/60 p-5"
                                                    >
                                                        <p className="text-xs font-semibold tracking-[0.16em] text-sky-700 uppercase">
                                                            Draft — {formatSubmittedAt(draft.created_at)}
                                                        </p>

                                                        <p className="mt-3 text-sm font-semibold text-slate-800">
                                                            {draft.subject}
                                                        </p>

                                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">
                                                            {draft.body}
                                                        </p>

                                                        {draft.open_questions.length > 0 ? (
                                                            <div className="mt-3">
                                                                <p className="text-xs font-semibold text-sky-800 uppercase">
                                                                    Open Questions
                                                                </p>
                                                                <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                                                                    {draft.open_questions.map((question, index) => (
                                                                        <li key={index}>{question}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ) : null}

                                                        <div className="mt-4 flex flex-wrap gap-3">
                                                            <a
                                                                href={buildMailtoHref(lead.email, draft.subject, draft.body)}
                                                                className="inline-flex items-center justify-center rounded-full border border-sky-300 bg-white px-4 py-2 text-xs font-semibold text-sky-800 transition hover:bg-sky-50"
                                                            >
                                                                Open in Email
                                                            </a>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleCopyEmailDraft(draft)}
                                                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                                            >
                                                                {copiedEmailDraftId === draft.id ? "Copied!" : "Copy"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })
                    )}
                </section>
            </div>
        </main>
    );
}