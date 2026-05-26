import { Metadata } from "next";
import Link from "next/link";
import { FiSliders, FiChevronDown } from "react-icons/fi";
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
        <div className="max-w-7xl mx-auto px-6 md:px-12">
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

        {/* Toolbar (Filter & Sort) */}
        <div className="flex justify-between items-center py-4 border-t border-zinc-100 mb-8">
          <button className="flex items-center space-x-2 px-4 py-2 border border-zinc-200 rounded-sm text-xs font-sans font-medium tracking-widest text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <FiSliders size={14} />
            <span>FILTER</span>
          </button>

          <div className="flex items-center space-x-3 text-xs font-sans text-zinc-500">
            <span>Sort by:</span>
            <div className="relative">
              <button className="flex items-center space-x-2 px-4 py-2 border border-zinc-200 rounded-sm bg-white min-w-35 justify-between text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <span>Featured</span>
                <FiChevronDown size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ShopGrid />
      </div>
    </main>
    </>
  );
}
