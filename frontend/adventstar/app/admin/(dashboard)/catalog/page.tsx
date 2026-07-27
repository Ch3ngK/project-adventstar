"use client";

import { useEffect, useState } from "react";

type CatalogItem = {
    id: number;
    name: string;
    description: string | null;
    unit_price: string;
    stock_quantity: number | null;
    created_at: string;
    updated_at: string;
}

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

export default function AdminCatalogPage() {
    const [items, setItems] = useState<CatalogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // add-item form fields
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [unitPrice, setUnitPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    // inline edit
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editUnitPrice, setEditUnitPrice] = useState("");
    const [editStockQuantity, setEditStockQuantity] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

    useEffect(() => {
        async function loadItems() {
            try {
                const response = await fetch("/api/admin/catalog");
                if (!response.ok) {
                    throw new Error("Failed to fetch catalog items.");
                }

                const data = await response.json();
                setItems(data);
                setErrorMessage("");
            } catch {
                setErrorMessage("Unable to load the price list.");
            } finally {
                setIsLoading(false);
            }
        }

        loadItems();
    }, []);

    async function handleCreateItem(event: React.FormEvent) {
        event.preventDefault();
        try {
            setIsCreating(true);
            setErrorMessage("");
            const response = await fetch("/api/admin/catalog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    description: description || null,
                    unit_price: unitPrice,
                    stock_quantity: stockQuantity ? Number(stockQuantity) : null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create catalog item.");
            }

            const newItem: CatalogItem = await response.json();
            setItems((current) =>
                [...current, newItem].sort((a, b) => a.name.localeCompare(b.name)));
            setName("");
            setDescription("");
            setUnitPrice("");
            setStockQuantity("");
        } catch {
            setErrorMessage("Unable to add catalog item.");
        } finally {
            setIsCreating(false);
        }
    }

    function handleStartEdit(item: CatalogItem) {
        setEditingItemId(item.id);
        setEditName(item.name);
        setEditDescription(item.description ?? "");
        setEditUnitPrice(item.unit_price);
        setEditStockQuantity(item.stock_quantity != null ? String(item.stock_quantity) : "");
    }

    function handleCancelEdit() {
        setEditingItemId(null);
    }

    async function handleSaveEdit(itemId: number) {
        try {
            setIsSaving(true);
            setErrorMessage("");
            const response = await fetch(`/api/admin/catalog/${itemId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editName,
                    description: editDescription || null,
                    unit_price: editUnitPrice,
                    stock_quantity: editStockQuantity ? Number(editStockQuantity) : null
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update catalog item.");
            }

            const updatedItem: CatalogItem = await response.json();
            setItems((current) =>
                current
                    .map((item) => (item.id === itemId ? updatedItem: item))
                    .sort((a, b) => a.name.localeCompare(b.name)));
            setEditingItemId(null);
        } catch {
            setErrorMessage("Unable to update catalog item.")
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteItem(itemId: number) {
        const confirmed = window.confirm("Delete this catalog item? This action cannot be undone.");

        if (!confirmed) {
            return;
        }

        try {
            setDeletingItemId(itemId);
            setErrorMessage("");
            const response = await fetch(`/api/admin/catalog/${itemId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete catalog item.");
            }

            setItems((current) => current.filter((item) => item.id !== itemId));
        } catch {
            setErrorMessage("Unable to delete catalog item.");
        } finally {
            setDeletingItemId(null);
        }
    }

     return (
        <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
            <div className="mx-auto max-w-7xl space-y-8">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-4xl font-semibold text-slate-950">
                            Price List
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                            Manage the products and services Advent Star sells, with unit
                            prices and optional stock quantities.
                        </p>
                    </div>
                </header>

                {errorMessage ? (
                    <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </p>
                ) : null}

                <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                    <h2 className="text-lg font-semibold text-slate-950">Add an Item</h2>
                    <form onSubmit={handleCreateItem} className="mt-4 grid gap-4 lg:grid-cols-2">
                        <div>
                            <label
                                htmlFor="catalog-name"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Name
                            </label>
                            <input
                                id="catalog-name"
                                type="text"
                                required
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="catalog-unit-price"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Unit Price (SGD)
                            </label>
                            <input
                                id="catalog-unit-price"
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={unitPrice}
                                onChange={(event) => setUnitPrice(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="catalog-stock-quantity"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Stock Quantity (optional)
                            </label>
                            <input
                                id="catalog-stock-quantity"
                                type="number"
                                step="1"
                                min="0"
                                value={stockQuantity}
                                onChange={(event) => setStockQuantity(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label
                                htmlFor="catalog-description"
                                className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase"
                            >
                                Description (optional)
                            </label>
                            <textarea
                                id="catalog-description"
                                rows={3}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <button
                                type="submit"
                                disabled={isCreating}
                                className="inline-flex items-center justify-center rounded-full bg-[#10284a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c1f3a] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isCreating ? "Adding..." : "Add Item"}
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
                                </div>
                            </div>
                        ))
                    ) : items.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-12 text-center shadow-sm">
                            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
                                No items yet
                            </p>
                            <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                                Add your first item above.
                            </h2>
                        </div>
                    ) : (
                        items.map((item) => {
                            const isEditing = editingItemId === item.id;

                            if (isEditing) {
                                return (
                                    <article
                                        key={item.id}
                                        className="rounded-[1.75rem] border border-[#10284a]/30 bg-white p-6 shadow-sm"
                                    >
                                        <div className="grid gap-4 lg:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={editName}
                                                    onChange={(event) => setEditName(event.target.value)}
                                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                                    Unit Price (SGD)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    required
                                                    value={editUnitPrice}
                                                    onChange={(event) => setEditUnitPrice(event.target.value)}
                                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                                                />
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    step="1"
                                                    min="0"
                                                    value={editStockQuantity}
                                                    onChange={(event) => setEditStockQuantity(event.target.value)}
                                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                                                />
                                            </div>

                                            <div className="lg:col-span-2">
                                                <label className="mb-2 block text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                                                    Description
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={editDescription}
                                                    onChange={(event) => setEditDescription(event.target.value)}
                                                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#10284a]"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleSaveEdit(item.id)}
                                                disabled={isSaving}
                                                className="inline-flex items-center justify-center rounded-full bg-[#10284a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0c1f3a] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isSaving ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                disabled={isSaving}
                                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </article>
                                );
                            }

                            return (
                                <article
                                    key={item.id}
                                    className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-slate-950">
                                                {item.name}
                                            </h2>
                                            <p className="mt-1 text-sm font-medium text-slate-600">
                                                {formatCurrency(item.unit_price)}
                                                {item.stock_quantity != null
                                                    ? ` · ${item.stock_quantity} in stock`
                                                    : ""}
                                            </p>
                                            {item.description ? (
                                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                                    {item.description}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleStartEdit(item)}
                                                className="inline-flex items-center justify-center rounded-full border border-[#10284a]/25 bg-[#10284a]/5 px-4 py-2 text-sm font-semibold text-[#10284a] transition hover:bg-[#10284a]/10"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteItem(item.id)}
                                                disabled={deletingItemId === item.id}
                                                className="inline-flex items-center justify-center rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {deletingItemId === item.id ? "Deleting..." : "Delete"}
                                            </button>
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