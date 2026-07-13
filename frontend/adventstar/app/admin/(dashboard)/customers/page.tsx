"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleCustomers = customers.filter(
    (customer) =>
      normalizedSearchTerm === "" ||
      customer.name.toLowerCase().includes(normalizedSearchTerm) ||
      customer.company_name.toLowerCase().includes(normalizedSearchTerm) ||
      customer.email.toLowerCase().includes(normalizedSearchTerm)
  );

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch("/api/admin/customers");

        if (!response.ok) {
          throw new Error("Failed to fetch customers.");
        }

        const data = await response.json();
        setCustomers(data);
        setErrorMessage("");
      } catch {
        setErrorMessage("Unable to load customers.");
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, []);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          {errorMessage ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </p>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-slate-500">Loading customers...</p>
          ) : null}

          <h1 className="text-4xl font-semibold text-slate-950">
            Customers
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            View customer records and keep track of the organisations you&apos;ve
            worked with.
          </p>
        </header>

        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm">
          <label
            htmlFor="search-customers"
            className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
          >
            Search
          </label>
          <input
            id="search-customers"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by company, contact, or email."
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
          />
        </section>

        {!isLoading && !errorMessage && visibleCustomers.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              No matching customers
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
              Try a different search term.
            </h2>
          </div>
        ) : null}

        <section className="grid gap-4">
          {!isLoading &&
            visibleCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/admin/customers/${customer.id}`}
                className="block rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#10284a]/20 hover:shadow-md"
              >
                <div className="space-y-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">
                      {customer.company_name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Customer #{customer.id}
                    </p>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-800">
                        Contact:
                      </span>{" "}
                      {customer.name}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">
                        Email:
                      </span>{" "}
                      {customer.email}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">
                        Phone:
                      </span>{" "}
                      {customer.phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">
                        Created:
                      </span>{" "}
                      {new Date(customer.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </section>
      </div>
    </main>
  );
}
