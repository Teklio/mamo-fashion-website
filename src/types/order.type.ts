export type OrderStatus =
  | "ORDER_PENDING"
  | "ORDER_PLACED"
  | "ORDER_SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "ORDER_DELIVERED"
  | "ORDER_FAILED"
  | "ORDER_RETURNED";

export type PaymentStatus =
  | "PAYMENT_PENDING"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "PAYMENT_REFUNDED"
  | "REFUND_FAILED";

export interface OrderItem {
  id: string;
  productVariantSizeId: string | null;
  quantity: number;
  unitPrice: string;
  lineTotal: string;
  product: { id: string; name: string } | null;
  color: { id: string; name: string; colorCodes: string | null } | null;
  size: { id: string; name: string } | null;
  primaryImageUrl: string | null;
}

export interface OrderAddress {
  id: string;
  name: string;
  phone: string;
  line1: string | null;
  city: string;
  district: string;
  pinCode: string;
  landMark: string | null;
  isDefault: boolean;
}

export interface OrderPayment {
  status: PaymentStatus;
  amount: string;
  paymentMode: string | null;
  /** Only present on the detail endpoint (GET /orders/:id), not the list. */
  updatedAt?: string;
}

export interface CustomerOrder {
  id: string;
  status: OrderStatus;
  subTotal: string;
  discount: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  payment: OrderPayment | null;
}

export interface CustomerOrderDetail extends CustomerOrder {
  shippingAddress: OrderAddress | null;
  billingAddress: OrderAddress | null;
}

export interface GetCustomerOrdersResponse {
  orders: CustomerOrder[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface GetCustomerOrderResponse {
  order: CustomerOrderDetail;
}
