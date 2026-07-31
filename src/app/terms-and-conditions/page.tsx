import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "MAMO FASHION | Terms & Conditions",
  description: "Read the Terms & Conditions governing the use of the HOUSE OF MAMO FASHION platform and purchases.",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header theme="light" />
      <main className="relative min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 md:px-18">
        <div className="max-w-400 mx-auto">
          {/* Header */}
          <div className="text-left mt-0 md:mt-10 mb-10">
            <h1 className="text-3xl font-serif text-black tracking-wide font-normal">
              Terms & Conditions
            </h1>
            <div className="w-12 h-px bg-zinc-300 mt-6" />
          </div>
          {/* Content */}
          <div className="space-y-6 font-sans text-sm text-zinc-600 leading-relaxed">
            <p className="text-base text-zinc-800 mb-6">
              By using this website, you agree to the following terms:
            </p>
            <ul className="list-disc pl-6 space-y-4 text-base">
              <li>All products are subject to availability.</li>
              <li>Product colors may vary slightly due to screen settings.</li>
              <li>Prices and product details may change without prior notice.</li>
              <li>We reserve the right to cancel or refuse any order if necessary.</li>
            </ul>
            <p className="mt-8 text-base text-zinc-800">
              For any questions, please contact us through our official WhatsApp number or email.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
