export interface WishlistVariantImage {
  id: string;
  imageKey: string;
  publicUrl: string;
}

export interface WishlistVariantSize {
  id: string;
  size: string;
  stock: number;
}

export interface WishlistVariantProduct {
  id: string;
  title: string;
  /** Prisma Decimal serialised as string, e.g. "289.00" */
  price: string;
  status: "ACTIVE" | "INACTIVE";
}

export interface WishlistVariant {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  primaryImage: WishlistVariantImage | null;
  secondaryImage: WishlistVariantImage | null;
  sizes: WishlistVariantSize[];
  product: WishlistVariantProduct;
}

export interface WishlistItem {
  id: string;
  customerId: string;
  variantId: string;
  createdAt: string;
  variant: WishlistVariant;
}

export interface WishlistApiResponse {
  wishlist: WishlistItem[];
}
