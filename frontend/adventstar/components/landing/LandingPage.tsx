import Image from "next/image"
import Link from "next/link"
import Header from "./Header"
import BlurText from "./BlurText"
import ScrollReveal from "./ScrollReveal"
import AnimatedCounter from "./AnimatedCounter"
import UniformScrollShowcase from "./UniformScrollShowcase"

/* ─── Footer icons ──────────────────────────────────────────────────────── */

function ArrowRightIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
    </svg>
  )
}
function MapPinIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s6-4.35 6-10a6 6 0 1 0-12 0c0 5.65 6 10 6 10Z" /><circle cx="12" cy="11" r="2.5" />
    </svg>
  )
}
function BadgeIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.1 2.1 3-.44.44 3L20 10l-2.46 2.34-.44 3-3-.44L12 17l-2.1-2.1-3 .44-.44-3L4 10l2.46-2.34.44-3 3 .44L12 3Z" /><path d="m9.5 10.5 1.5 1.5 3.5-3.5" />
    </svg>
  )
}
function PhoneIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16.42v2.83a1.75 1.75 0 0 1-1.91 1.74A17.52 17.52 0 0 1 3.01 4.91 1.75 1.75 0 0 1 4.75 3h2.83a1.75 1.75 0 0 1 1.75 1.5l.33 2.63a1.75 1.75 0 0 1-.5 1.5l-1.2 1.2a14 14 0 0 0 6.2 6.2l1.2-1.2a1.75 1.75 0 0 1 1.5-.5l2.63.33A1.75 1.75 0 0 1 21 16.42Z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m5 7 7 5 7-5" />
    </svg>
  )
}

/* ─── Data ─────────────────────────────────────────────────────────────── */

const processSteps = [
  {
    step: "01",
    title: "Requirements review",
    description:
      "We align quantities, sizing, branding needs, timelines, and garment use cases before the proposal is shaped.",
  },
  {
    step: "02",
    title: "Quotation and specification",
    description:
      "Each request is translated into a clear quotation with practical production details and a cleaner approval path.",
  },
  {
    step: "03",
    title: "Sampling and approval",
    description:
      "Fabric, trims, printing, embroidery, and finishing are reviewed before the main production run begins.",
  },
  {
    step: "04",
    title: "Production and delivery",
    description:
      "Orders move through manufacturing, quality checks, packing, and fulfilment with steady coordination throughout.",
  },
]

const testimonials = [
  {
    quote:
      "Advent Star has been our go-to supplier for school uniforms for three consecutive years. Their structured quotation process and consistent quality have made every order cycle straightforward.",
    name: "Ms. Tan",
    role: "Procurement Manager",
    org: "Primary School, Singapore",
    initial: "T",
  },
  {
    quote:
      "We needed a reliable partner for our corporate uniform rollout across three office locations. Advent Star managed the entire process cleanly, from sampling through to final delivery.",
    name: "Mr. Lim",
    role: "Operations Director",
    org: "Financial Services Firm",
    initial: "L",
  },
  {
    quote:
      "Sourcing industrial wear in bulk used to be complicated. Advent Star simplified it completely — clear specs, reliable timelines, and good communication throughout the production cycle.",
    name: "Mr. Rahman",
    role: "Facilities Manager",
    org: "Logistics Company",
    initial: "R",
  },
]

/* Images kept for future use — not rendered in current layout
  /employees.png   – hero production team
  /school.png      – education service card
  /corporate.png   – corporate service card
  /industrial.png  – industrial service card
  /operator1.jpg   – gallery
  /machine3.png    – gallery
  /teams.png       – gallery / CTA background
  /specialty.png   – gallery
  /operator2.png   – gallery
  /machine2.png    – process collage
  /knitting.png    – process collage
*/
// Gallery images kept for future use:
// /operator1.jpg, /machine3.png, /teams.png, /specialty.png, /operator2.png

const services = [
  {
    num: "01",
    sector: "Education",
    title: "School uniform programmes",
    description:
      "Supply for preschools, primary schools, secondary schools, and institutions that need consistent quality across student cohorts.",
    features: ["Daily uniforms and PE kits", "Reliable repeat orders"],
    image: "/school.png",
    imagePosition: "object-top",
    href: "/sectors/school-uniform-programmes",
  },
  {
    num: "02",
    sector: "Corporate",
    title: "Corporate uniform collections",
    description:
      "Professional attire for office teams and client-facing roles where presentation and brand consistency matter.",
    features: ["Branding and embroidery", "Structured quotation support"],
    image: "/corporate.png",
    imagePosition: "object-top",
    href: "/sectors/corporate-uniform-collections",
  },
  {
    num: "03",
    sector: "Hospitality",
    title: "Hospitality and service wear",
    description:
      "Uniforms for hotel, F&B, and service teams that balance comfort, durability, and brand alignment across every front-of-house role.",
    features: ["Custom branding", "Consistent standards"],
    image: "/specialty.png",
    href: "/sectors/hospitality-and-service-wear",
  },
  {
    num: "04",
    sector: "Healthcare",
    title: "Healthcare and clinical wear",
    description:
      "Practical, easy-care garments for medical and care teams that need reliable supply, consistent standards, and hygienic materials.",
    features: ["Hygienic materials", "Consistent sizing"],
    image: "/medical.png",
    href: "/sectors/healthcare-and-clinical-wear",
  },
  {
    num: "05",
    sector: "Industrial",
    title: "Industrial and operations wear",
    description:
      "Practical garments for logistics, manufacturing, and field teams that need durability and clear fulfilment across large order volumes.",
    features: ["Built for daily use", "Bulk production and delivery"],
    image: "/industrial2.png",
    imagePosition: "object-top",
    href: "/sectors/industrial-and-operations-wear",
  },
  {
    num: "06",
    sector: "Government",
    title: "Government and public sector",
    description:
      "Structured supply for public agencies and statutory bodies with compliance requirements and well-documented approval processes.",
    features: ["Compliance-ready", "Structured tender support"],
    image: "/teams.png",
    imagePosition: "object-top",
    href: "/sectors/government-and-public-sector",
  },
]

const sectors = ["Education", "Corporate", "Hospitality", "Healthcare", "Industrial", "Government"]

const footerLinks = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "#contact" },
  { label: "Request a Quote", href: "/enquiry" },
]

const footerCategories = [
  "Preschools",
  "Primary Schools",
  "International Schools",
  "MOE Schools",
  "Corporate Offices",
  "Institutions",
]

const contactDetails = [
  { label: "Address", value: "10 Anson Road #10-11 International Plaza, Singapore 079903", Icon: MapPinIcon },
  { label: "GST Registration", value: "GST Reg No 201510303R", Icon: BadgeIcon },
  { label: "Phone", value: "+65 9766 8748", Icon: PhoneIcon },
  { label: "Email", value: "sales@advent-star.com", Icon: MailIcon },
]

const uniformStrengths = [
  {
    title: "Premium fabric sourcing",
    description:
      "Every uniform starts with breathable, durable fabric chosen for comfort through long wear days.",
  },
  {
    title: "Precision tailoring",
    description:
      "Consistent cutting and sizing keep fit uniform across every batch, no matter the order size.",
  },
  {
    title: "Reinforced stitching",
    description:
      "Seams and stress points are reinforced to hold up to daily wear, washing, and repeat use.",
  },
  {
    title: "Fade-resistant finishing",
    description:
      "Colourfast dyeing and finishing keep uniforms looking sharp wash after wash.",
  },
]

const stats = [
  { to: 15, suffix: "+", label: "Years in business" },
  { to: 6, suffix: "", label: "Industries served" },
  { to: 500, suffix: "+", label: "Orders fulfilled" },
  { to: 100, suffix: "%", label: "Custom manufacturing" },
]

/* ─── Page ──────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <main id="top" className="min-h-screen">
      <Header />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#0d1f3c]">
        {/* Background video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/adventstar.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay — left heavy so text stays readable, fades right */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,20,42,0.92) 0%, rgba(10,20,42,0.72) 45%, rgba(10,20,42,0.45) 100%)",
          }}
        />

        {/* Bottom fade into next section */}
        <div
          aria-hidden
          className="absolute bottom-0 inset-x-0 h-32"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(10,20,42,0.6))",
          }}
        />

        {/* Dot grid texture over video */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl flex-1 flex flex-col justify-center px-6 pt-40 pb-20 lg:px-10">
          {/* Badge */}
          <div
            className="mb-10 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase"
            style={{ animation: "hero-fade-up 0.6s ease 0.1s both" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Singapore Uniform Supplier
          </div>

          {/* Headline */}
          <h1 className="max-w-[22ch] text-5xl font-semibold leading-[1.07] tracking-tight text-white sm:text-6xl lg:text-[4.75rem]">
            <BlurText
              text="Professional uniform supply for businesses."
              immediate
              wordDelay={40}
            />
          </h1>

          <p
            className="mt-8 max-w-[480px] text-lg leading-8 text-slate-300"
            style={{ animation: "hero-fade-up 0.7s ease 1.5s both" }}
          >
            Advent Star supports schools, businesses, and operational teams with structured
            quotations, custom manufacturing, and dependable delivery across every order cycle.
          </p>

          <div
            className="mt-10 flex flex-wrap gap-4"
            style={{ animation: "hero-fade-up 0.7s ease 1.7s both" }}
          >
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0d1f3c] shadow-lg transition-all duration-200 hover:bg-slate-100 hover:shadow-xl"
            >
              Start an Enquiry
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/[0.12]"
            >
              View Services
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M7 2.5v9M3.5 8l3.5 3.5L10.5 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          {/* Stats row */}
          <div
            className="mt-14 grid grid-cols-2 gap-x-10 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4"
            style={{ animation: "hero-fade-up 0.7s ease 1.9s both" }}
          >
            {stats.map(({ to, suffix, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  <AnimatedCounter to={to} suffix={suffix} />
                </div>
                <p className="mt-1.5 text-[0.65rem] font-semibold tracking-[0.18em] text-slate-500 uppercase">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Marquee sectors strip */}
        <div className="border-t border-white/[0.08] bg-white/[0.02] overflow-hidden">
          <div className="flex animate-marquee">
            {[...sectors, ...sectors, ...sectors, ...sectors,
              ...sectors, ...sectors, ...sectors, ...sectors].map((s, i) => (
              <span
                key={i}
                className="inline-flex shrink-0 items-center gap-4 px-8 py-4 text-[0.65rem] font-semibold tracking-[0.22em] text-slate-600 uppercase whitespace-nowrap"
              >
                <span className="h-px w-4 bg-slate-700 shrink-0" aria-hidden />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────────────────── */}
      <section id="services" className="bg-[#f5f7fa] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Industries
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Six sectors, one supply partner.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Each service area is designed to help buyers understand where Advent Star can support
              their team, their brand, and their order requirements.
            </p>
          </ScrollReveal>

          <div className="grid gap-px overflow-hidden rounded-[1.5rem] bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, i) => (
              <ScrollReveal key={svc.sector} delay={i * 55}>
                <Link
                  href={svc.href}
                  aria-label={`View ${svc.title} catalog`}
                  className="group relative block h-80 overflow-hidden bg-[#0d1f3c] focus-visible:z-10"
                >

                  {/* Image layer — fades out on hover */}
                  <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                    <Image
                      src={svc.image}
                      alt={svc.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover ${svc.imagePosition ?? "object-center"}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/90 via-[#0a1929]/30 to-transparent" />
                  </div>

                  {/* Front: sector label + title — fades out on hover */}
                  <div className="absolute inset-0 flex flex-col justify-end p-7 transition-opacity duration-300 group-hover:opacity-0">
                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-white/55 uppercase">
                      {svc.sector}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold leading-snug text-white">
                      {svc.title}
                    </h3>
                  </div>

                  {/* Hover: full details — fades in with slight delay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-7 opacity-0 transition-opacity duration-300 delay-100 group-hover:opacity-100">
                    <span className="text-[0.65rem] font-bold tracking-[0.2em] text-slate-400 uppercase">
                      {svc.sector}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-white">
                      {svc.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">
                      {svc.description}
                    </p>
                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4">
                      {svc.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-white">
                      View catalog
                      <svg aria-hidden viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                      </svg>
                    </span>
                  </div>

                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANUFACTURING SHOWCASE ────────────────────────────────────────── */}
      <section className="bg-white py-24 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <ScrollReveal className="mx-auto mb-16 max-w-2xl">
            <p className="mb-4 text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Manufacturing excellence
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Built for quality, at every stage.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Keep scrolling — the uniform comes together in stages, each one built on a quality
              standard that carries through to the finished garment.
            </p>
          </ScrollReveal>
        </div>

        <UniformScrollShowcase
          src="/uniform-animation.mp4"
          poster="/uniform-animation-poster.jpg"
          strengths={uniformStrengths}
        />
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section id="process" className="bg-[#f5f7fa] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal className="mb-16 max-w-xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Manufacturing process
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              A straightforward process from brief to delivery.
            </h2>
          </ScrollReveal>

          <div>
            {processSteps.map((step, i) => (
              <ScrollReveal key={step.step} delay={i * 70}>
                <div className="group grid border-t border-slate-200 py-10 transition-colors duration-200 hover:border-[#10284a]/25 lg:grid-cols-[7rem_18rem_1fr]">
                  <div
                    className="mb-4 text-[4.5rem] font-black leading-none text-slate-200 transition-colors duration-200 group-hover:text-[#10284a]/15 lg:mb-0"
                    aria-hidden
                  >
                    {step.step}
                  </div>
                  <h3 className="self-center text-xl font-semibold text-slate-950 lg:pr-8">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-8 text-slate-600 lg:mt-0 lg:self-center">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
            <div className="border-t border-slate-200" />
          </div>

          <ScrollReveal className="mt-12" delay={350}>
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-[#10284a] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0c1f39]"
            >
              Start an Enquiry
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="bg-white py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal className="mb-12 max-w-xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              What clients say
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Trusted across sectors and order sizes.
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 100}>
                <article className="flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-[#f5f7fa] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className="mb-5 text-7xl font-serif leading-none text-slate-200 select-none"
                    aria-hidden
                  >
                    &ldquo;
                  </div>
                  <p className="flex-1 text-base leading-8 text-slate-700 -mt-6">{t.quote}</p>
                  <div className="mt-8 flex items-center gap-4 border-t border-slate-200 pt-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#10284a] text-sm font-bold text-white">
                      {t.initial}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{t.name}</p>
                      <p className="text-xs text-slate-500">
                        {t.role} · {t.org}
                      </p>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA / CONTACT ─────────────────────────────────────────────────── */}
      <section id="contact" className="relative overflow-hidden bg-[#0a1929] py-20 lg:py-28">
        {/* Dot grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-white/10 bg-[#10284a] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:p-12">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Contact
                  </p>
                  <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    <BlurText
                      text="Ready to discuss your uniform requirements?"
                      wordDelay={50}
                    />
                  </h2>
                  <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                    Tell us what your team needs and we will help shape the next steps with a clear
                    quotation and production plan.
                  </p>
                  <p className="mt-6 text-sm text-slate-400">
                    sales@advent-star.com
                    <span className="mx-3 text-slate-600">|</span>
                    +65 9766 8748
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href="/enquiry"
                    className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#10284a] transition-colors hover:bg-slate-100"
                  >
                    Go to Enquiry Form
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.07]"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.07] bg-[#070d1a]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <ScrollReveal>
            <div className="grid gap-10 border-b border-white/[0.08] pb-10 md:grid-cols-2 xl:grid-cols-4">

              {/* Logo column */}
              <div className="space-y-4">
                <Image
                  src="/adventstar-logo.png"
                  alt="Advent Star Uniform Supplier"
                  width={1057}
                  height={719}
                  className="h-auto w-[11rem]"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                <p className="max-w-[18rem] text-sm leading-7 text-slate-500">
                  Uniform supply for schools, businesses, and operational teams across Singapore.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">
                  Quick Links
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-400">
                  {footerLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 transition-colors hover:text-white"
                      >
                        <ArrowRightIcon />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">
                  Categories
                </h3>
                <ul className="mt-5 space-y-3 text-sm text-slate-400">
                  {footerCategories.map((cat) => (
                    <li key={cat}>
                      <Link
                        href="#services"
                        className="inline-flex items-center gap-2 transition-colors hover:text-white"
                      >
                        <ArrowRightIcon />
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-serif text-xl font-semibold text-white">
                  Contact
                </h3>
                <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-400">
                  {contactDetails.map(({ label, value, Icon }) => (
                    <li key={label} className="flex items-start gap-3">
                      <span className="text-emerald-400">
                        <Icon />
                      </span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="flex flex-col gap-4 pt-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
              <p>&copy; 2026 Advent Star Uniforms. All rights reserved.</p>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="transition-colors hover:text-slate-400">Privacy Policy</a>
                <a href="#" className="transition-colors hover:text-slate-400">Terms of Service</a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </main>
  )
}
