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

async function getEnquiries(): Promise<Enquiry[]> {
    const response = await fetch("http://127.0.0.1:8000/enquiries", {
        cache: "no-store", //cache: "no-store" helps show fresh data during development
    }); 

    if (!response.ok) {
        throw new Error("Failed to fetch enquiries.");
    }

    return response.json(); 
}

export default async function enquiries() {
    const enquiries = await getEnquiries(); 

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

                <div className="grid gap-4">
                    {enquiries.map((enquiry) => (
                        <article
                            key={enquiry.id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-950">
                                        {enquiry.customer_name}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {enquiry.company_name || "No company provided"}
                                    </p>
                                </div>
                                <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-amber-800">
                                    {enquiry.status}
                                </span>
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
    )
}