"use client";

import { useEffect, useState } from "react";

type Quote = {
    id: number;
    customer_id: number;
    enquiry_id: number;
    status: string;
    total_amount: string; //Money values from the backend often come back as strings when using decimals/numerics.
    notes: string | null;
    created_at: string;
}


export default function QuotesPage() {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const statusOptions = ["draft", "sent", "approved", "rejected"];

    useEffect(() => {
        async function loadQuotes() {
            try {
                const response = await fetch("http://127.0.0.1:8000/quotes");
            
            if (!response.ok) {
                throw new Error("Failed to fetch quotes.")
            }

            const data = await response.json();
            setQuotes(data);
            setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load quotes.");
            }
        }
        loadQuotes();
    }, []);

    async function handleStatusChange(quoteId: number, newStatus: string) {
        try {
            setErrorMessage("");
            
            const response = await fetch(
                `http://127.0.0.1:8000/quotes/${quoteId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({status: newStatus}),
                }
            );
        
            if (!response.ok) {
                throw new Error("Failed to update quote status");
            }
            
            const updatedQuote = await response.json(); 

            setQuotes((currentQuotes) => 
                currentQuotes.map((quote) =>
                    quote.id === quoteId ? updatedQuote : quote));
        } catch {
            setErrorMessage("Unable to update quote status.");
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
                        Admin Dashboard
                    </p> 
                    <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                        Quotes
                    </h1>
                    <p className="mt-3 text-base text-slate-600">
                        Review and track quotations.
                    </p>
                </div>
                    {errorMessage ? (
                        <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {errorMessage}
                        </p>
                        ) : null}
                <div className="grid gap-4">
                    {quotes.map((quote) => (
                        <article 
                            key={quote.id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >   
                            <select
                            value={quote.status}
                            onChange={(event) =>
                                handleStatusChange(quote.id, event.target.value)
                            }
                            >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                            </select>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-950">
                                        Quote #{quote.id}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Status: {quote.status}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-2 text-sm text-slate-600">
                                <p>Customer ID: {quote.customer_id}</p>
                                <p>Enquiry ID: {quote.enquiry_id}</p>
                                <p>Total Amount: SGD {quote.total_amount}</p>
                                <p>Created: {new Date(quote.created_at).toLocaleString()}</p>
                            </div>

                            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                                {quote.notes || "No notes provided."}
                            </div>
                        </article>
                    ))}

                    {quotes.length === 0 && !errorMessage ? (
                        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 shadow-sm">
                            No quotes yet.
                        </p>
                    ) : null}
                </div>
            </div>
        </main>
    )
}