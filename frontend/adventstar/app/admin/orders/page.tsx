"use client";

import { useEffect, useState } from "react";

type Order = {
    id: number;
    customer_id: number;
    quote_id: number;
    status: string;
    notes: string | null;
    created_at: string; 
};

const statusOptions = [
    "pending",
    "in_production",
    "ready",
    "delivered",
    "cancelled",
];

export default function OrdersPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await fetch ("http://127.0.0.1:8000/orders");
                if (!response.ok) {
                    throw new Error("Failed to fetch orders.");
                }
                
                const data = await response.json();
                setOrders(data);
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
                `http://127.0.0.1:8000/orders/#{orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update order status.")
            }

            const updatedOrder = await response.json();

            setOrders((currentOrders) =>
                currentOrders.map((order) => 
                order.id === orderId ? updatedOrder : order));

        } catch {
            setErrorMessage("Unable to update order");
        } finally {
            setUpdatingOrderId(null);
        }
    }

    return (
        <main>
            <h1>Orders</h1>

            {isLoading ? <p>Loading orders...</p> : null}

            {errorMessage ? <p>{errorMessage}</p> : null}

            {!isLoading && orders.length === 0 && !errorMessage ? (
                <p>No orders yet.</p>
            ) : null}

            {orders.map((order) => (
                <article key={order.id}>
                    <h2>Order #{order.id}</h2>
                    <select
                        value={order.status}
                        onChange={(event) => handleStatusChange(order.id, event.target.value)}
                        disabled={updatingOrderId === order.id}
                    >
                        {statusOptions.map((status) => (
                           <option key={status} value={status}>
                                {status}
                           </option> 
                        ))}
                    </select>
                    <p>Customer ID: {order.customer_id}</p>
                    <p>Quote ID: {order.quote_id}</p>
                    <p>Status: {order.status}</p>
                    <p>Notes: {order.notes || "No notes provided."}</p>
                    <p>Created: {new Date(order.created_at).toLocaleString()}</p>
                </article>
            ))}
        </main>
    );
}