"use client";

import { useState } from "react";

export type FaqItem = {
  question: string;
  answer: string;
};

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function FaqAccordion({
  items,
  idPrefix,
  defaultOpenIndex = 0,
}: {
  items: FaqItem[];
  idPrefix: string;
  defaultOpenIndex?: number | null;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/80">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${idPrefix}-button-${index}`;
        const panelId = `${idPrefix}-panel-${index}`;

        return (
          <div key={item.question}>
            <h3 className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-semibold text-slate-950 transition-colors hover:text-[#10284a] sm:px-8"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="text-[#10284a] transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <ChevronIcon />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-sm leading-7 text-slate-600 sm:px-8">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
