import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Mamo Fashion",
  description: "Read the refund and return policies of Mamo Fashion. We ensure a smooth process for returns and exchanges on your premium ethnic wear.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header theme="light" />
      <main className="relative min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 md:px-18">
        <div className="max-w-400 mx-auto">
          {/* Header */}
          <div className="text-left mb-10 mt-0 md:mt-10">
            <h1 className="text-3xl font-serif text-black tracking-wide font-normal">
              Refund & Return Policy
            </h1>
            <div className="w-12 h-px bg-zinc-300 mt-6" />
          </div>

          {/* Detailed Sections */}
          <div className="space-y-6 font-sans text-sm text-zinc-600 leading-relaxed">
            <p className="text-base text-zinc-800 mb-6">
              We want you to be satisfied with your purchase.
            </p>
            <ul className="list-disc pl-6 space-y-4 text-base">
              <li>Returns or exchange requests must be made within <strong>7 days</strong> of receiving the product.</li>
              <li>Items must be unused, unwashed, and in their original condition with all tags attached.</li>
              <li>Products damaged by the customer are not eligible for return or refund.</li>
              <li>Once the returned item is inspected and approved, the refund will be processed within <strong>5-7 business days</strong> to the original payment method.</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
