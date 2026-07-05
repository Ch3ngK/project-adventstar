"use client"; 

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react"; 
import { apiUrl } from "@/lib/api";

type EnquiryFormData = {
    customer_name: string; 
    company_name: string; 
    email: string;
    phone: string;
    message: string; 
};

const initialFormData: EnquiryFormData = {
    customer_name: "",
    company_name: "",
    email: "",
    phone: "",
    message: "", 
};

const enquiryChecklist = [
    "Approximate quantities or size range",
    "Required delivery date or event timeline",
    "Type of apparel needed and any logo printing",
    "Anything already confirmed versus still undecided",
];

export default function EnquiryPage() {
    const [formData, setFormData] = useState<EnquiryFormData>(initialFormData); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const [successMessage, setSuccessMessage] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target; 

        setFormData((currentData) => ({
            ...currentData,
            [name]: value, 
        })); 
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); //stops the browser's normal form behaviour, which would usually refresh the page
        setIsSubmitting(true); 
        setSuccessMessage(""); 
        setErrorMessage(""); 
        
        try {
            const response = await fetch(apiUrl("/enquiries"), { //sends network request to FastAPI
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify(formData), //Converrts JavaScript object into a JSON string
            }); 
        
        if (!response.ok) { //Checks if the backend accepted it 
            const errorText = await response.text();
            throw new Error(errorText || "Failed to submit enquiry"); 
        }    
        
        setSuccessMessage("Your enquiry has been submitted successfully."); 
        setFormData(initialFormData); 
        } catch (error) {
            const message =
              error instanceof Error ? error.message : "Something went wrong. Please try again";
            setErrorMessage(message);
        } finally {
            setIsSubmitting(false); 
        }
    }

     return (
    <main className="min-h-screen bg-[#f5f7fa] px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <section className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.18em] text-[#10284a] uppercase">
                Enquiry Form
              </p>
              <h1 className="font-serif text-5xl font-semibold text-slate-950">
                Tell us what you need
              </h1>
              <p className="text-lg leading-8 text-slate-700">
                Share your uniform requirements and we&apos;ll follow up with the
                details needed to prepare a quotation.
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/10">
              <p className="text-sm font-semibold tracking-[0.18em] text-emerald-400 uppercase">
                Helpful details to include
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-200">
                {enquiryChecklist.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                The more specific the brief, the faster we can understand scope,
                flag missing details, and move toward a practical quote.
              </p>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-slate-900/10 backdrop-blur"
          >
            <div className="space-y-8">
              <section className="space-y-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Contact Details
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Who should we follow up with?
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="customer_name"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Contact Person
                    </label>
                    <input
                      id="customer_name"
                      name="customer_name"
                      type="text"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Ms Tan"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#10284a]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@school.edu.sg"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#10284a]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-semibold text-slate-800"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9123 4567"
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#10284a]"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Organisation
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    Which school or company is this for?
                  </h2>
                </div>

                <div>
                  <label
                    htmlFor="company_name"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Company / School
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Riverside Secondary School"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#10284a]"
                  />
                </div>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-8">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                    Order Brief
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                    What should the quotation cover?
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    Include quantities, apparel type, sizes, artwork or logo needs,
                    and your target timeline if you know it.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-800"
                  >
                    Uniform Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={8}
                    placeholder="e.g. 120 PE shirts and 120 PE shorts for Primary 4 students, navy and white, with school crest on the chest. Needed before 5 August."
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-[#10284a]"
                  />
                </div>
              </section>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#10284a] px-7 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>

              <p className="text-sm text-slate-500">
                Typical next step: we review your brief, confirm anything missing,
                and follow up with quotation details.
              </p>

              <div aria-live="polite" className="space-y-3">
                {successMessage ? (
                  <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-900">
                    <p className="text-sm font-semibold tracking-[0.16em] uppercase">
                      Enquiry Received
                    </p>
                    <p className="mt-2 text-sm leading-7">{successMessage}</p>
                    <p className="mt-2 text-sm leading-7 text-emerald-800">
                      We&apos;ll review the request, check whether anything is missing,
                      and follow up with the next steps for your quote.
                    </p>
                  </div>
                ) : null}

                {errorMessage ? (
                  <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
