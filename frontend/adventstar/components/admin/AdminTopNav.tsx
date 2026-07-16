"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

const navItems = [
  { label: "Dashboard", href: "/admin", icon: GridIcon, exact: true },
  { label: "Enquiries", href: "/admin/enquiries", icon: InboxIcon },
  { label: "Leads", href: "/admin/leads", icon: UsersIcon },
  { label: "Quotes", href: "/admin/quotes", icon: FileIcon },
  { label: "Orders", href: "/admin/orders", icon: PackageIcon },
  { label: "Customers", href: "/admin/customers", icon: UsersIcon },
];

export default function AdminTopNav() {
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3 lg:px-10">
        <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/adventstar-logo.png"
            alt="Advent Star"
            width={1057}
            height={719}
            className="h-auto w-[7.5rem]"
            priority
          />
          <span className="hidden rounded-full bg-[#10284a]/10 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-[#10284a] uppercase sm:inline-block">
            Admin
          </span>
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
                className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
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
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <LogoutIcon />
          <span className="hidden sm:inline">{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </button>
      </div>
    </header>
  );
}
