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
  sortBy?: "newest" | "price_asc" | "price_desc" | "bestseller";
  search?: string;
  subCategoryId?: string[];
  materialId?: string[];
  colorId?: string[];
  sizeId?: string[];
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
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.search) params.search = filters.search;
      if (filters.subCategoryId?.length)
        params.subCategoryId = filters.subCategoryId.join(",");
      if (filters.materialId?.length)
        params.materialId = filters.materialId.join(",");
      if (filters.colorId?.length) params.colorId = filters.colorId.join(",");
      if (filters.sizeId?.length) params.sizeId = filters.sizeId.join(",");

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
