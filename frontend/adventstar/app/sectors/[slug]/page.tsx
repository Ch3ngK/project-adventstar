import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollReveal from "@/components/landing/ScrollReveal";
import BlurText from "@/components/landing/BlurText";
import { sectors, getSector } from "@/lib/sectors";

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

function ArrowLeftIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="m11 18-6-6 6-6" />
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

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Advent Star", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Request a Quote", href: "/enquiry" },
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

export const dynamicParams = false;

export async function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};

  return {
    title: `${sector.title} | Advent Star Uniform Supplier`,
    description: sector.description,
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const otherSectors = sectors.filter((s) => s.slug !== sector.slug);

  return (
    <main id="top" className="min-h-screen bg-[#f5f7fa] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/96 backdrop-blur-xl">
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
              href="/#services"
              className="hidden rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-900 sm:inline-flex"
            >
              All Sectors
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
      <section className="mx-auto grid max-w-7xl items-start gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr] lg:px-10">
        <div className="space-y-6">
          <ScrollReveal>
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#10284a]"
            >
              <ArrowLeftIcon />
              All sectors
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <p className="text-sm font-semibold tracking-[0.24em] text-[#10284a] uppercase">
              {sector.sector} sector
            </p>
          </ScrollReveal>

          <div className="max-w-3xl space-y-6 text-lg leading-9 text-slate-700">
            <h1 className="font-serif text-4xl font-semibold text-slate-950 sm:text-5xl">
              <BlurText text={sector.title} immediate wordDelay={50} />
            </h1>
            <ScrollReveal delay={200}>
              <p>{sector.description}</p>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={280}>
            <ul className="flex flex-wrap gap-3">
              {sector.features.map((f) => (
                <li
                  key={f}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10284a]" />
                  {f}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal delay={340} className="flex flex-col gap-4 pt-2 sm:flex-row">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#10284a] px-7 py-4 text-sm font-semibold tracking-wide text-white shadow-lg"
            >
              Request a Quote
              <ArrowRightIcon />
            </Link>
            <Link
              href="/#services"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 px-7 py-4 text-sm font-semibold tracking-wide text-slate-900"
            >
              Explore other sectors
            </Link>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={150} className="relative pt-2 lg:pt-6">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/70 bg-white/70 shadow-2xl shadow-slate-900/10">
            <div className="relative h-[22rem] sm:h-[28rem]">
              <Image
                src={sector.heroImage}
                alt={sector.title}
                fill
                className={`object-cover ${sector.heroImagePosition ?? "object-center"}`}
                priority
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CATALOG ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <ScrollReveal className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#10284a] uppercase">
            Catalog
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950">
            {sector.title} pieces we supply.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            A sample of garments produced for this sector. Every order is made to your
            specification — colours, branding, and sizing can be adjusted to match your
            requirements.
          </p>
        </ScrollReveal>

        {sector.images.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sector.images.map((img, i) => (
              <ScrollReveal key={img.src} delay={i * 90}>
                <article className="group h-full overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#10284a]/20 hover:shadow-lg">
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="border-t border-slate-100 p-5">
                    <p className="text-sm font-semibold text-slate-900">{img.alt}</p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.9rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
            <p className="text-base text-slate-600">
              Catalog images for this sector are being prepared. Get in touch and we&apos;ll
              share references directly.
            </p>
          </div>
        )}
      </section>

      {/* ── OTHER SECTORS ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <ScrollReveal className="mb-6">
          <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
            Explore more
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Other sectors we serve</h2>
        </ScrollReveal>
        <ScrollReveal delay={80} className="flex flex-wrap gap-3">
          {otherSectors.map((s) => (
            <Link
              key={s.slug}
              href={`/sectors/${s.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#10284a]/30 hover:text-[#10284a]"
            >
              {s.title}
              <ArrowRightIcon />
            </Link>
          ))}
        </ScrollReveal>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <ScrollReveal>
          <div className="rounded-[2.25rem] border border-white/10 bg-[#0d1f3c] px-8 py-10 text-white shadow-xl shadow-slate-900/20">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold tracking-[0.18em] text-slate-400 uppercase">
                Ready to get started?
              </p>
              <h2 className="font-serif text-4xl font-semibold">
                Tell us what your {sector.sector.toLowerCase()} team needs and we&apos;ll
                help you move toward a practical quote.
              </h2>
              <p className="text-base leading-8 text-slate-300">
                Start with a structured enquiry and we&apos;ll follow up with the next steps
                for your order.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
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
                  Sectors
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-600">
                  {sectors.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/sectors/${s.slug}`}
                        className="inline-flex items-center gap-2 transition-colors hover:text-[#10284a]"
                      >
                        <ArrowRightIcon />
                        {s.sector}
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
