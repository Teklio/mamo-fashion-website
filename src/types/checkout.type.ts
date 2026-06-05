export interface ApplyCouponResponse {
  couponCode: string;
  discountPercentage: string;
  subTotal: string;
  discount: string;
  total: string;
}

export interface CheckoutAuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phone: string | null;
    isActive: boolean;
  };
}

export interface CreateOrderResponse {
  orderId: string;
  paymentStatus: "PENDING";
  paymentUrl: string;
}

export interface VerifyPaymentResponse {
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
}

export interface InlineAddress {
  name: string;
  phone: string;
  line1: string;
  city: string;
  countryCode: string;
  district?: string;
  postalCode?: string;
  landMark?: string;
}

export interface CreateOrderPayload {
  mode: "cart" | "buynow";
  shippingAddress: string | InlineAddress;
  billingAddress?: string | InlineAddress;
  couponCode?: string;
  productVariantSizeId?: string;
  quantity?: number;
}

export interface BuyNowPayload {
  productVariantSizeId: string;
  quantity: number;
  shippingAddress: string | InlineAddress;
  billingAddress?: string | InlineAddress;
  couponCode?: string;
}
