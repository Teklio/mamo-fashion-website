import { Metadata } from "next";
import ProductDetailClient from "./_components/ProductDetailClient";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";

export const metadata: Metadata = {
  title: "Product Detail | MAMO FASHION",
  description: "View product details.",
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { id } = await params;
  const { variant } = await searchParams;

  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 bg-white text-zinc-950">
        <div className="max-w-400 mx-auto px-8 md:px-16 pb-16 lg:pb-24 border-b border-zinc-100">
          <ProductDetailClient productId={id} initialVariantId={variant} />
        </div>

        <FeaturedProducts title="Related Products" hideViewAll={true} />
      </main>
    </>
  );
}
