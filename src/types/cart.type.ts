// Flat cart shape from GET /v1/customer/cart/ (see cart.controller.ts mapCartItem)

export interface CartItem {
  id: string;
  productVariantSizeId: string;
  quantity: number;
  /** Prisma Decimal serialised as string, e.g. "289.00" */
  price: string;
  /** price × quantity, Prisma Decimal serialised as string */
  lineTotal: string;
  stock: number;
  variantId: string;
  product: { id: string; name: string };
  color: { id: string; name: string; colorCodes: string };
  size: { id: string; name: string };
  primaryImageUrl: string | null;
}

export interface CartApiResponse {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}
