"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { buildMailtoHref } from "@/lib/mailto";

type Enquiry = {
    id: number; 
    customer_name: string;
    customer_id: number | null;
    company_name: string | null;
    email: string;
    phone: string | null; 
    message: string; 
    status: string; 
    created_at: string; 
}; 

type QuoteDraftItem = {
  description: string;
  quantity: number | null; 
}

type QuoteDraftResponse = {
  id: number; 
  enquiry_id: number;
  items: QuoteDraftItem[];
  suggested_notes: string;
  open_questions: string[];
  created_at: string; 
}

type EmailDraftResponse = {
  id: number;
  kind: string; 
  enquiry_id: number | null;
  subject: string; 
  body: string; 
  open_questions: string[];
  created_at: string; 
}

const statusOptions = ["new", "contacted", "quoted", "closed"] as const;

const statusLabelMap: Record<(typeof statusOptions)[number], string> = {
    new: "New",
    contacted: "Contacted",
    quoted: "Quoted",
    closed: "Closed",
};

const statusBadgeClasses: Record<(typeof statusOptions)[number], string> = {
    new: "border-amber-200 bg-amber-50 text-amber-800",
    contacted: "border-sky-200 bg-sky-50 text-sky-800",
    quoted: "border-violet-200 bg-violet-50 text-violet-800",
    closed: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

function formatSubmittedAt(value: string) {
    return new Intl.DateTimeFormat("en-SG", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | Enquiry["status"]>("all");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
    const [updatingEnquiryId, setUpdatingEnquiryId] = useState<number | null>(null);
    const [deletingEnquiryId, setDeletingEnquiryId] = useState<number | null>(null);
    const [quoteFormEnquiry, setQuoteFormEnquiry] = useState<Enquiry | null>(null);
    const [quoteAmount, setQuoteAmount] = useState("");
    const [generatingDraftId, setGeneratingDraftId] = useState<number | null>(null); 
    const [draftsByEnquiryId, setDraftsByEnquiryId] = useState<Record<number, QuoteDraftResponse[]>>({}); // Cache that holds each enquiry's list of generated drafts
    const [viewingDraftsEnquiryId, setViewingDraftsEnquiryId] = useState<number | null>(null); 
    const [loadingDraftsEnquiryId, setLoadingDraftsEnquiryId] = useState<number | null>(null); 
    const [quoteNotes, setQuoteNotes] = useState("");
    const [isCreatingQuote, setIsCreatingQuote] = useState(false);
    const [generatingEmailDraftId, setGeneratingEmailDraftId] = useState<number | null>(null); 
    const [emailDraftsByEnquiryId, setEmailDraftsByEnquiryId] = useState<Record<number, EmailDraftResponse[]>>({});
    const [viewingEmailDraftsEnquiryId, setViewingEmailDraftsEnquiryId] = useState<number | null>(null);
    const [loadingEmailDraftsEnquiryId, setLoadingEmailDraftsEnquiryId] = useState<number | null>(null);
    const [copiedEmailDraftId, setCopiedEmailDraftId] = useState<number | null>(null);
    const deferredSearchTerm = useDeferredValue(searchTerm); //Delayed version of searchTerm for better UI performance

    useEffect(() => {
        async function loadEnquiries() {
            try {
                const response = await fetch("/api/admin/enquiries");
                if (!response.ok) {
                    throw new Error("Failed to fetch enquiries."); 
                }

                const data = await response.json(); 
                setEnquiries(data);
                setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load enquiries."); 
            } finally {
                setIsLoading(false);
            }
        }
        
        loadEnquiries(); 
    }, []);

    async function handleStatusChange(enquiryId: number, newStatus: string) {
        try {
            setUpdatingEnquiryId(enquiryId);
            setErrorMessage("");
            const response = await fetch(`/api/admin/enquiries/${enquiryId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json", 
                    }, 
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update status."); 
            }

            const updatedEnquiry = await response.json(); 

            setEnquiries((currentEnquiries) => 
                currentEnquiries.map((enquiry) =>
                    enquiry.id === enquiryId ? updatedEnquiry : enquiry
                )
            );
        } catch {
            setErrorMessage("Unable to update enquiry status.");
        } finally {
            setUpdatingEnquiryId(null);
        }
    }

    async function handleGenerateDraft(enquiryId: number) {
        try {
          setGeneratingDraftId(enquiryId);
          setErrorMessage("");
          const response = await fetch(`/api/admin/enquiries/${enquiryId}/draft-quote`, {
              method: "POST",
          });

          if (!response.ok) {
            throw new Error("Failed to generate draft");
          }

          const newDraft: QuoteDraftResponse = await response.json();

          setDraftsByEnquiryId((current) => ({
              ...current, 
              [enquiryId]: [newDraft, ...(current[enquiryId] ?? [])],
          }));
        } catch {
          setErrorMessage("Unable to generate quote draft.");
        } finally {
          setGeneratingDraftId(null);
        }
    }

    async function handleToggleDrafts(enquiryId: number) {
      if (viewingDraftsEnquiryId === enquiryId) {
        setViewingDraftsEnquiryId(null);
        return; 
      }

      setViewingDraftsEnquiryId(enquiryId);

      if (draftsByEnquiryId[enquiryId]) {
        return;
      }

      try {
        setLoadingDraftsEnquiryId(enquiryId);
        setErrorMessage("");

        const response = await fetch(`/api/admin/enquiries/${enquiryId}/draft-quote`);

        if (!response.ok) {
          throw new Error("Failed to load drafts"); 
        }

        const drafts: QuoteDraftResponse[] = await response.json();

        setDraftsByEnquiryId((current) => ({
          ...current, 
          [enquiryId]: drafts, 
        }));
      } catch {
        setErrorMessage("Unable to load quote drafts.");
      } finally {
        setLoadingDraftsEnquiryId(null); 
      }
    }

    async function handleDeleteEnquiry(enquiryId: number) {
        const confirmed = window.confirm(
            "Delete this enquiry? This action cannot be undone."
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingEnquiryId(enquiryId);
            setErrorMessage("");

            const response = await fetch(`/api/admin/enquiries/${enquiryId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete enquiry.");
            }

            setEnquiries((currentEnquiries) =>
                currentEnquiries.filter((enquiry) => enquiry.id !== enquiryId)
            );
        } catch {
            setErrorMessage("Unable to delete enquiry.");
        } finally {
            setDeletingEnquiryId(null);
        }
    }

    function handleCreateQuote(enquiry: Enquiry) {
        if (!enquiry.customer_id) {
            setErrorMessage("This enquiry is not linked to a customer.");
            return;
        }

        setErrorMessage("");
        setQuoteFormEnquiry(enquiry);
        setQuoteAmount("");
        setQuoteNotes("");
    }

    async function handleSubmitQuote() {
        if (!quoteFormEnquiry) {
            return;
        }

        if (!quoteAmount.trim()) {
            setErrorMessage("Please enter a quote amount.");
            return;
        }

        try {
            setIsCreatingQuote(true); 
            setErrorMessage(""); 

            const response = await fetch("/api/admin/quotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_id: quoteFormEnquiry.customer_id,
                    enquiry_id: quoteFormEnquiry.id,
                    total_amount: quoteAmount,
                    notes: quoteNotes || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create quote"); 
            }

            await handleStatusChange(quoteFormEnquiry.id, "quoted");
            setQuoteFormEnquiry(null); 
            setQuoteAmount("");
            setQuoteNotes("");
        } catch {
            setErrorMessage("Unable to create quote.");
        } finally {
            setIsCreatingQuote(false);
        }
    }

    async function handleGenerateEmailDraft(enquiryId: number) {
      try {
        setGeneratingEmailDraftId(enquiryId);
        setErrorMessage(""); 
        const response = await fetch(`/api/admin/enquiries/${enquiryId}/draft-email`, {
          method: "POST",
        }); 

        if (!response.ok) {
          throw new Error("Failed to generate draft"); 
        }

        const newDraft: EmailDraftResponse = await response.json();

        setEmailDraftsByEnquiryId((current) => ({
          ...current, 
          [enquiryId]: [newDraft, ...(current[enquiryId] ?? [])],
        }));
      } catch {
        setErrorMessage("Unable to generate email draft."); 
      } finally {
        setGeneratingEmailDraftId(null);
      }
    }

    async function handleToggleEmailDrafts(enquiryId: number) {
      if (viewingEmailDraftsEnquiryId === enquiryId) {
        setViewingEmailDraftsEnquiryId(null);
        return; 
      }

      setViewingEmailDraftsEnquiryId(enquiryId);

      if (emailDraftsByEnquiryId[enquiryId]) {
        return;
      }

      try {
        setLoadingEmailDraftsEnquiryId(enquiryId);
        setErrorMessage("");

        const response = await fetch(`/api/admin/enquiries/${enquiryId}/draft-email`);

        if (!response.ok) {
          throw new Error("Failed to load drafts"); 
        }

        const drafts: EmailDraftResponse[] = await response.json();

        setEmailDraftsByEnquiryId((current) => ({
          ...current, 
          [enquiryId]: drafts,
        }));
      } catch {
        setErrorMessage("Unable to load email drafts.");
      } finally {
        setLoadingEmailDraftsEnquiryId(null); 
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

    const normalizedSearchTerm = deferredSearchTerm.trim().toLowerCase(); // Prepares search text so matching is easier

    const visibleEnquiries = enquiries
        .filter((enquiry) => {
            const matchesStatus =
                statusFilter === "all" || enquiry.status === statusFilter;

            const matchesSearch =
                normalizedSearchTerm === "" ||
                enquiry.customer_name.toLowerCase().includes(normalizedSearchTerm) ||
                (enquiry.company_name ?? "").toLowerCase().includes(normalizedSearchTerm) ||
                enquiry.email.toLowerCase().includes(normalizedSearchTerm) ||
                enquiry.message.toLowerCase().includes(normalizedSearchTerm);

            return matchesStatus && matchesSearch;
        })
        .sort((first, second) => {
            const firstTime = new Date(first.created_at).getTime();
            const secondTime = new Date(second.created_at).getTime();

            return sortOrder === "newest"
                ? secondTime - firstTime
                : firstTime - secondTime;
        });

    const totalEnquiries = enquiries.length;
    const newEnquiries = enquiries.filter((enquiry) => enquiry.status === "new").length;
    const contactedEnquiries = enquiries.filter((enquiry) => enquiry.status === "contacted").length;
    const quotedEnquiries = enquiries.filter((enquiry) => enquiry.status === "quoted").length;
    const closedEnquiries = enquiries.filter((enquiry) => enquiry.status === "closed").length;
    const hasActiveFilters = searchTerm.trim() !== "" || statusFilter !== "all";

    return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">
              Customer Enquiries
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Review incoming enquiries, find the right customer quickly, and keep
              statuses moving without digging through a long unstructured list.
            </p>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Total
            </p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalEnquiries}</p>
          </div>
          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/80 p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-amber-700 uppercase">
              New
            </p>
            <p className="mt-3 text-3xl font-semibold text-amber-900">{newEnquiries}</p>
          </div>
          <div className="rounded-[1.75rem] border border-sky-200 bg-sky-50/80 p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-sky-700 uppercase">
              Contacted
            </p>
            <p className="mt-3 text-3xl font-semibold text-sky-900">{contactedEnquiries}</p>
          </div>
          <div className="rounded-[1.75rem] border border-violet-200 bg-violet-50/80 p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-violet-700 uppercase">
              Quoted
            </p>
            <p className="mt-3 text-3xl font-semibold text-violet-900">{quotedEnquiries}</p>
          </div>
          <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50/80 p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700 uppercase">
              Closed
            </p>
            <p className="mt-3 text-3xl font-semibold text-emerald-900">{closedEnquiries}</p>
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
                htmlFor="search-enquiries"
                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
              >
                Search
              </label>
              <input
                id="search-enquiries"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by contact, company, email, or message"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
              />
            </div>

            <div>
              <label
                htmlFor="filter-status"
                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
              >
                Status Filter
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | Enquiry["status"])
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#10284a]"
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
                htmlFor="sort-order"
                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
              >
                Sort
              </label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as "newest" | "oldest")
                }
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#10284a]"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
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
          ) : visibleEnquiries.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm">
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                No matching enquiries
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {hasActiveFilters ? "Try broadening the search or status filter." : "No enquiries have been submitted yet."}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {hasActiveFilters
                  ? "The current filter set did not return any results."
                  : "Once customers submit the enquiry form, they will appear here for review."}
              </p>
            </div>
          ) : (
            visibleEnquiries.map((enquiry) => {
              const statusKey = enquiry.status as (typeof statusOptions)[number];
              const enquiryDrafts = draftsByEnquiryId[enquiry.id] ?? [];
              const enquiryEmailDrafts = emailDraftsByEnquiryId[enquiry.id] ?? [];

              return (
                <article
                  key={enquiry.id}
                  className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-semibold text-slate-950">
                            {enquiry.customer_name}
                          </h2>
                          <span
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${statusBadgeClasses[statusKey]}`}
                          >
                            {statusLabelMap[statusKey]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {enquiry.company_name || "No company provided"}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                          <span className="font-semibold text-slate-800">Email:</span>{" "}
                          <a href={`mailto:${enquiry.email}`} className="text-slate-700 underline decoration-slate-300 underline-offset-4">
                            {enquiry.email}
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Phone:</span>{" "}
                          {enquiry.phone ? (
                            <a href={`tel:${enquiry.phone}`} className="text-slate-700 underline decoration-slate-300 underline-offset-4">
                              {enquiry.phone}
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Submitted:</span>{" "}
                          {formatSubmittedAt(enquiry.created_at)}
                        </p>
                        <p>
                          <span className="font-semibold text-slate-800">Customer ID:</span>{" "}
                          {enquiry.customer_id ?? "Not created yet"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 xl:min-w-56 xl:items-end">
                      <div className="w-full xl:w-56">
                        <label
                          htmlFor={`status-${enquiry.id}`}
                          className="mb-2 block text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase"
                        >
                          Update Status
                        </label>
                        <select
                          id={`status-${enquiry.id}`}
                          value={enquiry.status}
                          onChange={(event) =>
                            handleStatusChange(enquiry.id, event.target.value)
                          }
                          disabled={updatingEnquiryId === enquiry.id}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#10284a] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabelMap[status]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <p className="text-xs font-medium text-slate-500">
                        {updatingEnquiryId === enquiry.id ? "Saving status..." : "Status updates are applied immediately."}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleDeleteEnquiry(enquiry.id)}
                        disabled={deletingEnquiryId === enquiry.id}
                        className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {deletingEnquiryId === enquiry.id ? "Deleting..." : "Delete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateQuote(enquiry)}
                        className="inline-flex items-center justify-center rounded-full border border-[#10284a]/25 bg-[#10284a]/5 px-4 py-2 text-sm font-semibold text-[#10284a] transition hover:bg-[#10284a]/10"
                        >
                          Create Quote
                      </button>
                      <button
                        type="button" 
                        onClick={() => handleGenerateDraft(enquiry.id)}
                        disabled={generatingDraftId === enquiry.id}
                        className="inline-flex items-center justify-center rounded-full border border-[#10284a]/25 bg-[#10284a]/5 px-4 py-2 text-sm font-semibold text-[#10284a] transition hover:bg-[#10284a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {generatingDraftId === enquiry.id ? "Generating..." : "Generate Quote Draft"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleToggleDrafts(enquiry.id)}
                        disabled={loadingDraftsEnquiryId === enquiry.id}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingDraftsEnquiryId === enquiry.id
                          ? "Loading..."
                          : viewingDraftsEnquiryId === enquiry.id
                          ? "Hide Drafts"
                          : "View Drafts"
                        }
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGenerateEmailDraft(enquiry.id)}
                        disabled={generatingEmailDraftId === enquiry.id}
                        className="inline-flex items-center justify-center rounded-full border border-[#10284a]/25 bg-[#10284a]/5 px-4 py-2 text-sm font-semibold text-[#10284a] transition hover:bg-[#10284a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {generatingEmailDraftId === enquiry.id ? "Generating..." : "Generate Email Draft"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleEmailDrafts(enquiry.id)}
                        disabled={loadingEmailDraftsEnquiryId === enquiry.id}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loadingEmailDraftsEnquiryId === enquiry.id ? "Loading..." : viewingEmailDraftsEnquiryId === enquiry.id ? 
                        "Hide Email Drafts" : "View Email Drafts"}
                      </button>
                      </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-5">
                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                      Enquiry Brief
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {enquiry.message}
                    </p>
                  </div>

                   {viewingDraftsEnquiryId === enquiry.id ? (
                    <div className="mt-5 space-y-4">
                      {enquiryDrafts.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          {loadingDraftsEnquiryId === enquiry.id
                            ? "Loading drafts..."
                            : "No quote drafts yet. Generate one above."}
                        </p>
                      ) : (
                        enquiryDrafts.map((draft) => (
                          <div
                            key={draft.id}
                            className="rounded-[1.5rem] border border-amber-200 bg-amber-50/60 p-5"
                          >
                            <p className="text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
                              Draft — {formatSubmittedAt(draft.created_at)}
                            </p>

                            <ul className="mt-3 space-y-1 text-sm text-slate-700">
                              {draft.items.map((item, index) => (
                                <li key={index}>
                                  {item.description}
                                  {item.quantity ? ` — qty ${item.quantity}` : ""}
                                </li>
                              ))}
                            </ul>

                            <p className="mt-3 text-sm leading-6 text-slate-700">
                              {draft.suggested_notes}
                            </p>

                            {draft.open_questions.length > 0 ? (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-amber-800 uppercase">
                                  Open Questions
                                </p>
                                <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
                                  {draft.open_questions.map((question, index) => (
                                    <li key={index}>{question}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : null}
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}

                  {viewingEmailDraftsEnquiryId === enquiry.id ? (
                    <div className="mt-5 space-y-4">
                      {enquiryEmailDrafts.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          {loadingEmailDraftsEnquiryId === enquiry.id
                            ? "Loading drafts..."
                            : "No email drafts yet. Generate one above."}
                        </p>
                      ) : (
                        enquiryEmailDrafts.map((draft) => (
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
                                href={buildMailtoHref(enquiry.email, draft.subject, draft.body)}
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
      {quoteFormEnquiry ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-slate-950">
              Create Quote
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              For {quoteFormEnquiry.customer_name}
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Total Amount
                </label>
                <input
                  type="text"
                  value={quoteAmount}
                  onChange={(event) => setQuoteAmount(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  placeholder="e.g. 1200.00"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  value={quoteNotes}
                  onChange={(event) => setQuoteNotes(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                  rows={4}
                  placeholder="Add any pricing or delivery notes"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSubmitQuote}
                disabled={isCreatingQuote}
                className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
              >
                {isCreatingQuote ? "Creating..." : "Create Quote"}
              </button>

              <button
                type="button"
                onClick={() => setQuoteFormEnquiry(null)}
                className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
