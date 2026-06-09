import Image from "next/image";
import Link from "next/link";

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
    imageSrc: "/machine2.png",
    imageAlt: "Production machines used for uniform work",
    spanClass: "lg:col-span-2",
  },
  {
    title: "People Behind It",
    description:
      "Our team manages preparation, coordination, and quality checks so customers get clearer communication throughout the process.",
    imageSrc: "/operator2.png",
    imageAlt: "Team members working on uniforms",
    spanClass: "",
  },
  {
    title: "Detail and Finishing",
    description:
      "Careful finishing helps each order look polished, feel consistent, and arrive ready for everyday use.",
    imageSrc: "/employees.png",
    imageAlt: "Uniform production and finishing details",
    spanClass: "",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_26%),linear-gradient(180deg,_#fffaf0_0%,_#f8f3e8_55%,_#efe2cc_100%)] text-slate-900">
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
                src="/operator2.png"
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
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
    </main>
  );
}
