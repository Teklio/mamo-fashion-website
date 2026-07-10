import { Metadata } from "next";
import Header from "@/components/Header";
import CheckoutClient from "./_components/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout – EVORIA FASHION",
  description: "Complete your purchase at EVORIA FASHION",
};

export default function CheckoutPage() {
  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen bg-white pt-28 pb-24 text-zinc-950">
        <CheckoutClient />
      </main>
    </>
  );
}

