// Product-based wishlist from GET /v1/customer/wishlist/ (wishlist.controller.ts)

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  /** Prisma Decimal serialised as string */
  commonPrice: string;
  actualPrice: string;
  isActive: boolean;
  primaryImageUrl: string | null;
}

export interface WishlistApiResponse {
  wishlist: WishlistItem[];
}
