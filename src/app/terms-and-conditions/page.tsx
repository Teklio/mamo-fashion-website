import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "EVORIA FASHION | Terms & Conditions",
  description: "Read the Terms & Conditions governing the use of the HOUSE OF EVORIA FASHION platform and purchases.",
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
          <div className="space-y-12 font-sans text-sm text-zinc-600 leading-relaxed">
            <section>
              <p className="mb-4 text-xs text-zinc-500 uppercase tracking-widest">
                Last Updated: 06-06-2026
              </p>
              <p className="mb-4">
                Welcome to Evoria.ae. By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                1. Company Information
              </h3>
              <p>
                Evoria Shoe Trading is an online retailer specializing in footwear products, including shoes, sandals, and slippers.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                2. User Obligations
              </h3>
              <p className="mb-4">
                By using this website, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information when placing orders.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Use the website only for lawful purposes.</li>
                <li>Not engage in fraudulent, abusive, or harmful activities.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                3. Product Information
              </h3>
              <p className="mb-4">
                We strive to ensure that product descriptions, images, specifications, and pricing are accurate. However, minor variations in color, appearance, or specifications may occur.
              </p>
              <p>
                We reserve the right to correct errors, inaccuracies, or omissions at any time without prior notice.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                4. Pricing and Payments
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices are displayed in AED unless otherwise stated.</li>
                <li>Prices may change without prior notice.</li>
                <li>Payment must be completed through approved payment methods available on the website.</li>
                <li>Orders will only be processed after successful payment authorization.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                5. Order Acceptance
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All orders are subject to availability and acceptance.</li>
                <li>We reserve the right to refuse or cancel any order for any reason.</li>
                <li>If payment has already been made for a cancelled order, a refund will be processed according to our Refund Policy.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                6. Intellectual Property
              </h3>
              <p className="mb-4">
                All website content including text, graphics, logos, images, product descriptions, designs, and software are the property of Evoria Shoe Trading and are protected under applicable intellectual property laws.
              </p>
              <p>
                No content may be copied, reproduced, distributed, or used without prior written permission.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                7. Limitation of Liability
              </h3>
              <p>
                To the maximum extent permitted by law, Evoria Shoe Trading shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of this website or products purchased through it.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                8. Governing Law
              </h3>
              <p className="mb-4">
                These Terms and Conditions shall be governed by and interpreted in accordance with the laws of the United Arab Emirates.
              </p>
              <p>
                Any disputes shall be subject to the exclusive jurisdiction of the competent courts of the UAE.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                9. Changes to Terms
              </h3>
              <p>
                We reserve the right to update or modify these Terms and Conditions at any time. Continued use of the website constitutes acceptance of any revisions.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
