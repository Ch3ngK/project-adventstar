"use client";

import { useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";

const statusOptions = [
    "pending",
    "in_production",
    "ready",
    "delivered",
    "cancelled",
] as const;

type OrderStatus = (typeof statusOptions)[number];

type Order = {
    id: number;
    customer_id: number;
    quote_id: number;
    status: OrderStatus;
    notes: string | null;
    created_at: string;
};

type Customer = {
    id: number;
    name: string;
    company_name: string;
    email: string;
    phone: string | null;
    created_at: string;
}

const statusLabelMap: Record<OrderStatus, string> = {
    pending: "Pending",
    in_production: "In Production",
    ready: "Ready",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const statusBadgeClasses: Record<OrderStatus, string> = {
    pending: "border-amber-200 bg-amber-50 text-amber-800",
    in_production: "border-sky-200 bg-sky-50 text-sky-800",
    ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
    delivered: "border-slate-200 bg-slate-100 text-slate-700",
    cancelled: "border-rose-200 bg-rose-50 text-rose-800",
};

export default function OrdersPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all"); // By default, status filter is set to "all".
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest"); // By default, show newest orders first.
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);
    const deferredSearchTerm = useDeferredValue(searchTerm)

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await fetch("/api/admin/orders");
                const customerResponse = await fetch("/api/admin/customers");

                if (!response.ok) {
                    throw new Error("Failed to fetch orders.");
                }

                if (!customerResponse.ok) {
                    throw new Error("Failed to fetch customer details.");
                }

                const data = await response.json();
                const customerData = await customerResponse.json(); 

                setOrders(data);
                setCustomers(customerData);
                setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load orders.");
            } finally {
                setIsLoading(false);
            }
        }

        loadOrders();
    }, []);

    async function handleStatusChange(orderId: number, newStatus: string) {
        try {
            setUpdatingOrderId(orderId);
            setErrorMessage("");

            const response = await fetch(
                `/api/admin/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update order status.");
            }

            const updatedOrder = await response.json();

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId ? updatedOrder : order
                )
            );
        } catch {
            setErrorMessage("Unable to update order.");
        } finally {
            setUpdatingOrderId(null);
        }
    }

    async function handleDeleteOrder(orderId: number) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this order"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingOrderId(orderId);
            setErrorMessage(""); 

            const response = await fetch(`/api/admin/orders/${orderId}`, 
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) { // (!response.ok) shows whether the HTTP request succeeded (boolean). 
                throw new Error("Failed to delete order");
            }
            
            setOrders((currentOrders) => 
                currentOrders.filter((order) => order.id != orderId));
        } catch {
            setErrorMessage("Unable to delete order.");
        } finally {
            setDeletingOrderId(null);
        }
    }

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === "pending").length;
    const inProductionOrders = orders.filter(
        (order) => order.status === "in_production"
    ).length;
    const readyOrders = orders.filter((order) => order.status === "ready").length;
    const deliveredOrders = orders.filter(
        (order) => order.status === "delivered"
    ).length;

    const normalizedSearchTerm = deferredSearchTerm.trim().toLowerCase();
    const hasActiveFilters = searchTerm.trim() != "" || statusFilter != "all";
    const visibleOrders = [...orders] // [...orders] creates a copy of the array, as .sort() mutates the array
        .filter((order) => {
            const matchesStatus = 
                statusFilter === "all" || order.status === statusFilter;

            const customer = customers.find(
                (customer) => customer.id === order.customer_id
            );

            const matchesSearch = 
                normalizedSearchTerm == "" ||
                order.id.toString().includes(normalizedSearchTerm) ||
                order.customer_id.toString().includes(normalizedSearchTerm) ||
                order.quote_id.toString().includes(normalizedSearchTerm) ||
                order.status.toLowerCase().includes(normalizedSearchTerm) ||
                (order.notes ?? "").toLowerCase().includes(normalizedSearchTerm) ||
                (customer?.company_name ?? "").toLowerCase().includes(normalizedSearchTerm) ||
                (customer?.name ?? "").toLowerCase().includes(normalizedSearchTerm) ||
                (customer?.email ?? "").toLowerCase().includes(normalizedSearchTerm);

            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            const aTime = new Date(a.created_at).getTime(); 
            const bTime = new Date(b.created_at).getTime(); 

            if (sortOrder === "newest") {
                return bTime - aTime;
            }

            return aTime - bTime;
        });

    return (
        <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-950">
            <div className="mx-auto max-w-6xl space-y-6">
                <header>
                    <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                        Admin
                    </p>
                    <h1 className="mt-2 text-4xl font-semibold">Orders</h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                        Track confirmed customer work after an approved quote becomes an
                        order.
                    </p>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            Total Orders
                        </p>
                        <p className="mt-3 text-3xl font-semibold">{totalOrders}</p>
                    </div>

                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
                            Pending
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-amber-900">
                            {pendingOrders}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-sky-700 uppercase">
                            In Production
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-sky-900">
                            {inProductionOrders}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
                            Ready
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-emerald-900">
                            {readyOrders}
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                            Delivered
                        </p>
                        <p className="mt-3 text-3xl font-semibold">{deliveredOrders}</p>
                    </div>
                </section>

                {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                ) : null}

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">
                        <div>
                            <label
                                htmlFor="order-search"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Search
                            </label>
                            <input
                                id="order-search"
                                type="search"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                placeholder="Search customer, email, order, quote, status, or notes"
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="order-status-filter"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Status Filter
                            </label>

                            <select
                                id="order-status-filter"
                                value={statusFilter}
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value as "all" | OrderStatus
                                    )
                                }
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
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
                                htmlFor="order-sort"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Sort
                            </label>

                            <select
                                id="order-sort"
                                value={sortOrder}
                                onChange={(event) =>
                                    setSortOrder(event.target.value as "newest" | "oldest")
                                }
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                            >
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="grid gap-4">
                    {isLoading ? <p>Loading orders...</p> : null}

                    {!isLoading && visibleOrders.length === 0 && !errorMessage ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
                            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                               {hasActiveFilters ? "No matching orders" : "No orders yet"}
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold">
                                {hasActiveFilters
                                    ? "Try changing the search term or status filter."
                                    : "Approved quotes will appear here after they are converted into orders."}
                            </h2>
                        </div>
                    ) : null}

                    {visibleOrders.map((order) => {
                        const customer = customers.find(
                            (customer) => customer.id === order.customer_id
                        );
                        return(
                        <article
                            key={order.id}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h2 className="text-2xl font-semibold">
                                            Order #{order.id}
                                        </h2>

                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase ${statusBadgeClasses[order.status]}`}
                                        >
                                            {statusLabelMap[order.status]}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Created{" "}
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <div className="w-full max-w-xs">
                                    <label
                                        htmlFor={`order-status-${order.id}`}
                                        className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                                    >
                                        Status
                                    </label>

                                    <select
                                        id={`order-status-${order.id}`}
                                        value={order.status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                order.id,
                                                event.target.value
                                            )
                                        }
                                        disabled={updatingOrderId === order.id}
                                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>
                                                {statusLabelMap[status]}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteOrder(order.id)}
                                        disabled={deletingOrderId === order.id}
                                        className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                        {deletingOrderId === order.id ? "Deleting..." : "Delete Order"}
                                    </button>

                                    <p className="mt-2 text-xs text-slate-500">
                                        {updatingOrderId === order.id
                                            ? "Saving status..."
                                            : "Status updates are applied immediately."}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                        Customer
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {customer?.company_name || `Customer #${order.customer_id}`}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {customer?.name || "Contact not available"}
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        {customer?.email || "Email not available"}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                        Quote ID
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {order.quote_id}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                        Notes
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-slate-700">
                                        {order.notes || "No notes provided."}
                                    </p>
                                </div>
                            </div>
                        </article>
                        );
                    })}
                </section>
            </div>
            <Link
                href="/admin"
                className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                >
                Back to Admin Hub
            </Link>
        </main>
    );
}
