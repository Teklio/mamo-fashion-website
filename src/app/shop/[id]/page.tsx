import { Metadata } from "next";
import ProductDetailClient from "./_components/ProductDetailClient";
import Header from "@/components/Header";
import FeaturedProducts from "@/components/FeaturedProducts";
import type { GetCustomerProductResponse } from "@/types/product.type";

const FALLBACK_METADATA: Metadata = {
  title: "Premium Ethnic Wear Product | Mamo Fashion",
  description: "Discover the details of this premium ethnic wear product. Shop exclusive churidars, dresses, and kurtis at Mamo Fashion.",
};

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { variant } = await searchParams;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/v1";
    const url = `${apiBase}/products/customer/${id}${variant ? `?variantId=${variant}` : ""}`;
    // Product images are now permanent public CDN URLs (not signed/expiring),
    // so it's safe to cache this response for a few minutes per product.
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.error(
        `generateMetadata: ${url} responded ${res.status} ${res.statusText}`,
      );
      return FALLBACK_METADATA;
    }

    const { product }: GetCustomerProductResponse = await res.json();
    const title = `${product.name} | Mamo Fashion`;
    const description = product.description?.trim()
      ? product.description
      : `Shop ${product.name} at Mamo Fashion — premium ethnic wear, crafted for the modern woman.`;
    const image = product.variant?.primaryImageUrl;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/shop/${id}`,
        images: image ? [{ url: image, width: 1200, height: 1200, alt: product.name }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch (err) {
    console.error("generateMetadata: failed to fetch product", err);
    return FALLBACK_METADATA;
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const { id } = await params;
  const { variant } = await searchParams;

  return (
    <>
      <Header theme="light" />
      <main className="min-h-screen mt-0 md:mt-10 pt-32 bg-white text-zinc-950">
        <div className="max-w-400 mx-auto px-4 md:px-16 pb-16 lg:pb-24 border-b border-zinc-100">
          <ProductDetailClient productId={id} initialVariantId={variant} />
        </div>

        <FeaturedProducts title="Related Products" hideViewAll={true} />
      </main>
    </>
  );
}
