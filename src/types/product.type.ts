// ─── List item (used by FeaturedProducts and ShopGrid) ───────────────────────

export interface CustomerProduct {
  id: string;         // variant id
  productId: string;  // product id (used for navigation and wishlist)
  title: string;
  price: string;
  primaryImageUrl: string | null;
  secondaryImageUrl: string | null;
  colorName: string | null;
  colorCode: string | null;
  sizes: { id: string; size: string; stock: number }[];
}

export interface GetCustomerProductsResponse {
  variants: CustomerProduct[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

// ─── Detail item (used by ProductDetailClient) ────────────────────────────────

export interface CustomerProductVariantImage {
  id: string;
  publicUrl: string;
}

export interface CustomerProductVariant {
  id: string;
  colorName: string;
  colorCode: string;
  primaryImage: CustomerProductVariantImage | null;
  secondaryImage: CustomerProductVariantImage | null;
  images: CustomerProductVariantImage[];
  sizes: { id: string; size: string; stock: number }[];
}

export interface CustomerProductDetail {
  id: string;
  title: string;
  price: string;
  description: string | null;
  feature: string | null;
  variants: CustomerProductVariant[];
}

export interface GetCustomerProductResponse {
  product: CustomerProductDetail;
}
