import { Metadata } from "next";
import ProductDetailClient from "./_components/ProductDetailClient";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Product Detail | SORIN",
  description: "View product details.",
};

// In a real app, this would fetch from a database or API
const getProductData = (id: string) => {
  return {
    id,
    name: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    description: "Handcrafted with coastal elegance, these rope sandals feature a soft woven footbed and signature twisted straps in yellow, ocean blue, and sand tones. Blending all-day comfort with effortless summer style.",
    images: [
      "/assets/Home/1.png",
      "/assets/Home/2.png",
      "/assets/Home/3.png",
    ],
  };
};

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductData(id);

  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 pb-24 bg-white text-zinc-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
        <ProductDetailClient product={product} />
      </div>
    </main>
    </>
  );
}
