import { Metadata } from "next";
import Header from "@/components/Header";
import { FiFileText } from "react-icons/fi";

export const metadata: Metadata = {
  title: "SORIN | Terms & Conditions",
  description: "Read the Terms & Conditions governing the use of the HOUSE OF SORIN platform and purchases.",
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
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                1. General Provisions & Company Information
              </h3>
              <p className="mb-4">
                This platform is owned and operated by HOUSE OF SORIN. We specialize in premium luxury footwear and lifestyle products.
              </p>
              <p className="mb-4">
                For customer support, queries, or communications:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Brand Identity:</strong> HOUSE OF SORIN</li>
                <li><strong>Headquarters:</strong> Dubai, United Arab Emirates (UAE)</li>
                <li><strong>Primary Email Support:</strong> support@sorin.com</li>
                <li><strong>WhatsApp Business:</strong> +971 50 728 4619</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                2. Governing Law
              </h3>
              <p>
                These Terms & Conditions, and any dispute arising from the use of this website or the purchase of our products, shall be governed by and construed in accordance with the federal laws of the United Arab Emirates and the local laws of the Emirate of Dubai, without giving effect to any principles of conflicts of law.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                3. Customer Accounts & Security
              </h3>
              <p>
                When creating an account on HOUSE OF SORIN, you agree to provide true, accurate, and complete information, including up-to-date shipping details. You are solely responsible for maintaining the confidentiality of your account credentials, including your password. You agree to accept responsibility for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate our security protocols.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                4. Purchase Terms & Payment Gateways
              </h3>
              <p className="mb-4">
                By submitting an order, you warrant that you are legally authorized to use the designated payment method. We support the following payment methods:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Credit Card Processing:</strong> Managed securely via Checkout.com (supporting Visa, Mastercard, and American Express).</li>
                <li><strong>Installment Plans:</strong> Tabby (Pay in 4 interest-free installments) and Tamara (Split in 3 interest-free installments). Installment options are subject to credit approvals determined by the respective platforms.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                5. Strict Sales Policy
              </h3>
              <p>
                Due to the limited-edition nature and custom craft of our products, <strong>all sales are final</strong>. We do not support returns, exchanges for change of mind, sizing errors, or order cancellations once payment is processed. You are responsible for ensuring that all selections (sizes, colors, delivery addresses) are verified before checkout.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                6. Intellectual Property
              </h3>
              <p>
                All content, product designs, trademark names, images, illustrations, videos, text, logos, graphics, and layout assets displayed on this site are the exclusive property of HOUSE OF SORIN. Any unauthorized reproduction, distribution, modification, or display of these materials is strictly prohibited and subject to legal action under UAE copyright and intellectual property laws.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                7. Limitation of Liability
              </h3>
              <p>
                HOUSE OF SORIN provides the website and services on an &quot;as is&quot; and &quot;as available&quot; basis. We make no representations or warranties of any kind, express or implied, regarding the operation of our website, the accuracy of our product listings, or the availability of the server. To the fullest extent permitted by UAE law, we disclaim all liability for any direct, indirect, incidental, or consequential damages resulting from the use of our services or products.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
