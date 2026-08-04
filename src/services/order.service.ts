// ─────────────────────────────────────────────────────────────────────────────
// src/services/order.service.ts  — real API calls to mamo-fashion-server
// GET /orders (list) and GET /orders/:id (detail), both authenticateCustomer.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { RootState } from "@/store";
import type {
  GetCustomerOrdersResponse,
  GetCustomerOrderResponse,
  OrderStatus,
} from "@/types/order.type";

export interface GetCustomerOrdersFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
}

export const useGetCustomerOrders = (filters: GetCustomerOrdersFilters = {}) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-orders", filters],
    queryFn: async (): Promise<GetCustomerOrdersResponse> => {
      const params: Record<string, string | number> = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const res = await api.get<GetCustomerOrdersResponse>(endpoints.orders.list, { params });
      return res.data;
    },
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerOrder = (id: string | null) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-order", id],
    queryFn: async (): Promise<GetCustomerOrderResponse> => {
      const res = await api.get<GetCustomerOrderResponse>(endpoints.orders.detail(id!));
      return res.data;
    },
    enabled: isAuthenticated && !!id,
    refetchOnWindowFocus: false,
  });
};
