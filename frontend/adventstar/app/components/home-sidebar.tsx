"use client";

import Link from "next/link";
import { useState } from "react";

const sidebarLinks = [
  { label: "Top of Page", href: "#top" },
  { label: "How It Works", href: "#process" },
  { label: "Enquiry Section", href: "#enquiry" },
];

export default function HomeSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="home-sidebar"
        onClick={() => setIsOpen((current) => !current)}
        className="fixed top-5 left-5 z-50 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg backdrop-blur"
      >
        <span className="text-lg leading-none">{isOpen ? "x" : "="}</span>
        <span>{isOpen ? "Close Menu" : "Open Menu"}</span>
      </button>

      {isOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px]"
        />
      ) : null}

      <aside
        id="home-sidebar"
        className={`fixed top-0 left-0 z-50 flex h-screen w-72 flex-col justify-between border-r border-white/20 bg-slate-950 px-6 py-24 text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-amber-300 uppercase">
            Advent Star
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold">
            Home Navigation
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This sidebar is controlled by React state. The key idea is that we
            toggle classes based on whether the sidebar is open.
          </p>

          <nav className="mt-10 space-y-3">
            {sidebarLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <Link
            href="/admin/enquiries"
            onClick={() => setIsOpen(false)}
            className="inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20"
          >
            Go to Admin Enquiries
          </Link>
        </div>
      </aside>
    </>
  );
}
