import { Metadata } from "next";
import CheckoutClient from "./_components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout - SORIN",
  description: "Complete your purchase at SORIN",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">
      <CheckoutClient />
    </main>
  );
}
