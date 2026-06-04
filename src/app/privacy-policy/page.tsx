import { Metadata } from "next";
import Header from "@/components/Header";
import { FiShield } from "react-icons/fi";

export const metadata: Metadata = {
  title: "SORIN | Privacy Policy",
  description: "Understand how HOUSE OF SORIN collects, uses, and safeguards your personal data.",
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
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                1. Information We Collect
              </h3>
              <p className="mb-4">
                We gather information necessary to provide a personalized, secure, and seamless luxury shopping experience. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account & Contact Data:</strong> Name, email address, password, shipping address, billing address, and phone number when you create an account or checkout.
                </li>
                <li>
                  <strong>Session & Shopping State:</strong> Items added to your cart, items saved in your wishlist, sizing preferences, and color selections to ensure persistence across visits.
                </li>
                <li>
                  <strong>Payment Information:</strong> Standard order billing details. All actual credit card transactions are processed securely via <em>Checkout.com</em>. Flexible checkout options are routed to <em>Tabby</em> and <em>Tamara</em>. HOUSE OF SORIN does not store your full card number or payment credentials on our servers.
                </li>
                <li>
                  <strong>Device & Interaction Data:</strong> IP address, browser type, and screen viewport dimensions (collected to serve responsive layout variations such as device-optimized video headers).
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                2. How We Use Your Information
              </h3>
              <p className="mb-4">
                The information we collect is utilized strictly for business and operational needs, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processing, packing, and dispatching your orders.</li>
                <li>Managing your personal account, address lists, and order history.</li>
                <li>Securing payments and preventing fraudulent transactions.</li>
                <li>Optimizing website responsiveness and page performance based on device metadata.</li>
                <li>Communicating updates, support responses, and requested collections notifications.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                3. Cookies and Local Storage
              </h3>
              <p>
                We use cookies and local storage (such as HTML5 LocalStorage) to keep track of your shopping cart contents, active user sessions, and wishlist preferences. These files help us recognize you when you return to our site so you do not have to rebuild your cart or log in repeatedly. You can configure your browser to reject cookies, but some areas of our store may not function correctly.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                4. Data Sharing and Third Parties
              </h3>
              <p className="mb-4">
                We do not sell, rent, or trade your personal data. We share relevant data only with trusted service partners to complete transactions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Payment Providers:</strong> Checkout.com, Tabby, and Tamara for credit, installment, or split payments.</li>
                <li><strong>Logistics Partners:</strong> Local and international couriers to deliver your orders to your shipping address.</li>
                <li><strong>Regulatory Bodies:</strong> When required by laws applicable in the United Arab Emirates to protect against legal liability or fraud.</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                5. Data Security
              </h3>
              <p>
                We implement industry-standard administrative, technical, and physical security measures (including HTTPS encryption) to safeguard your personal details. However, no electronic transmission or storage is 100% secure. While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl text-black mb-4 tracking-wide border-b border-zinc-100 pb-2">
                6. Contact Information
              </h3>
              <p>
                For questions regarding this Privacy Policy or requests regarding your personal data, please contact customer care via email at <a href="mailto:support@sorin.com" className="text-black underline font-medium">support@sorin.com</a> or via WhatsApp at <span className="text-black font-medium">+971 50 728 4619</span>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
