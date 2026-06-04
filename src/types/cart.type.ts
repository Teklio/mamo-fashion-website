export interface CartVariantImage {
  id: string;
  imageKey: string;
  publicUrl: string;
}

export interface CartVariant {
  id: string;
  productId: string;
  colorName: string;
  colorCode: string;
  variantCode: string;
  primaryPhotoId: string | null;
  secondaryPhotoId: string | null;
  isDeleted: boolean;
  product: {
    id: string;
    title: string;
    price: string;
  };
  primaryImage: CartVariantImage | null;
}

export interface CartItemSize {
  id: string;
  variantId: string;
  size: string;
  stock: number;
  sku: string;
  variant: CartVariant | null;
}

export interface CartItem {
  id: string;
  cartId: string;
  productVariantSizeId: string | null;
  productId: string | null;
  quantity: number;
  /** Prisma Decimal serialised as string, e.g. "289.00" */
  price: string;
  createdAt: string;
  updatedAt: string;
  size: CartItemSize | null;
}

export interface CartApiResponse {
  cart: {
    id: string;
    customerId: string;
    items: CartItem[];
  };
}
