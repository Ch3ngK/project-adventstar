"use client";

import { useEffect, useState } from "react"; 

type Enquiry = {
    id: number; 
    customer_name: string;
    company_name: string | null;
    email: string;
    phone: string | null; 
    message: string; 
    status: string; 
    created_at: string; 
}; 

const statusOptions = ["new", "contacted", "quoted", "closed"]; 

export default function AdminEnquiriesPage() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]); 
    const [errorMessage, setErrorMessage] = useState("");
    const [deletingEnquiryId, setDeletingEnquiryId] = useState<number | null>(null);

    useEffect(() => {
        async function loadEnquiries() {
            try {
                const response = await fetch("http://127.0.0.1:8000/enquiries");
                if (!response.ok) {
                    throw new Error("Failed to fetch enquiries."); 
                }

                const data = await response.json(); 
                setEnquiries(data);
                setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load enquiries."); 
            }  
        }
        
        loadEnquiries(); 
    }, []);

    async function handleStatusChange(enquiryId: number, newStatus: string) {
        try {
            setErrorMessage("");
            const response = await fetch(`http://127.0.0.1:8000/enquiries/${enquiryId}/status`,
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

            const response = await fetch(`http://127.0.0.1:8000/enquiries/${enquiryId}`, {
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

    return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">
            Customer Enquiries
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Review incoming enquiries submitted through the website.
          </p>
        </div>

        {errorMessage ? (
          <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </p>
        ) : null}

        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <article
              key={enquiry.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    {enquiry.customer_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {enquiry.company_name || "No company provided"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:items-end">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor={`status-${enquiry.id}`}
                      className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase"
                    >
                      Status
                    </label>
                    <select
                      id={`status-${enquiry.id}`}
                      value={enquiry.status}
                      onChange={(event) =>
                        handleStatusChange(enquiry.id, event.target.value)
                      }
                      className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteEnquiry(enquiry.id)}
                    disabled={deletingEnquiryId === enquiry.id}
                    className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingEnquiryId === enquiry.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p>Email: {enquiry.email}</p>
                <p>Phone: {enquiry.phone || "Not provided"}</p>
                <p>Submitted: {new Date(enquiry.created_at).toLocaleString()}</p>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                {enquiry.message}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
