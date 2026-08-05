import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Shipping Policy | Mamo Fashion",
  description: "Read the Shipping Policy governing deliveries, processing times, and logistics for Mamo Fashion. Fast and reliable shipping for your orders.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <Header theme="light" />
      <main className="relative min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 md:px-18">
        <div className="max-w-400 mx-auto">
          {/* Header */}
          <div className="text-left mb-16 mt-0 md:mt-10">
            <h1 className="text-3xl font-serif text-black tracking-wide font-normal">
              Shipping Policy
            </h1>
            <div className="w-12 h-px bg-zinc-300 mt-6" />
          </div>

          {/* Content */}
          <div className="space-y-12 font-sans text-sm text-zinc-600 leading-relaxed">
            <section>
              <p className="mb-4 text-xs text-zinc-500 uppercase tracking-widest">
                Last Updated: 06-06-2026
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Shipping Partner
              </h3>
              <p>
                mamofashion.com uses approved logistics partners for domestic deliveries.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Delivery Areas
              </h3>
              <p className="mb-4">
                We currently deliver to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>India</li>
                <li>Kerala</li>
              </ul>
              <p>
                Delivery availability may vary by location.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Order Processing
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders are generally processed within 1-2 business days after payment confirmation.</li>
                <li>Orders placed during weekends or public holidays may require additional processing time.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Estimated Delivery Times
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Kerala: 2-3 business days</li>
                <li>Rest of India: 3-5 business days</li>
              </ul>
              <p>
                Actual delivery times may vary depending on local courier services.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Shipment Tracking
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Once your order is dispatched, tracking details will be sent via email or SMS.</li>
                <li>Customers can track shipments using the tracking tools provided by our logistics partners.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Delivery Delays
              </h3>
              <p className="mb-4">
                mamofashion.com shall not be responsible for delays caused by:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Weather conditions</li>
                <li>Public holidays</li>
                <li>Transportation disruptions</li>
                <li>Events beyond our reasonable control</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Incorrect Address Information
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Customers are responsible for providing accurate shipping information.</li>
                <li>Additional delivery charges may apply if an incorrect address is provided.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
