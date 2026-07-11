export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELED";

export interface OrderItemProduct {
  id: string;
  title: string;
}

export interface OrderItemVariant {
  id: string;
  colorName: string;
  colorCode: string;
  primaryImage: { imageUrl: string } | null;
}

export interface OrderItemSize {
  size: string;
  sku: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: string;
  product: OrderItemProduct | null;
  productVariant: OrderItemVariant | null;
  size: OrderItemSize | null;
}

export interface OrderPayment {
  status: PaymentStatus;
  amount: string;
  paymentType: string | null;
}

export interface OrderShippingAddress {
  name: string;
  phone: string;
  line1: string;
  city: string;
  district: string | null;
  countryCode: string;
  postalCode: string | null;
  landMark: string | null;
}

export interface CustomerOrder {
  id: string;
  status: OrderStatus;
  subTotal: string;
  discount: string;
  total: string;
  currencyCode: string;
  createdAt: string;
  items: OrderItem[];
  payment: OrderPayment | null;
}

export interface CustomerOrderDetail extends CustomerOrder {
  shippingAddress: OrderShippingAddress | null;
}

export interface GetCustomerOrdersResponse {
  orders: CustomerOrder[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface GetCustomerOrderResponse {
  order: CustomerOrderDetail;
}
