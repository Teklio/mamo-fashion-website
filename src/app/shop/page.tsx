import { Metadata } from "next";
import Link from "next/link";
import ShopGrid from "./_components/ShopGrid";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Shop | SORIN",
  description: "Explore the Signature Styles collection at SORIN.",
};

export default function ShopPage() {
  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 pb-24 bg-white text-zinc-950">
        <div className="max-w-400 mx-auto px-8 md:px-16">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-xs text-zinc-500 mb-8 font-sans">
            <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="font-semibold text-zinc-900">Shop</span>
          </div>

          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-12">
            Signature Styles
          </h1>

          {/* Product Grid */}
          <ShopGrid />
        </div>
      </main>
    </>
  );
}
