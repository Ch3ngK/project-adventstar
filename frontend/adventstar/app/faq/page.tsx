import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ScrollReveal from "@/components/landing/ScrollReveal";
import BlurText from "@/components/landing/BlurText";
import FaqAccordion, { type FaqItem } from "@/components/faq/FaqAccordion";
import adventstarLogo from "@/public/adventstar-logo.png";

export const metadata: Metadata = {
  title: "FAQ | Advent Star Uniform Supplier",
  description:
    "Answers to common questions about ordering, customizing, and receiving uniforms from Advent Star, Singapore's uniform supplier for schools and businesses.",
};

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l2.1 2.1 3-.44.44 3L20 10l-2.46 2.34-.44 3-3-.44L12 17l-2.1-2.1-3 .44-.44-3L4 10l2.46-2.34.44-3 3 .44L12 3Z" />
      <path d="m9.5 10.5 1.5 1.5 3.5-3.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16.42v2.83a1.75 1.75 0 0 1-1.91 1.74A17.52 17.52 0 0 1 3.01 4.91 1.75 1.75 0 0 1 4.75 3h2.83a1.75 1.75 0 0 1 1.75 1.5l.33 2.63a1.75 1.75 0 0 1-.5 1.5l-1.2 1.2a14 14 0 0 0 6.2 6.2l1.2-1.2a1.75 1.75 0 0 1 1.5-.5l2.63.33A1.75 1.75 0 0 1 21 16.42Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Request a Quote", href: "/enquiry" },
];

const footerCategories = [
  "Preschools",
  "Primary Schools",
  "International Schools",
  "MOE Schools",
  "Corporate Offices",
  "Institutions",
];

const contactDetails = [
  {
    label: "Address",
    value: "10 Anson Road #10-11 International Plaza, Singapore 079903",
    icon: MapPinIcon,
  },
  {
    label: "GST Registration",
    value: "GST Reg No 201510303R",
    icon: BadgeIcon,
  },
  {
    label: "Phone",
    value: "+65 9766 8748",
    icon: PhoneIcon,
  },
  {
    label: "Email",
    value: "sales@advent-star.com",
    icon: MailIcon,
  },
];

const faqCategories: { title: string; items: FaqItem[] }[] = [
  {
    title: "Ordering & Quotations",
    items: [
      {
        question: "How do I request a quotation?",
        answer:
          "Submit an enquiry through our online form with your approximate quantities, apparel type, and delivery timeline. Our team reviews the details and follows up with a structured quotation and next steps.",
      },
      {
        question: "Is there a minimum order quantity?",
        answer:
          "Advent Star is built around bulk and repeat orders for schools, corporate teams, and institutions. Minimum quantities vary by garment and customization, and are confirmed during the quotation stage.",
      },
      {
        question: "Can I see a sample before committing to a full order?",
        answer:
          "Yes. Sample review can be arranged as part of the quotation process so you can confirm fabric, fit, and finishing before production begins.",
      },
    ],
  },
  {
    title: "Customization & Sizing",
    items: [
      {
        question: "Can uniforms be customized with logos or embroidery?",
        answer:
          "Yes. Logo printing, embroidery, and custom trims are available depending on the garment and sector, and are discussed as part of your quotation.",
      },
      {
        question: "What size range do you offer?",
        answer:
          "We work with structured size charts covering child through adult sizing. Sizing is confirmed during the quotation stage to keep fit consistent across every batch.",
      },
      {
        question: "Do you supply uniforms for sectors beyond schools?",
        answer:
          "Yes. Alongside schoolwear and PE attire, we supply corporate wear, hospitality and healthcare uniforms, industrial workwear, and government and public sector apparel.",
      },
    ],
  },
  {
    title: "Production & Delivery",
    items: [
      {
        question: "How long does production take?",
        answer:
          "Production timelines depend on quantity and customization. These are confirmed upfront in your quotation so they fit your term or event schedule.",
      },
      {
        question: "Do you deliver across Singapore?",
        answer:
          "Yes. Dependable delivery is coordinated as part of every order cycle, from first enquiry through to final handover.",
      },
      {
        question: "Can you support recurring or repeat orders each term or year?",
        answer:
          "Yes. Many of our school and corporate customers reorder each term or year, and we keep a consistent process and record for repeat orders to make that easier.",
      },
    ],
  },
  {
    title: "Payment & Support",
    items: [
      {
        question: "What payment terms are available?",
        answer:
          "Payment terms are outlined clearly in your quotation, so there are no surprises before production starts.",
      },
      {
        question: "Is Advent Star GST registered?",
        answer: "Yes, our GST Registration number is 201510303R.",
      },
      {
        question: "Who do I contact if there's an issue with my order?",
        answer:
          "Reach our team directly at sales@advent-star.com or +65 9766 8748, and we'll coordinate a resolution as quickly as possible.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main id="top" className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/96 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src={adventstarLogo}
              alt="Advent Star Uniform Supplier logo"
              placeholder="blur"
              className="h-auto w-[10.5rem] min-w-0 sm:w-[12rem]"
              preload
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900"
            >
              Home
            </Link>
            <Link
              href="/enquiry"
              className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10">
        <ScrollReveal>
          <p className="text-sm font-semibold tracking-[0.24em] text-[#10284a] uppercase">
            Support
          </p>
        </ScrollReveal>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-slate-950 sm:text-5xl">
          <BlurText text="Frequently asked questions." immediate wordDelay={50} />
        </h1>
        <ScrollReveal delay={200}>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Answers to the questions we hear most from schools, businesses, and
            operational teams about ordering, customizing, and receiving uniforms.
          </p>
        </ScrollReveal>
      </section>

      {/* ── FAQ CATEGORIES ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-4xl px-6 pb-20 lg:px-10">
        <div className="space-y-14">
          {faqCategories.map((category, i) => (
            <ScrollReveal key={category.title} delay={i * 80}>
              <h2 className="mb-5 font-serif text-2xl font-semibold text-slate-950">
                {category.title}
              </h2>
              <FaqAccordion
                items={category.items}
                idPrefix={category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                defaultOpenIndex={i === 0 ? 0 : null}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <ScrollReveal>
          <div className="rounded-[2.25rem] border border-white/10 bg-[#0d1f3c] px-8 py-10 text-white shadow-xl shadow-slate-900/20 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div className="max-w-xl space-y-3">
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Still have questions?
              </p>
              <h2 className="font-serif text-3xl font-semibold">
                Talk to our team about your uniform requirements.
              </h2>
              <p className="text-base leading-7 text-slate-300">
                Start a structured enquiry and we&apos;ll follow up with practical
                next steps.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:mt-0 sm:shrink-0 sm:flex-row">
              <Link
                href="/enquiry"
                className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-wide text-[#0d1f3c] shadow-lg"
              >
                Go to Enquiry Form
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-4 text-sm font-semibold tracking-wide text-white"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-slate-200 bg-[#f5f7fa]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <ScrollReveal>
            <div className="grid gap-10 border-b border-slate-200/80 pb-10 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-4">
                <Image
                  src={adventstarLogo}
                  alt="Advent Star Uniform Supplier logo"
                  placeholder="blur"
                  className="h-auto w-[13rem]"
                  preload
                />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-semibold text-slate-950">
                  Quick Links
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {footerLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 transition-colors hover:text-[#10284a]"
                      >
                        <ArrowRightIcon />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-semibold text-slate-950">
                  Categories
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {footerCategories.map((category) => (
                    <li key={category}>
                      <Link
                        href="/#what-we-supply"
                        className="inline-flex items-center gap-2 transition-colors hover:text-[#10284a]"
                      >
                        <ArrowRightIcon />
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-semibold text-slate-950">
                  Contact
                </h3>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
                  {contactDetails.map((detail) => {
                    const Icon = detail.icon;

                    return (
                      <li key={detail.label} className="flex items-start gap-3">
                        <span className="mt-0.5 text-[#10284a]">
                          <Icon />
                        </span>
                        <span>{detail.value}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>&copy; 2026 Advent Star Uniforms. All rights reserved.</p>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="transition-colors hover:text-[#10284a]">
                  Privacy Policy
                </a>
                <a href="#" className="transition-colors hover:text-[#10284a]">
                  Terms of Service
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </main>
  );
}
