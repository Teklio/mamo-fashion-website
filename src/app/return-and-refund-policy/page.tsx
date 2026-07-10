import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "EVORIA FASHION | Refund & Cancellation Policy",
  description: "Read the refund, return, and cancellation policies of HOUSE OF EVORIA FASHION.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Header theme="light" />
      <main className="relative min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 md:px-18">
        <div className="max-w-400 mx-auto">
          {/* Header */}
          <div className="text-left mb-5 mt-0 md:mt-10">
            <h1 className="text-3xl font-serif text-black tracking-wide font-normal">
              Refund Policy
            </h1>
            <div className="w-12 h-px bg-zinc-300 mt-6" />
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12 font-sans">
            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                1. No Cancellations
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                As soon as your order is placed, our system automatically routes it to our manufacturing and fulfillment partners to prepare your shipment. Consequently, we are unable to accommodate cancellations or changes to your order once checkout is complete. Please review your sizing, color choices, and delivery details carefully before submitting payment.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                2. No Refunds or Returns
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                All sales are final. We do not accept returns or issue refunds for change of mind, sizing errors, or preference shifts. We encourage customers to refer to our comprehensive sizing charts or contact customer care prior to purchase if they require assistance with sizing or fit recommendations.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                3. Damaged or Defective Items
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                In the rare event that you receive a manufacturing defect or the wrong item, HOUSE OF EVORIA FASHION will make it right. You must contact our customer support team within <strong>48 hours</strong> of delivery with clear photographs of the unused product and packaging. Upon inspection and verification of the defect, we will arrange a replacement of the identical item at no extra cost to you.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                4. Shipping and Duties
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Orders returned due to incorrect addresses, failed delivery attempts, or refusal to pay destination customs duties/VAT will not be eligible for a refund. Any additional logistics costs incurred to re-ship the item will be the responsibility of the customer.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
