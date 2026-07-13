// ─────────────────────────────────────────────────────────────────────────────
// src/services/checkout.service.ts  — MOCK (no backend yet)
// TODO(backend): mamo-fashion-server has NO live order/checkout/payment routes
//   (routes/order.routes.ts & routes/payment.routes.ts are commented out and the
//   controllers do not exist). These hooks stay mocked until those are built.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store";
import type {
  ApplyCouponResponse,
  BuyNowPayload,
  CheckoutAuthResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentResponse,
} from "@/types/checkout.type";
import type { CheckoutAuthFormType } from "@/zodschemas/checkout.schema";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useCheckoutAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (data: CheckoutAuthFormType): Promise<CheckoutAuthResponse> => {
      await new Promise((r) => setTimeout(r, 500));
      return {
        success: true,
        message: "Authenticated for checkout",
        accessToken: "mock-access-token",
        refreshToken: "mock-refresh-token",
        user: {
          id: "user-mock-1",
          email: data.email,
          phone: null,
          isActive: true,
        },
      };
    },
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          message: data.message,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          cartItemsCount: 0,
          wishlistCount: 0,
          user: {
            id: data.user.id,
            name: "",
            email: data.user.email,
            phone: data.user.phone,
            isActive: data.user.isActive,
          },
        })
      );
    },
  });
};

export const useApplyCoupon = () => {
  return useMutation({
    mutationFn: async (_payload: {
      couponCode: string;
      mode: "cart" | "buynow";
      productVariantSizeId?: string;
      quantity?: number;
    }): Promise<ApplyCouponResponse> => {
      await new Promise((r) => setTimeout(r, 400));
      // Mock: 10% discount for any coupon
      return {
        couponCode: _payload.couponCode,
        discountPercentage: "10",
        subTotal: "100.00",
        discount: "10.00",
        total: "90.00",
      };
    },
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (_payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
      await new Promise((r) => setTimeout(r, 600));
      return {
        orderId: `order-${Date.now()}`,
        paymentStatus: "PENDING",
        paymentUrl: "/",
      };
    },
  });
};

export const useBuyNow = () => {
  return useMutation({
    mutationFn: async (_payload: BuyNowPayload): Promise<CreateOrderResponse> => {
      await new Promise((r) => setTimeout(r, 600));
      return {
        orderId: `order-${Date.now()}`,
        paymentStatus: "PENDING",
        paymentUrl: "/",
      };
    },
  });
};

export const verifyPaymentStatus = async (_orderId: string): Promise<VerifyPaymentResponse> => {
  await new Promise((r) => setTimeout(r, 300));
  return { status: "PAID" };
};
