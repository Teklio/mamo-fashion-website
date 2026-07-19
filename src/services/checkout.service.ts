// ─────────────────────────────────────────────────────────────────────────────
// src/services/checkout.service.ts  — real API calls to mamo-fashion-server
// Order creation is a single endpoint (POST /orders) handling both cart and
// buy-now via `mode` — there is no separate buy-now endpoint. Checkout-time
// sign-in uses the real /customer/auth/login flow (see auth.service.ts's
// useLogin) rather than a separate mocked auth path.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/types/checkout.type";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
      const res = await api.post<CreateOrderResponse>(endpoints.orders.list, payload);
      return res.data;
    },
  });
};

export const useVerifyPayment = () => {
  return useMutation({
    mutationFn: async (payload: VerifyPaymentPayload): Promise<VerifyPaymentResponse> => {
      const res = await api.post<VerifyPaymentResponse>(endpoints.payments.verify, payload);
      return res.data;
    },
  });
};
