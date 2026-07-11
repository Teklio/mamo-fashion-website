import { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./_components/ProductDetailClient";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";
import { mockProducts } from "@/lib/mockProducts";
import type { CustomerProductDetail, CustomerProductVariant } from "@/types/product.type";

export const metadata: Metadata = {
  title: "Product Detail | EVORIA FASHION",
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

  const productVariant = mockProducts.find(p => p.productId === id || p.id === id);
  if (!productVariant) notFound();

  const relatedVariants = mockProducts.filter(p => p.productId === productVariant.productId || p.title === productVariant.title);
  
  const mappedVariants: CustomerProductVariant[] = relatedVariants.map(v => ({
    id: v.id,
    colorName: v.colorName || "Default",
    colorCode: v.colorCode || "#000",
    primaryImage: v.primaryImageUrl ? { id: v.primaryImageUrl, publicUrl: v.primaryImageUrl } : null,
    secondaryImage: v.secondaryImageUrl ? { id: v.secondaryImageUrl, publicUrl: v.secondaryImageUrl } : null,
    images: [],
    sizes: v.sizes,
  }));

  const product: CustomerProductDetail = {
    id: productVariant.productId,
    title: productVariant.title,
    price: productVariant.price,
    description: "Experience premium quality with this handcrafted piece. Perfect for any occasion.",
    feature: "Handcrafted",
    mainCategory: productVariant.mainCategory,
    subCategory: productVariant.subCategory,
    material: productVariant.material,
    variants: mappedVariants,
  };

  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 bg-white text-zinc-950">
        <div className="max-w-400 mx-auto px-8 md:px-16 pb-16 lg:pb-24 border-b border-zinc-100">
          <ProductDetailClient product={product} initialVariantId={variant} />
        </div>

        <FeaturedProducts title="Related Products" hideViewAll={true} category={product.mainCategory} />
      </main>
    </>
  );
}
