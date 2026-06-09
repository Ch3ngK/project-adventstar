import Image from "next/image";
import Link from "next/link";

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

      <section className="mx-auto max-w-5xl px-6 py-20 lg:px-10">
        <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
          About Us
        </p>

        <h1 className="mt-4 font-serif text-5xl font-semibold text-slate-950">
          Reliable uniform supply with practical follow-through.
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
          Advent Star supports schools, teams, and businesses in Singapore with
          a supply process that is responsive, dependable, and easier to manage
          from first enquiry to final delivery.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 lg:px-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
            Behind the Work
          </p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-slate-950">
            A closer look at how Advent Star works.
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            From production equipment to hands-on coordination, every order is
            supported by a practical workflow designed for consistency.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/80 shadow-sm">
            <div className="relative h-72">
              <Image
                src="/machine2.png"
                alt="Production machines used for uniform work"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-950">
                Production Technology
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Modern equipment helps us handle consistent runs, cleaner
                finishing, and the practical demands of repeat orders.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/80 shadow-sm">
            <div className="relative h-72">
              <Image
                src="/operator2.png"
                alt="Team members working on uniforms"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-950">
                People Behind It
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Our team manages preparation, coordination, and quality checks
                so customers get clearer communication throughout the process.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/80 shadow-sm">
            <div className="relative h-72">
              <Image
                src="/employees.png"
                alt="Uniform production and finishing details"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-950">
                Detail and Finishing
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Careful finishing helps each order look polished, feel
                consistent, and arrive ready for everyday use.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-20 lg:grid-cols-3 lg:px-10">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-7 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-slate-950">
            What We Do
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            We provide school uniforms, PE attire, corporate wear, and team
            apparel for organisations that need dependable supply.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-7 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-slate-950">
            Who We Serve
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Our customers include schools, SMEs, training providers, event
            organisers, and groups that place repeat uniform orders.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white/80 p-7 shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-slate-950">
            Why It Matters
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            We focus on making the process smoother with clearer updates,
            practical follow-through, and fewer unnecessary delays.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24 lg:px-10">
        <div className="rounded-[2rem] border border-amber-200 bg-white/70 p-8 shadow-sm">
          <h2 className="font-serif text-3xl font-semibold text-slate-950">
            Ready to get started?
          </h2>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Tell us what you need and we&apos;ll help you move toward a
            practical quote.
          </p>
          <div className="mt-6">
            <Link
              href="/enquiry"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white"
            >
              Go to Enquiry Form
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
