import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./_components/ProductDetailClient";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";
import type { CustomerProductDetail } from "@/types/product.type";

export const metadata: Metadata = {
  title: "Product Detail | SORIN",
  description: "View product details.",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/customer/${id}`,
    { cache: "no-store" },
  );

  if (!res.ok) notFound();

  const { product }: { product: CustomerProductDetail } = await res.json();

  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 bg-white text-zinc-950">
        <div className="max-w-400 mx-auto px-8 md:px-16 pb-16 lg:pb-24 border-b border-zinc-100">
          <ProductDetailClient product={product} />
        </div>

        <FeaturedProducts title="Related Products" hideViewAll={true} />
      </main>
    </>
  );
}
