// ─────────────────────────────────────────────────────────────────────────────
// src/services/product.service.ts  — real API calls to mamo-fashion-server
// ─────────────────────────────────────────────────────────────────────────────

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

function buildProductParams(
  filters: GetProductsFilters,
): Record<string, string | number> {
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
  return params;
}

export const useGetProducts = (filters: GetProductsFilters = {}) => {
  return useQuery({
    queryKey: ["customer-products", filters],
    queryFn: async () => {
      const res = await api.get<GetCustomerProductsResponse>(
        endpoints.products.list,
        { params: buildProductParams(filters) },
      );
      return res.data;
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};

export const useGetProductsInfinite = (
  filters: Omit<GetProductsFilters, "page"> = {},
) => {
  return useInfiniteQuery({
    queryKey: ["customer-products-infinite", filters],
    queryFn: async ({ pageParam }) => {
      const res = await api.get<GetCustomerProductsResponse>(
        endpoints.products.list,
        { params: buildProductParams({ ...filters, page: pageParam }) },
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
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
