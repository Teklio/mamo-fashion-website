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

// Parse a comma-separated hex string (e.g. "#000000,#FFFFFF") into an array,
// dropping anything that isn't a valid hex code.
export function parseColorCodes(colorCodes: string | null | undefined): string[] {
  return (colorCodes ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter((c) => /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(c));
}

// A color can carry up to several hex codes (e.g. "green/yellow/rosegold" ->
// 3 codes) — render every one of them as equal-width stripes rather than
// only ever showing the first, so multi-tone colors preview correctly.
// Mirrors mamo-fashion-admin's getMultiColorBackground for the same effect.
export function getMultiColorBackground(colorCodes: string | null | undefined): string {
  const codes = parseColorCodes(colorCodes);

  if (codes.length === 0) return "#e5e5e5";
  if (codes.length === 1) return codes[0];

  const stops = codes.map((code, i) => {
    const from = (i / codes.length) * 100;
    const to = ((i + 1) / codes.length) * 100;
    return `${code} ${from}%, ${code} ${to}%`;
  });
  return `linear-gradient(to right, ${stops.join(", ")})`;
}
