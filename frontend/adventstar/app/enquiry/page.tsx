"use client"; 

import { ChangeEvent, FormEvent, useState } from "react"; 

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
}

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
            const response = await fetch("http://127.0.0.1:8000/enquiries", { //sends network request to FastAPI
                method: "POST", 
                headers: {
                    "Content-Type": "application/json", 
                }, 
                body: JSON.stringify(formData), //Converrts JavaScript object into a JSON string
            }); 
        
        if (!response.ok) { //Checks if the backend accepted it 
            throw new Error("Failed to submit enquiry"); 
        }    
        
        setSuccessMessage("Your enquiry has been submitted successfully."); 
        setFormData(initialFormData); 
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again");
        } finally {
            setIsSubmitting(false); 
        }
    }

     return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#fffaf0_0%,_#f8f3e8_55%,_#efe2cc_100%)] px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 space-y-4 text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-amber-700 uppercase">
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

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/80 bg-white/80 p-8 shadow-xl shadow-slate-900/10 backdrop-blur"
        >
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
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500"
              />
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
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500"
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
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
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
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
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
                rows={6}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-7 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>

            {successMessage ? (
              <p className="text-sm font-medium text-emerald-700">
                {successMessage}
              </p>
            ) : null}

            {errorMessage ? (
              <p className="text-sm font-medium text-red-600">{errorMessage}</p>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}
