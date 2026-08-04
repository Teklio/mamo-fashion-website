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

// Matches mamo-fashion-server's single POST /orders endpoint (order.controller.ts
// createOrder) — one endpoint handles both cart and buy-now via `mode`. There is
// no inline-address-creation support server-side: shippingAddressId/billingAddressId
// must be existing saved address ids (persist an inline address via
// address.service.ts's useAddCustomerAddress first, then use its id here).
export interface CreateOrderPayload {
  mode: "cart" | "buyNow";
  productVariantSizeId?: string;
  quantity?: number;
  shippingAddressId: string;
  billingAddressId?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number; // paise
  currency: string;
  keyId: string;
  paymentStatus: "PENDING";
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Real backend only ever returns these three — never "CANCELLED" (that's a
// client-side-only concept: the Razorpay modal being dismissed before any
// payment attempt completes).
export interface VerifyPaymentResponse {
  status: "PENDING" | "PAID" | "FAILED";
}
