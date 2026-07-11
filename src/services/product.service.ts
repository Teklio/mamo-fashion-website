// ─────────────────────────────────────────────────────────────────────────────
// src/services/product.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import { mockProductsResponse, mockProductDetailResponse } from "@/lib/mockData";

export interface GetProductsFilters {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  isAscending?: boolean;
  showOnHomePage?: boolean;
}

export const useGetProducts = (_filters: GetProductsFilters = {}) => {
  return useQuery({
    queryKey: ["customer-products", _filters],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockProductsResponse;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const useGetProduct = (_id: string) => {
  return useQuery({
    queryKey: ["customer-product", _id],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockProductDetailResponse;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    enabled: !!_id,
  });
};

export function formatPrice(price: string): string {
  return `₹${Number(price).toFixed(2)}`;
}
