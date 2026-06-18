import Link from "next/link";
import { apiUrl } from "@/lib/api";

type CustomerDetailPageProps = {
    params: Promise <{
        id: string; 
    }>;
}

type Customer = {
    id: number;
    name: string;
    company_name: string;
    email: string;
    phone: string | null;
    created_at: string;
}

type Enquiry = {
  id: number;
  customer_id: number | null;
  customer_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
};

type Quote = {
  id: number;
  customer_id: number;
  enquiry_id: number;
  status: string;
  total_amount: string;
  notes: string | null;
  created_at: string;
};

type Order = {
  id: number;
  customer_id: number;
  quote_id: number;
  status: string;
  notes: string | null;
  created_at: string;
};

export default async function CustomerDetailPage({
    params,
}: CustomerDetailPageProps) {
    const { id } = await params; 

    const customerResponse = await fetch(apiUrl(`/customers/${id}`), {
        cache: "no-store", // Ensures that fresh data is always fetched, instead of using outdated data.
    });

    if (!customerResponse.ok) {
        throw new Error("Failed to load customer.");
    }

    const customer: Customer = await customerResponse.json(); 

    const [enquiriesResponse, quotesResponse, ordersResponse] = await Promise.all([ // Promise.all changes sequential fetching to starting all 3 requests at the same time.
        fetch(apiUrl("/enquiries"), {
            cache: "no-store",
        }),
        fetch(apiUrl("/quotes"), {
            cache: "no-store",
        }),
        fetch(apiUrl("/orders"), {
            cache: "no-store",
        }),
    ]);

    if (!enquiriesResponse.ok || !quotesResponse.ok || !ordersResponse.ok) {
        throw new Error("Failed to load related customer records.");
    }

    const allEnquiries: Enquiry[] = await enquiriesResponse.json();
    const allQuotes: Quote[] = await quotesResponse.json();
    const allOrders: Order[] = await ordersResponse.json();
    const customerEnquiries = allEnquiries.filter(
        (enquiry) => enquiry.customer_id === customer.id
    );

    const customerQuotes = allQuotes.filter(
        (quote) => quote.customer_id === customer.id
    );

    const customerOrders = allOrders.filter(
        (order) => order.customer_id === customer.id
    );

    return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
                Admin Dashboard
                </p>
                <h1 className="mt-2 text-4xl font-semibold text-slate-950">
                {customer.company_name}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                Customer #{customer.id}
                </p>
                <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm">
                    <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                        <p>
                        <span className="font-semibold text-slate-800">Customer ID:</span>{" "}
                        {customer.id}
                        </p>
                        <p>
                        <span className="font-semibold text-slate-800">Contact Person:</span>{" "}
                        {customer.name}
                        </p>
                        <p>
                        <span className="font-semibold text-slate-800">Email:</span>{" "}
                        {customer.email}
                        </p>
                        <p>
                        <span className="font-semibold text-slate-800">Phone:</span>{" "}
                        {customer.phone || "Not provided"}
                        </p>
                        <p>
                        <span className="font-semibold text-slate-800">Created:</span>{" "}
                        {new Date(customer.created_at).toLocaleString()}
                        </p>
                    </div>
                </section>
                <section className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        Enquiries
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                        {customerEnquiries.length}
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        Quotes
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                        {customerQuotes.length}
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        Orders
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-950">
                        {customerOrders.length}
                        </p>
                    </div>
                    </section>

                    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">Enquiries</h2>

                    <div className="mt-6 space-y-4">
                        {customerEnquiries.length === 0 ? (
                        <p className="text-sm text-slate-500">No enquiries yet.</p>
                        ) : (
                        customerEnquiries.map((enquiry) => (
                            <article
                            key={enquiry.id}
                            className="rounded-2xl bg-slate-50 p-5"
                            >
                            <p className="text-sm font-semibold text-slate-800">
                                Enquiry #{enquiry.id}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                Status: {enquiry.status}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-slate-700">
                                {enquiry.message}
                            </p>
                            </article>
                        ))
                        )}
                    </div>
                    </section>

                    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">Quotes</h2>

                    <div className="mt-6 space-y-4">
                        {customerQuotes.length === 0 ? (
                        <p className="text-sm text-slate-500">No quotes yet.</p>
                        ) : (
                        customerQuotes.map((quote) => (
                            <article
                            key={quote.id}
                            className="rounded-2xl bg-slate-50 p-5"
                            >
                            <p className="text-sm font-semibold text-slate-800">
                                Quote #{quote.id}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                Status: {quote.status}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                Amount: SGD {quote.total_amount}
                            </p>
                            </article>
                        ))
                        )}
                    </div>
                    </section>

                    <section className="mt-8 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-slate-950">Orders</h2>

                    <div className="mt-6 space-y-4">
                        {customerOrders.length === 0 ? (
                        <p className="text-sm text-slate-500">No orders yet.</p>
                        ) : (
                        customerOrders.map((order) => (
                            <article
                            key={order.id}
                            className="rounded-2xl bg-slate-50 p-5"
                            >
                            <p className="text-sm font-semibold text-slate-800">
                                Order #{order.id}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                Status: {order.status}
                            </p>
                            <p className="mt-2 text-sm text-slate-600">
                                Quote ID: {order.quote_id}
                            </p>
                            </article>
                        ))
                        )}
                    </div>
                </section>
                <Link
                    href="/admin/customers"
                    className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                    >
                Back to Customers
                </Link>
            </div>
        </main>
    );
}
