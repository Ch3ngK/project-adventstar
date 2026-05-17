export default function Home() {
  const trustPoints = [
    "Clear quotations with faster turnaround for repeat and new customers",
    "Support for schoolwear, PE attire, corporate uniforms, and custom orders",
    "A structured workflow from enquiry to production and delivery",
  ];

  const productCategories = [
    "School uniforms",
    "PE attire",
    "Corporate wear",
    "Team apparel",
  ];

  const processSteps = [
    {
      step: "01",
      title: "Tell us what you need",
      description:
        "Share quantities, sizes, timelines, and branding requirements through a structured enquiry.",
    },
    {
      step: "02",
      title: "Receive a tailored quotation",
      description:
        "We review the request and prepare a quote with practical details and next steps.",
    },
    {
      step: "03",
      title: "Confirm production details",
      description:
        "Once approved, we lock in specifications, artwork, and order milestones.",
    },
    {
      step: "04",
      title: "Track to delivery",
      description:
        "Orders move through production with clearer visibility and dependable coordination.",
    },
  ];

  const sampleClients = [
    "Schools",
    "Student organisations",
    "Corporate teams",
    "Training providers",
    "Event organisers",
  ];

  return (
    <main
      id="top"
      className="overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_26%),linear-gradient(180deg,_#fffaf0_0%,_#f8f3e8_55%,_#efe2cc_100%)] text-slate-900"
    >
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-amber-300/80 bg-amber-100/80 px-4 py-2 text-sm font-semibold tracking-[0.18em] text-amber-900 uppercase">
            Uniform Supply, Simplified
          </span>

          <div className="space-y-5">
            <h1 className="max-w-4xl font-serif text-5xl leading-tight font-semibold text-slate-950 sm:text-6xl">
              Reliable uniform supply for schools, teams, and businesses.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
              Advent Star helps organisations move from enquiry to quotation and
              delivery with less back-and-forth, clearer coordination, and a
              more dependable buying experience.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#enquiry"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20"
            >
              Request a Quote
            </a>
            <a
              href="#process"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/80 px-7 py-4 text-sm font-semibold tracking-wide text-slate-900 shadow-sm"
            >
              See How It Works
            </a>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-bold text-amber-700">Fast</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Structured enquiries help shorten quote turnaround time.
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-bold text-amber-700">Clear</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Better visibility from customer request to production progress.
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
              <p className="text-3xl font-bold text-amber-700">Reliable</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Built for real repeat business, operational follow-up, and delivery.
              </p>
            </div>
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
                  120 PE uniforms requested for an August delivery.
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

      <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
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

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-slate-500 uppercase">
              What We Supply
            </p>
            <h2 className="font-serif text-4xl font-semibold text-slate-950">
              Uniform programmes that need consistency, responsiveness, and
              follow-through.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-700">
              From schoolwear essentials to branded team apparel, Advent Star is
              built around practical supply needs and repeat operational
              follow-up.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {productCategories.map((category, index) => (
              <div
                key={category}
                className="rounded-[1.75rem] border border-slate-200 bg-white/85 p-7 shadow-sm"
              >
                <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
                  Category {index + 1}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-slate-950">
                  {category}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">
                  Designed for organisations that need clearer communication and
                  a smoother path from enquiry to fulfilment.
                </p>
              </div>
            ))}
          </div>
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
        <div className="grid gap-8 rounded-[2rem] bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-900/20 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold tracking-[0.18em] text-amber-300 uppercase">
              Past Clients
            </p>
            <h2 className="font-serif text-4xl font-semibold">
              Built for real organisations, not just one-off orders.
            </h2>
            <p className="text-base leading-8 text-slate-300">
              Replace these placeholders with real customer names or logos once
              you have approval to publish them.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sampleClients.map((client) => (
              <div
                key={client}
                className="rounded-3xl border border-white/10 bg-white/5 px-5 py-6 text-center text-sm font-semibold tracking-[0.12em] text-slate-100 uppercase"
              >
                {client}
              </div>
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
              Tell us what you need and we&apos;ll follow up with the details
              required to prepare a practical quotation.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:mt-0">
            <a
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-sm font-semibold tracking-wide text-amber-900 shadow-lg"
            >
              Go to Enquiry Form
            </a>
            <a
              href="#top"
              className="inline-flex items-center justify-center rounded-full border border-white/50 px-7 py-4 text-sm font-semibold tracking-wide text-white"
            >
              Back to Top
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
