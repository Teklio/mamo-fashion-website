// ─────────────────────────────────────────────────────────────────────────────
// src/services/product.service.ts  — real API calls to mamo-fashion-server
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type {
  GetCustomerProductsResponse,
  GetCustomerProductResponse,
} from "@/types/product.type";

export interface GetProductsFilters {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  isAscending?: boolean;
  search?: string;
  subCategoryId?: string;
  materialId?: string;
}

export const useGetProducts = (filters: GetProductsFilters = {}) => {
  return useQuery({
    queryKey: ["customer-products", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {};
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.isAscending !== undefined)
        params.isAscending = filters.isAscending ? "true" : "false";
      if (filters.search) params.search = filters.search;
      if (filters.subCategoryId) params.subCategoryId = filters.subCategoryId;
      if (filters.materialId) params.materialId = filters.materialId;

      const res = await api.get<GetCustomerProductsResponse>(
        endpoints.products.list,
        { params },
      );
      return res.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["customer-product", id],
    queryFn: async () => {
      const res = await api.get<GetCustomerProductResponse>(
        endpoints.products.detail(id),
      );
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export function formatPrice(price: string | number): string {
  return `₹${Number(price).toFixed(2)}`;
}
