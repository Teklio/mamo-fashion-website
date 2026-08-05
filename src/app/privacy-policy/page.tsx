import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Privacy Policy | Mamo Fashion",
  description: "Understand how Mamo Fashion collects, uses, and safeguards your personal data. We value your privacy and security.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header theme="light" />
      <main className="relative min-h-screen bg-white text-zinc-900 pt-32 pb-24 px-6 md:px-18">
        <div className="max-w-400 mx-auto">
          {/* Header */}
          <div className="text-left mb-16 mt-0 md:mt-10">
            <h1 className="text-3xl font-serif text-black tracking-wide font-normal">
              Privacy Policy
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
                At mamofashion.com, we are committed to protecting your privacy.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Information We Collect
              </h3>
              <p className="mb-4">
                We may collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping address</li>
                <li>Billing address</li>
                <li>Order history</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Cookies
              </h3>
              <p className="mb-4">
                Our website uses cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Improve user experience</li>
                <li>Remember user preferences</li>
                <li>Analyze website traffic</li>
                <li>Enhance website performance</li>
              </ul>
              <p>
                Users may disable cookies through their browser settings.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Payment Information
              </h3>
              <p className="mb-4">
                Payments are processed securely through authorized payment providers.
              </p>
              <p>
                We do not store full payment card details on our servers.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Marketing Communications
              </h3>
              <p className="mb-4">
                With your consent, we may send promotional emails, offers, product updates, and newsletters.
              </p>
              <p>
                You may unsubscribe at any time using the unsubscribe link in our communications.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Data Protection
              </h3>
              <p>
                We implement reasonable technical and organizational measures to protect customer information against unauthorized access, misuse, disclosure, or loss.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Third-Party Services
              </h3>
              <p className="mb-4">
                We may share necessary information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Payment providers</li>
                <li>Technology service providers</li>
              </ul>
              <p>
                Such sharing is limited to services required to fulfill your orders.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Contact
              </h3>
              <p className="mb-4">
                For privacy-related inquiries, please contact:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Email: <a href="mailto:mamofashion144@gmail.com" className="text-black underline font-medium">mamofashion144@gmail.com</a></li>
                <li>Phone: <span className="text-black font-medium">+91 9567530926</span></li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                Changes to This Policy
              </h3>
              <p>
                We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
