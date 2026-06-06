export interface WishlistVariantImage {
  id: string;
  imageKey: string;
  publicUrl: string;
}

export interface WishlistProductVariant {
  id: string;
  colorName: string;
  colorCode: string;
  primaryImage: WishlistVariantImage | null;
  secondaryImage: WishlistVariantImage | null;
}

export interface WishlistProduct {
  id: string;
  title: string;
  /** Prisma Decimal serialised as string, e.g. "289.00" */
  price: string;
  status: "ACTIVE" | "INACTIVE";
  variants: WishlistProductVariant[];
}

export interface WishlistItem {
  id: string;
  customerId: string;
  productId: string;
  createdAt: string;
  product: WishlistProduct;
}

export interface WishlistApiResponse {
  wishlist: WishlistItem[];
}
