// ─────────────────────────────────────────────────────────────────────────────
// src/services/order.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type {
  GetCustomerOrdersResponse,
  GetCustomerOrderResponse,
} from "@/types/order.type";
import { mockOrdersResponse } from "@/lib/mockData";

export const useGetCustomerOrders = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-orders"],
    queryFn: async (): Promise<GetCustomerOrdersResponse> => {
      await new Promise((r) => setTimeout(r, 200));
      return mockOrdersResponse;
    },
    enabled: isAuthenticated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerOrder = (id: string | null) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-order", id],
    queryFn: async (): Promise<GetCustomerOrderResponse> => {
      await new Promise((r) => setTimeout(r, 200));
      return {
        order: {
          id: id ?? "order-mock-1",
          status: "CONFIRMED",
          subTotal: "95.00",
          discount: "0.00",
          total: "95.00",
          currencyCode: "INR",
          createdAt: new Date().toISOString(),
          items: [],
          payment: { status: "SUCCESS", amount: "95.00", paymentType: "UPI" },
          shippingAddress: null,
        },
      };
    },
    enabled: isAuthenticated && !!id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
