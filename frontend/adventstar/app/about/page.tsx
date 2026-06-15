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

const workingPrinciples = [
  {
    label: "01",
    title: "Clear briefs first",
    description:
      "We help customers move from rough requirements to a clearer order brief before production begins.",
  },
  {
    label: "02",
    title: "Practical follow-through",
    description:
      "Coordination stays grounded in quantities, timelines, and the real details that keep orders moving.",
  },
  {
    label: "03",
    title: "Consistent finishing",
    description:
      "Attention to finishing and presentation helps each order feel reliable, polished, and ready for everyday use.",
  },
];

const processCards = [
  {
    title: "Production Technology",
    description:
      "Modern equipment helps us handle consistent runs, cleaner finishing, and the practical demands of repeat orders.",
    imageSrc: "/machine3.png",
    imageAlt: "Production machines used for uniform work",
    spanClass: "lg:col-span-2",
  },
  {
    title: "People Behind It",
    description:
      "Our team manages preparation, coordination, and quality checks so customers get clearer communication throughout the process.",
    imageSrc: "/operator1.jpg",
    imageAlt: "Team members working on uniforms",
    spanClass: "",
    imageClassName: "object-[78%_22%] scale-[1.18]",
  },
  {
    title: "Detail and Finishing",
    description:
      "Careful finishing helps each order look polished, feel consistent, and arrive ready for everyday use.",
    imageSrc: "/operator2.png",
    imageAlt: "Uniform production and finishing details",
    spanClass: "",
  },
];

const footerLinks = [
    { label: "Home", href: "#top" },
    { label: "Why Advent Star", href: "#why-adventstar" },
    { label: "What We Supply", href: "#what-we-supply" },
    { label: "Request a Quote", href: "#enquiry" },
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

export default function AboutPage() {
  return (
    <main
      id="top"
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_26%),linear-gradient(180deg,_#fffaf0_0%,_#f8f3e8_55%,_#efe2cc_100%)] text-slate-900"
    >
      <header className="sticky top-0 z-50 border-b border-white/60 bg-[#fff8ef]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-10">
          <Link href="/" className="flex min-w-0 items-center">
            <Image
              src="/adventstar-logo.png"
              alt="Advent Star Uniform Supplier logo"
              width={1057}
              height={719}
              className="h-auto w-[10.5rem] min-w-0 sm:w-[12rem]"
              priority
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

      <section className="mx-auto grid max-w-7xl items-start gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr] lg:px-10">
        <div className="space-y-6">
          <p className="text-sm font-semibold tracking-[0.24em] text-amber-700 uppercase">
            About Advent Star
          </p>

          <div className="max-w-3xl space-y-6 text-lg leading-9 text-slate-700">
            <p>
              Advent Star supports schools, teams, and businesses in Singapore
              with uniform supply that feels clearer from first enquiry to
              final delivery.
            </p>

            <p>
              What matters most to us is not just the final product, but the
              process behind it: responsive coordination, practical timelines,
              and consistent follow-up that helps orders stay on track.
            </p>

            <p>
              Whether a customer needs schoolwear, PE attire, corporate wear,
              or team apparel, we focus on making repeat uniform orders easier
              to manage and easier to trust.
            </p>
          </div>
        </div>

        <div className="relative pt-2 lg:pt-6">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/70 bg-white/70 shadow-2xl shadow-slate-900/10">
            <div className="relative h-[22rem] sm:h-[28rem]">
              <Image
                src="/employees.png"
                alt="Advent Star team members working in the production space"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="mt-4 max-w-[15rem] rounded-[1.6rem] bg-amber-400 px-6 py-5 text-slate-950 shadow-xl shadow-amber-900/15 lg:absolute lg:-bottom-6 lg:left-[-1.5rem] lg:mt-0">
            <p className="text-3xl font-serif font-semibold">Built for</p>
            <p className="mt-1 text-base font-medium">bulk and repeat orders</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Behind the Work
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950">
            A closer look at how Advent Star works.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            From production equipment to hands-on coordination, each part of
            the process is built around consistency and practical follow-through.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {processCards.map((card) => (
            <article
              key={card.title}
              className={`group overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-lg ${card.spanClass}`}
            >
              <div className="relative h-72 overflow-hidden">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${card.imageClassName ?? ""}`}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="rounded-[2.1rem] border border-white/70 bg-white/60 p-8 shadow-sm backdrop-blur">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
              How We Work
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950">
              A straightforward approach built for repeat uniform orders.
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {workingPrinciples.map((principle) => (
              <article
                key={principle.label}
                className="rounded-[1.75rem] border border-slate-200 bg-[#fffdf8] p-7 shadow-sm"
              >
                <p className="text-sm font-semibold tracking-[0.22em] text-amber-700 uppercase">
                  {principle.label}
                </p>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-slate-950">
                  {principle.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="rounded-[2.25rem] border border-amber-200 bg-[linear-gradient(135deg,_#f59e0b_0%,_#b45309_100%)] px-8 py-10 text-white shadow-xl shadow-amber-900/20">
          <div className="max-w-2xl space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-amber-100 uppercase">
              Ready to get started?
            </p>
            <h2 className="font-serif text-4xl font-semibold">
              Tell us what you need and we&apos;ll help you move toward a
              practical quote.
            </h2>
            <p className="text-base leading-8 text-amber-50/90">
              Start with a structured enquiry and we&apos;ll follow up with the
              next steps for your order.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-wide text-amber-900 shadow-lg"
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
                          <Link
                            href={link.href}
                            className="inline-flex items-center gap-2 transition-colors hover:text-amber-700"
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
                            className="inline-flex items-center gap-2 transition-colors hover:text-amber-700"
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
