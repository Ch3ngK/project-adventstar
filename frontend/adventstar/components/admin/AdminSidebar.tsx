"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import adventstarLogo from "@/public/adventstar-logo.png";

function GridIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 13.5h4.4l1.4 2.5h5.4l1.4-2.5h4.4" />
      <path d="M5.2 6.5 3.5 13.5v5a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-5l-1.7-7a1.5 1.5 0 0 0-1.46-1.15H6.66A1.5 1.5 0 0 0 5.2 6.5Z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 12c0-4.42 3.8-8 8.5-8s8.5 3.58 8.5 8-3.8 8-8.5 8c-1.02 0-2-.17-2.9-.48L4.5 20.5l1.1-3.6A7.6 7.6 0 0 1 3.5 12Z" />
      <path d="M8.5 11.75h7M8.5 14.75h4.5" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3.5h7.5L19 8v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
      <path d="M14.5 3.5V8H19" />
      <path d="M9 13h6M9 16.5h6" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 20.5 8 12 12.5 3.5 8 12 3.5Z" />
      <path d="M3.5 8v8.5L12 21l8.5-4.5V8" />
      <path d="M12 12.5V21" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.75 19.25c0-3.1 2.8-5.5 6.25-5.5s6.25 2.4 6.25 5.5" />
      <path d="M15.25 8.75a3 3 0 1 1 3.75 2.9" />
      <path d="M18 14.1c2.4.5 4.25 2.35 4.25 5.15" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 20.5H5.75a1.75 1.75 0 0 1-1.75-1.75V5.25A1.75 1.75 0 0 1 5.75 3.5H9.5" />
      <path d="M15.5 16.5 20 12l-4.5-4.5" />
      <path d="M20 12H9.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.75 3.5h5.75a1.5 1.5 0 0 1 1.5 1.5v5.75a1.5 1.5 0 0 1-.44 1.06l-8.25 8.25a1.5 1.5 0 0 1-2.12 0l-5.75-5.75a1.5 1.5 0 0 1 0-2.12l8.25-8.25a1.5 1.5 0 0 1 1.06-.44Z" />
      <circle cx="16.5" cy="7.5" r="1.25" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3.5 13.6 9.4 19.5 11 13.6 12.6 12 18.5 10.4 12.6 4.5 11 10.4 9.4 12 3.5Z" />
    </svg>
  );
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: GridIcon, exact: true },
  { label: "Enquiries", href: "/admin/enquiries", icon: InboxIcon },
  { label: "Inbox", href: "/admin/conversations", icon: ChatIcon },
  { label: "Leads", href: "/admin/leads", icon: UsersIcon },
  { label: "Quotes", href: "/admin/quotes", icon: FileIcon },
  { label: "Price List", href: "/admin/catalog", icon: TagIcon },
  { label: "Orders", href: "/admin/orders", icon: PackageIcon },
  { label: "Customers", href: "/admin/customers", icon: UsersIcon },
  { label: "Assistant", href: "/admin/assistant", icon: SparkleIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
      router.refresh();
    }
  }

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200 bg-white/95 px-4 py-6 backdrop-blur-xl lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <Image
            src={adventstarLogo}
            alt="Advent Star"
            placeholder="blur"
            className="h-auto w-[7.5rem]"
            preload
          />
        </Link>
        <span className="mx-2 mt-3 w-fit rounded-full bg-[#10284a]/10 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-[#10284a] uppercase">
          Admin
        </span>

        <nav aria-label="Admin sections" className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#10284a] text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogoutIcon />
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </aside>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
            <Image
              src={adventstarLogo}
              alt="Advent Star"
              placeholder="blur"
              className="h-auto w-[6rem]"
              preload
            />
          </Link>

          <nav
            aria-label="Admin sections"
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
          >
            {navItems.map(({ label, href, icon: Icon, exact }) => {
              const isActive = exact ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#10284a] text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon />
                  {label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log out"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-slate-300 p-2.5 text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogoutIcon />
          </button>
        </div>
      </header>
    </>
  );
}
