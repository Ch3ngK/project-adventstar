"use client";

import { useDeferredValue, useEffect, useState } from "react";

type Quote = {
    id: number;
    customer_id: number;
    enquiry_id: number;
    status: string;
    total_amount: string;
    notes: string | null;
    created_at: string;
};

const statusOptions = ["draft", "sent", "approved", "rejected"] as const;

const statusLabelMap: Record<(typeof statusOptions)[number], string> = {
    draft: "Draft",
    sent: "Sent",
    approved: "Approved",
    rejected: "Rejected",
};

const statusBadgeClasses: Record<(typeof statusOptions)[number], string> = {
    draft: "border-slate-200 bg-slate-100 text-slate-700",
    sent: "border-sky-200 bg-sky-50 text-sky-800",
    approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rejected: "border-rose-200 bg-rose-50 text-rose-800",
};

function formatCurrency(amount: string) {
    const value = Number(amount);

    if (Number.isNaN(value)) {
        return `SGD ${amount}`;
    }

    return new Intl.NumberFormat("en-SG", {
        style: "currency",
        currency: "SGD",
        minimumFractionDigits: 2,
    }).format(value);
}

function formatCreatedAt(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | Quote["status"]>("all");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">(
        "newest"
    );
    const [updatingQuoteId, setUpdatingQuoteId] = useState<number | null>(null);
    const [deletingQuoteId, setDeletingQuoteId] = useState<number | null>(null);
    const [creatingOrderQuoteId, setCreatingOrderQuoteId] = useState<number | null>(null);
    const deferredSearchTerm = useDeferredValue(searchTerm);

    useEffect(() => {
        async function loadQuotes() {
            try {
                const response = await fetch("http://127.0.0.1:8000/quotes");

                if (!response.ok) {
                    throw new Error("Failed to fetch quotes.");
                }

                const data = await response.json();
                setQuotes(data);
                setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load quotes.");
            } finally {
                setIsLoading(false);
            }
        }

        loadQuotes();
    }, []);

    async function handleStatusChange(quoteId: number, newStatus: string) {
        try {
            setUpdatingQuoteId(quoteId);
            setErrorMessage("");

            const response = await fetch(
                `http://127.0.0.1:8000/quotes/${quoteId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update quote status.");
            }

            const updatedQuote = await response.json();

            setQuotes((currentQuotes) =>
                currentQuotes.map((quote) =>
                    quote.id === quoteId ? updatedQuote : quote
                )
            );
        } catch {
            setErrorMessage("Unable to update quote status.");
        } finally {
            setUpdatingQuoteId(null);
        }
    }

    async function handleDeleteQuote(quoteId: number) {
        const confirmed = window.confirm(
            "Delete this quote? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingQuoteId(quoteId);
            setErrorMessage("");

            const response = await fetch(`http://127.0.0.1:8000/quotes/${quoteId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete quote.");
            }

            setQuotes((currentQuotes) =>
                currentQuotes.filter((quote) => quote.id !== quoteId)
            );
        } catch {
            setErrorMessage("Unable to delete quote.");
        } finally {
            setDeletingQuoteId(null);
        }
    }

    async function handleCreateOrder(quote: Quote) {
        if (quote.status !== "approved") {
            setErrorMessage("Only approved quotes can be converted to orders.")
            return;
        }
        
        try {
            setCreatingOrderQuoteId(quote.id);
            setErrorMessage("");

            const response = await fetch(`http://127.0.0.1:8000/orders`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        customer_id: quote.customer_id,
                        quote_id: quote.id,
                        notes: "Created from approved quote.",
                    }),
                })
            
            if (!response.ok) {
                throw new Error("Failed to create order.")
            }

            await response.json()
        } catch {
            setErrorMessage("Unable to create order.")
        } finally {
            setCreatingOrderQuoteId(null);
        }
    }

    const normalizedSearchTerm = deferredSearchTerm.trim().toLowerCase();

    const visibleQuotes = quotes
        .filter((quote) => {
            const matchesStatus =
                statusFilter === "all" || quote.status === statusFilter;

            const matchesSearch =
                normalizedSearchTerm === "" ||
                quote.id.toString().includes(normalizedSearchTerm) ||
                quote.customer_id.toString().includes(normalizedSearchTerm) ||
                quote.enquiry_id.toString().includes(normalizedSearchTerm) ||
                quote.status.toLowerCase().includes(normalizedSearchTerm) ||
                (quote.notes ?? "").toLowerCase().includes(normalizedSearchTerm);

            return matchesStatus && matchesSearch;
        })
        .sort((first, second) => {
            if (sortOrder === "highest" || sortOrder === "lowest") {
                const firstAmount = Number(first.total_amount);
                const secondAmount = Number(second.total_amount);

                return sortOrder === "highest"
                    ? secondAmount - firstAmount
                    : firstAmount - secondAmount;
            }

            const firstTime = new Date(first.created_at).getTime();
            const secondTime = new Date(second.created_at).getTime();

            return sortOrder === "newest"
                ? secondTime - firstTime
                : firstTime - secondTime;
        });

    const draftQuotes = quotes.filter((quote) => quote.status === "draft").length;
    const sentQuotes = quotes.filter((quote) => quote.status === "sent").length;
    const approvedQuotes = quotes.filter((quote) => quote.status === "approved").length;
    const rejectedQuotes = quotes.filter((quote) => quote.status === "rejected").length;
    const totalQuotedValue = quotes.reduce(
        (sum, quote) => sum + (Number(quote.total_amount) || 0),
        0
    );
    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "all";

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-7xl space-y-8">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
                            Admin Dashboard
                        </p>
                        <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                            Quotations
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                            Keep pricing decisions visible, track quote status at a glance,
                            and review the commercial details without digging through a flat list.
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            Portfolio Value
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-slate-950">
                            {formatCurrency(String(totalQuotedValue))}
                        </p>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                            Total Quotes
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                            {quotes.length}
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                            Draft
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                            {draftQuotes}
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] border border-sky-200 bg-sky-50/80 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase">
                            Sent
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-sky-900">
                            {sentQuotes}
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
                            Approved
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-emerald-900">
                            {approvedQuotes}
                        </p>
                    </div>
                    <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50/80 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.18em] text-rose-700 uppercase">
                            Rejected
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-rose-900">
                            {rejectedQuotes}
                        </p>
                    </div>
                </section>

                {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                ) : null}

                <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
                        <div>
                            <label
                                htmlFor="search-quotes"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Search
                            </label>
                            <input
                                id="search-quotes"
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search by quote, customer, enquiry, status, or notes"
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-amber-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="filter-quote-status"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Status Filter
                            </label>
                            <select
                                id="filter-quote-status"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(event.target.value as "all" | Quote["status"])
                                }
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-amber-500"
                            >
                                <option value="all">All statuses</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {statusLabelMap[status]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="quote-sort-order"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Sort
                            </label>
                            <select
                                id="quote-sort-order"
                                value={sortOrder}
                                onChange={(event) =>
                                    setSortOrder(
                                        event.target.value as
                                            | "newest"
                                            | "oldest"
                                            | "highest"
                                            | "lowest"
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-amber-500"
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                                <option value="highest">Highest amount</option>
                                <option value="lowest">Lowest amount</option>
                            </select>
                        </div>
                    </div>
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
                    ) : visibleQuotes.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm">
                            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                No matching quotes
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                                {hasActiveFilters
                                    ? "Try broadening the search or changing the status filter."
                                    : "No quotations have been created yet."}
                            </h2>
                            <p className="mt-3 text-sm leading-7 text-slate-600">
                                {hasActiveFilters
                                    ? "The current search and filter settings did not return any quote records."
                                    : "Once quotes are created from enquiries, they will appear here for review and follow-up."}
                            </p>
                        </div>
                    ) : (
                        visibleQuotes.map((quote) => {
                            const statusKey = quote.status as (typeof statusOptions)[number];

                            return (
                                <article
                                    key={quote.id}
                                    className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/90 shadow-sm"
                                >
                                    <div className="border-b border-slate-100 bg-[linear-gradient(135deg,_rgba(248,250,252,0.95)_0%,_rgba(238,242,255,0.95)_100%)] px-6 py-5">
                                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h2 className="text-2xl font-semibold text-slate-950">
                                                            Quote #{quote.id}
                                                        </h2>
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${statusBadgeClasses[statusKey]}`}
                                                        >
                                                            {statusLabelMap[statusKey]}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-slate-500">
                                                        Created {formatCreatedAt(quote.created_at)}
                                                    </p>
                                                </div>

                                                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 xl:grid-cols-4">
                                                    <p>
                                                        <span className="font-semibold text-slate-800">
                                                            Customer ID:
                                                        </span>{" "}
                                                        {quote.customer_id}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-800">
                                                            Enquiry ID:
                                                        </span>{" "}
                                                        {quote.enquiry_id}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-800">
                                                            Amount:
                                                        </span>{" "}
                                                        {formatCurrency(quote.total_amount)}
                                                    </p>
                                                    <p>
                                                        <span className="font-semibold text-slate-800">
                                                            Status:
                                                        </span>{" "}
                                                        {statusLabelMap[statusKey]}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 xl:min-w-60 xl:items-end">
                                                <div className="w-full xl:w-60">
                                                    <label
                                                        htmlFor={`quote-status-${quote.id}`}
                                                        className="mb-2 block text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase"
                                                    >
                                                        Update Status
                                                    </label>
                                                    <select
                                                        id={`quote-status-${quote.id}`}
                                                        value={quote.status}
                                                        onChange={(event) =>
                                                            handleStatusChange(
                                                                quote.id,
                                                                event.target.value
                                                            )
                                                        }
                                                        disabled={updatingQuoteId === quote.id}
                                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {statusOptions.map((status) => (
                                                            <option key={status} value={status}>
                                                                {statusLabelMap[status]}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <p className="text-xs font-medium text-slate-500">
                                                    {updatingQuoteId === quote.id
                                                        ? "Saving status..."
                                                        : "Status updates are applied immediately."}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteQuote(quote.id)}
                                                    disabled={deletingQuoteId === quote.id}
                                                    className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {deletingQuoteId === quote.id
                                                        ? "Deleting..."
                                                        : "Delete Quote"}
                                                </button>

                                                <button 
                                                    type="button"
                                                    onClick={() => handleCreateOrder(quote)}
                                                    disabled={creatingOrderQuoteId === quote.id || quote.status != "approved"}
                                                    className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {creatingOrderQuoteId === quote.id ? "Creating Order..." : "Create Order"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-5">
                                        <div className="rounded-[1.5rem] bg-slate-50 p-5">
                                            <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                                Notes
                                            </p>
                                            <p className="mt-3 text-sm leading-7 text-slate-700">
                                                {quote.notes || "No notes provided for this quotation."}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    )}
                </section>
            </div>
        </main>
    );
}
