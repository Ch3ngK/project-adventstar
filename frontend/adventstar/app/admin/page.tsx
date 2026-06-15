import Link from "next/link";

type Customer = {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

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

const enquiryStatuses = ["new", "contacted", "quoted", "closed"] as const;
const quoteStatuses = ["draft", "sent", "approved", "rejected"] as const;
const orderStatuses = [
  "pending",
  "in_production",
  "ready",
  "delivered",
  "cancelled",
] as const;

const enquiryStatusLabels: Record<(typeof enquiryStatuses)[number], string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  closed: "Closed",
};

const quoteStatusLabels: Record<(typeof quoteStatuses)[number], string> = {
  draft: "Draft",
  sent: "Sent",
  approved: "Approved",
  rejected: "Rejected",
};

const orderStatusLabels: Record<(typeof orderStatuses)[number], string> = {
  pending: "Pending",
  in_production: "In Production",
  ready: "Ready",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const enquiryBarClasses: Record<(typeof enquiryStatuses)[number], string> = {
  new: "bg-amber-500",
  contacted: "bg-sky-500",
  quoted: "bg-indigo-500",
  closed: "bg-emerald-500",
};

const quoteBarClasses: Record<(typeof quoteStatuses)[number], string> = {
  draft: "bg-slate-400",
  sent: "bg-sky-500",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
};

const orderBarClasses: Record<(typeof orderStatuses)[number], string> = {
  pending: "bg-amber-500",
  in_production: "bg-sky-500",
  ready: "bg-indigo-500",
  delivered: "bg-emerald-500",
  cancelled: "bg-rose-500",
};

const adminSections = [
  {
    title: "Enquiries",
    description: "Review incoming customer requests and update their status.",
    href: "/admin/enquiries",
  },
  {
    title: "Quotes",
    description: "Manage quotations, update quote status, and convert approved quotes into orders.",
    href: "/admin/quotes",
  },
  {
    title: "Orders",
    description: "Track confirmed orders through production, readiness, and delivery.",
    href: "/admin/orders",
  },
  {
    title: "Customers",
    description: "Browse customer records and view related enquiries, quotes, and orders.",
    href: "/admin/customers",
  },
];

type StatusChartRow = {
  label: string;
  count: number;
  barClassName: string;
};

function buildStatusRows<T extends string>(
  items: Array<{ status: string }>,
  statuses: readonly T[],
  labels: Record<T, string>,
  barClasses: Record<T, string>,
): StatusChartRow[] {
  return statuses.map((status) => ({
    label: labels[status],
    count: items.filter((item) => item.status === status).length,
    barClassName: barClasses[status],
  }));
}

function getBarWidth(count: number, maxCount: number) {
  if (count === 0) {
    return "0%";
  }

  return `${Math.max((count / maxCount) * 100, 10)}%`;
}

export default async function AdminDashboardPage() {
  const [enquiriesResponse, quotesResponse, ordersResponse, customersResponse] =
    await Promise.all([
      fetch("http://127.0.0.1:8000/enquiries", { cache: "no-store" }),
      fetch("http://127.0.0.1:8000/quotes", { cache: "no-store" }),
      fetch("http://127.0.0.1:8000/orders", { cache: "no-store" }),
      fetch("http://127.0.0.1:8000/customers", { cache: "no-store" }),
    ]);

  if (
    !enquiriesResponse.ok ||
    !quotesResponse.ok ||
    !ordersResponse.ok ||
    !customersResponse.ok
  ) {
    throw new Error("Failed to load dashboard data.");
  }

  const enquiries: Enquiry[] = await enquiriesResponse.json();
  const quotes: Quote[] = await quotesResponse.json();
  const orders: Order[] = await ordersResponse.json();
  const customers: Customer[] = await customersResponse.json();

  const summaryCards = [
    {
      label: "Enquiries",
      value: enquiries.length,
      detail: `${enquiries.filter((enquiry) => enquiry.status === "new").length} new`,
    },
    {
      label: "Quotes",
      value: quotes.length,
      detail: `${quotes.filter((quote) => quote.status === "approved").length} approved`,
    },
    {
      label: "Orders",
      value: orders.length,
      detail: `${orders.filter((order) => order.status === "in_production").length} in production`,
    },
    {
      label: "Customers",
      value: customers.length,
      detail: `${orders.filter((order) => order.status === "delivered").length} delivered orders`,
    },
  ];

  const enquiryRows = buildStatusRows(
    enquiries,
    enquiryStatuses,
    enquiryStatusLabels,
    enquiryBarClasses,
  );
  const quoteRows = buildStatusRows(
    quotes,
    quoteStatuses,
    quoteStatusLabels,
    quoteBarClasses,
  );
  const orderRows = buildStatusRows(
    orders,
    orderStatuses,
    orderStatusLabels,
    orderBarClasses,
  );

  const chartSections = [
    {
      title: "Enquiry Pipeline",
      description: "See where incoming requests are sitting right now.",
      href: "/admin/enquiries",
      rows: enquiryRows,
    },
    {
      title: "Quote Status",
      description: "Track which quotations still need follow-up.",
      href: "/admin/quotes",
      rows: quoteRows,
    },
    {
      title: "Order Progress",
      description: "Monitor delivery flow from confirmation to completion.",
      href: "/admin/orders",
      rows: orderRows,
    },
  ];

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#f1f5f9_100%)] px-6 py-12 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">
            Advent Star Admin
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Use this dashboard to manage enquiries, quotations, orders, and customer records in one place.
          </p>
        </header>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                {card.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">
                {card.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{card.detail}</p>
            </div>
          ))}
        </section>
        <section className="grid gap-6 xl:grid-cols-3">
          {chartSections.map((section) => {
            const maxCount = Math.max(
              ...section.rows.map((row) => row.count),
              1,
            );

            return (
              <div
                key={section.title}
                className="rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
                      Live Breakdown
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {section.description}
                    </p>
                  </div>
                  <Link
                    href={section.href}
                    className="text-sm font-semibold text-amber-700 transition hover:text-amber-800"
                  >
                    Open
                  </Link>
                </div>
                <div className="mt-6 space-y-4">
                  {section.rows.map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-sm text-slate-700">
                        <span>{row.label}</span>
                        <span className="font-semibold text-slate-950">
                          {row.count}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${row.barClassName}`}
                          style={{
                            width: getBarWidth(row.count, maxCount),
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block rounded-[1.75rem] border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
            >
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold text-slate-950">
                  {section.title}
                </h2>
                <p className="text-sm leading-7 text-slate-600">
                  {section.description}
                </p>
                <p className="pt-2 text-sm font-semibold text-amber-700">
                  Open section
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
