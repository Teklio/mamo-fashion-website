import { Metadata } from "next";
import ProductDetailClient from "./_components/ProductDetailClient";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Product Detail | SORIN",
  description: "View product details.",
};

import { products } from "@/data/products";

// In a real app, this would fetch from a database or API
const getProductData = (id: string) => {
  const product = products.find(p => p.id === id) || products[0];
  
  // Set up detail gallery images: [Primary Image, Hover Image]
  const productImages = [product.image];
  if (product.hoverImage) {
    productImages.push(product.hoverImage);
  }

  return {
    id: product.id,
    name: product.name,
    priceText: product.priceText,
    priceVal: product.priceVal,
    description: "Handcrafted with coastal elegance, these rope sandals feature a soft woven footbed and signature twisted straps. Blending all-day comfort with effortless summer style.",
    images: productImages,
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
