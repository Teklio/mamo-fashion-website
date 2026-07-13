// ─── List item (one row per active variant from GET /products/customer) ───────

export interface CustomerProductSize {
  id: string;
  name: string;
  stock: number;
}

export interface CustomerProduct {
  id: string; // variant id
  productId: string; // product id (used for navigation and wishlist)
  name: string;
  /** Prisma Decimal serialised as string, e.g. "289.00" */
  commonPrice: string;
  actualPrice: string;
  primaryImageUrl: string | null;
  colorName: string | null;
  /** Comma-separated hex list, e.g. "#ffffff,#000000" */
  colorCodes: string | null;
  sizes: CustomerProductSize[];
}

export interface GetCustomerProductsResponse {
  variants: CustomerProduct[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

// ─── Detail item (GET /products/customer/:id) ─────────────────────────────────

export interface CustomerProductVariantSize {
  id: string;
  name: string;
  stock: number;
  /** Prisma Decimal serialised as string */
  additionalPrice: string;
  /** commonPrice + additionalPrice, computed server-side as a number */
  finalPrice: number;
}

export interface CustomerProductVariant {
  id: string;
  colorName: string;
  /** Comma-separated hex list */
  colorCodes: string;
  primaryImageUrl: string | null;
  imageUrls: string[];
  sizes: CustomerProductVariantSize[];
}

export interface CustomerProductDetail {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  commonPrice: string;
  actualPrice: string;
  subCategory: { id: string; name: string } | null;
  material: { id: string; name: string } | null;
  variants: CustomerProductVariant[];
}

export interface GetCustomerProductResponse {
  product: CustomerProductDetail;
}

/** Helper: server sends colorCodes as a comma-separated string; take the first. */
export function firstColorCode(colorCodes: string | null | undefined): string {
  if (!colorCodes) return "#000000";
  return colorCodes.split(",")[0]?.trim() || "#000000";
}
