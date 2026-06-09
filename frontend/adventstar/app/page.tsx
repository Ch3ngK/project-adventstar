import Image from "next/image";
import Link from "next/link";

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
      <path d="m5 7 7 5 7-5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 2.75l2.16 4.99 5.42.47-4.1 3.63 1.22 5.33L12 14.1l-4.7 3.07 1.22-5.33-4.1-3.63 5.42-.47L12 2.75z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 11H6.5A2.5 2.5 0 0 0 4 13.5V16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3.5A1.5 1.5 0 0 0 8.5 11H7v-.5A3.5 3.5 0 0 1 10.5 7" />
      <path d="M20 11h-3.5A2.5 2.5 0 0 0 14 13.5V16a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3.5a1.5 1.5 0 0 0-1.5-1.5H17v-.5A3.5 3.5 0 0 1 20.5 7" />
    </svg>
  );
}

export default function Home() {
  const navigationLinks = [
    { label: "Why Advent Star", href: "#why-adventstar" },
    { label: "What We Supply", href: "#what-we-supply" },
    { label: "How It Works", href: "#process" },
    { label: "About us", href: "/about" },
  ];

  const trustPoints = [
    "Faster quotation turnaround for bulk and repeat orders",
    "Uniform options for schools, teams, and businesses",
    "Clearer follow-up from enquiry to delivery",
  ];

  const productCategories = [
    {
      name: "Preschools",
      audience: "Early Years",
      description:
        "School uniforms, knitted wear, jackets, hoodies, and school shoe bags designed for daily comfort and easy reordering.",
      imageSrc: "/preschool.png",
      services: ["School uniforms", "Knitted wear", "Shoe bags"],
    },
    {
      name: "Primary & International schools",
      audience: "Core Schoolwear",
      description:
        "Reliable schoolwear programmes with uniforms, blazers, ties, and practical bags for growing student cohorts.",
      imageSrc: "/school.png",
      services: ["School uniforms", "Blazers and ties", "Suit bags"],
    },
    {
      name: "Teams",
      audience: "Repeat Orders",
      description:
        "Dependable supply for small/large teams, with uniforms, jackets, hoodies, knitted wear, and accessories prepared for repeat demand.",
      imageSrc: "/teams.png",
      services: ["School uniforms", "Jackets and hoodies", "Knitted wear"],
    },
    {
      name: "Industrial",
      audience: "Operational Wear",
      description:
        "Industrial work uniforms, outerwear, and carrying bags built for organisations that need practical, durable apparel programmes.",
      imageSrc: "/industrial.png",
      services: ["Industrial uniforms", "Jackets and hoodies", "Suit bags"],
    },
    {
      name: "Corporate Offices",
      audience: "Professional Attire",
      description:
        "Corporate uniform pieces, blazers, ties, and knitted layers tailored for teams that need a polished day-to-day presentation.",
      imageSrc: "/corporate.png",
      services: ["Corporate uniforms", "Blazers and ties", "Knitted wear"],
    },
    {
      name: "Lifestyle",
      audience: "Specialty Apparel",
      description:
        "Made-to-order apparel unique garments, and projects beyond standard school or corporate uniforms.",
      imageSrc: "/specialty.png",
      services: ["Custom clothing", "Batik", "Made-to-order wear"],
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Tell us what you need",
      description:
        "Share quantities, sizes, timelines, and branding requirements.",
    },
    {
      step: "02",
      title: "Receive a tailored quotation",
      description:
        "We review the request and prepare a practical quote.",
    },
    {
      step: "03",
      title: "Confirm production details",
      description:
        "We confirm specifications, artwork, and key milestones.",
    },
    {
      step: "04",
      title: "Track to delivery",
      description:
        "Production moves forward with clearer progress updates.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Advent Star made our uniform ordering process much smoother. The team was responsive, and the final pieces looked polished and consistent.",
      name: "Rachel Lim",
      role: "Operations Manager",
      company: "Brighton Learning Hub",
    },
    {
      quote:
        "The apparel quality was dependable, and the follow-up was clear throughout. It made repeat ordering much easier for our staff team.",
      name: "Daniel Tan",
      role: "Programme Lead",
      company: "Summit Training Group",
    },
    {
      quote:
        "We needed practical uniforms on a tight timeline, and Advent Star helped us move from enquiry to delivery without unnecessary back-and-forth.",
      name: "Farah Ismail",
      role: "Admin Executive",
      company: "Northfield Events",
    },
  ];

  const footerLinks = [
    { label: "Home", href: "#top" },
    { label: "Why Advent Star", href: "#why-adventstar" },
    { label: "What We Supply", href: "#what-we-supply" },
    { label: "Request a Quote", href: "#enquiry" },
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

  return (
    <main
      id="top"
      className="overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_26%),linear-gradient(180deg,_#fffaf0_0%,_#f8f3e8_55%,_#efe2cc_100%)] text-slate-900"
    >
      <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fff8ef]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <a href="#top" className="flex min-w-0 items-center">
            <Image
              src="/adventstar-logo.png"
              alt="Advent Star Uniform Supplier logo"
              width={1057}
              height={719}
              className="h-auto w-[10.5rem] min-w-0 sm:w-[12rem]"
              priority
            />
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {navigationLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/80"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm"
            >
              Admin
            </Link>
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20"
            >
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-4 md:hidden lg:px-10">
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="shrink-0 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700"
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-amber-300/80 bg-amber-100/80 px-4 py-2 text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
            Uniform Supply, Simplified
          </span>

          <div className="space-y-5">
            <h1 className="max-w-4xl font-serif text-5xl leading-tight font-semibold text-slate-950 sm:text-6xl">
              Reliable uniform supply for schools, teams, and businesses in Singapore.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              Advent Star helps schools, SMEs, and organisations move from
              enquiry to quotation hassle-free.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20"
            >
              Request a Quote
            </Link>
            <a
              href="#process"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-7 py-4 text-sm font-semibold tracking-wide text-slate-900 shadow-sm"
            >
              See How It Works
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-8 right-8 h-28 w-28 rounded-full bg-amber-300/45 blur-2xl" />
          <div className="absolute -bottom-8 left-10 h-36 w-36 rounded-full bg-orange-200/60 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-900/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm tracking-[0.22em] text-amber-300 uppercase">
                  Built for operations
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  A cleaner workflow behind every quote.
                </h2>
              </div>
              <div className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase text-amber-100">
                Internal System
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-amber-200">New enquiry received</p>
                <p className="mt-1 text-base font-medium">
                  120 PE uniforms requested for a new school term.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-amber-200">Quotation drafted</p>
                <p className="mt-1 text-base font-medium">
                  Quantities, lead time, and follow-up details prepared for review.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-amber-200">Order in progress</p>
                <p className="mt-1 text-base font-medium">
                  Production milestones tracked more clearly from approval to delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-adventstar"
        className="mx-auto max-w-7xl px-6 pb-8 lg:px-10"
      >
        <div className="rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-sm backdrop-blur">
          <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Why Advent Star
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div
                key={point}
                className="rounded-3xl border border-slate-200 bg-[#fffaf2] p-6"
              >
                <div className="mb-4 h-2 w-16 rounded-full bg-amber-500" />
                <p className="text-base leading-7 text-slate-700">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="what-we-supply"
        className="mx-auto max-w-7xl px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-700 uppercase">
            Our Collections
          </p>
          <h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 sm:text-5xl">
            Uniforms for schools, offices, and institutions.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">
            Advent Star supports preschools, primary schools, international
            schools, MOE schools, corporate offices, and institutions with
            collections built for daily wear, formal presentation, and repeat
            ordering.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {productCategories.map((category) => (
            <article
              key={category.name}
              className="group relative overflow-hidden rounded-[1.9rem] border border-slate-200 bg-slate-950 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/20"
            >
              <div className="absolute inset-0">
                <Image
                  src={category.imageSrc}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.08)_0%,_rgba(15,23,42,0.36)_44%,_rgba(15,23,42,0.88)_100%)]" />
              </div>

              <div className="relative flex min-h-[24rem] flex-col justify-end p-7">
                <p className="text-xs font-semibold tracking-[0.2em] text-amber-200 uppercase">
                  {category.audience}
                </p>
                <h3 className="mt-3 font-serif text-3xl font-semibold text-white">
                  {category.name}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-7 text-slate-100/90">
                  {category.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {category.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className="absolute bottom-6 right-6 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                  <ArrowRightIcon />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="process"
        className="border-y border-slate-200/80 bg-white/70 py-20 backdrop-blur"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              How It Works
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950">
              A straightforward process from first contact to delivery.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-[1.75rem] border border-slate-200 bg-[#fffdf8] p-6 shadow-sm"
              >
                <p className="text-sm font-bold tracking-[0.24em] text-amber-700 uppercase">
                  {step.step}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="rounded-[2.25rem] border border-white/70 bg-white/55 px-8 py-12 shadow-sm backdrop-blur lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-[0.24em] text-amber-700 uppercase">
              Testimonials
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-slate-950 sm:text-5xl">
              Trusted by organisations that need reliable follow-through.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[2rem] border border-slate-200 bg-[#fffdf8] p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon key={index} />
                    ))}
                  </div>
                  <span className="text-slate-300">
                    <QuoteIcon />
                  </span>
                </div>

                <p className="mt-6 text-lg leading-8 text-slate-700">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-8">
                  <p className="text-lg font-semibold text-slate-950">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="rounded-[2.25rem] border border-amber-200 bg-[linear-gradient(135deg,_#f59e0b_0%,_#b45309_100%)] px-8 py-10 text-white shadow-xl shadow-amber-900/20 lg:flex lg:items-end lg:justify-between lg:px-10">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-amber-100 uppercase">
              Ready to Enquire?
            </p>
            <h2 className="font-serif text-4xl font-semibold">
              Start with a structured request and move faster to quotation.
            </h2>
            <p className="text-base leading-8 text-amber-50/90">
              Share your requirements and we&apos;ll follow up with the next
              steps for your quote.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0">
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-900"
            >
              Admin
            </Link>
            
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-wide text-amber-900 shadow-lg"
            >
              Go to Enquiry Form
            </Link>
            <a
              href="#top"
              className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-4 text-sm font-semibold tracking-wide text-white"
            >
              Back to Top
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-amber-200/80 bg-[linear-gradient(180deg,_rgba(255,248,239,0.96)_0%,_rgba(248,243,232,0.98)_100%)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-10 border-b border-slate-200/80 pb-10 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-4">
              <Image
                src="/adventstar-logo.png"
                alt="Advent Star Uniform Supplier logo"
                width={1057}
                height={719}
                className="h-auto w-[13rem]"
                priority
              />
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-slate-950">
                Quick Links
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {footerLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 transition-colors hover:text-amber-700"
                    >
                      <ArrowRightIcon />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-semibold text-slate-950">
                Categories
              </h3>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {productCategories.map((category) => (
                  <li key={category.name}>
                     <a
                      href="#what-we-supply"
                      className="inline-flex items-center gap-2 transition-colors hover:text-amber-700"
                    >
                    <ArrowRightIcon />
                    {category.name}
                    </a>
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
                      <span className="mt-0.5 text-amber-700">
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
              <a href="#" className="transition-colors hover:text-amber-700">
                Privacy Policy
              </a>
              <a href="#" className="transition-colors hover:text-amber-700">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
