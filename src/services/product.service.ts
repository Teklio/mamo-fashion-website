// ─────────────────────────────────────────────────────────────────────────────
// src/services/product.service.ts  — real API calls to mamo-fashion-server
// ─────────────────────────────────────────────────────────────────────────────

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type {
  GetCustomerProductsResponse,
  GetCustomerProductResponse,
  GetCustomerProductVariantResponse,
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

export const useGetProduct = (id: string, variantId?: string) => {
  return useQuery({
    queryKey: ["customer-product", id, variantId],
    queryFn: async () => {
      const res = await api.get<GetCustomerProductResponse>(
        endpoints.products.detail(id),
        { params: variantId ? { variantId } : undefined },
      );
      return res.data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

// Fetches one variant's full detail (images + sizes) on demand — used when
// the user clicks a color swatch that wasn't already loaded by useGetProduct.
export const useGetProductVariant = (
  productId: string,
  variantId: string | undefined,
) => {
  return useQuery({
    queryKey: ["customer-product-variant", productId, variantId],
    queryFn: async () => {
      const res = await api.get<GetCustomerProductVariantResponse>(
        endpoints.products.variant(productId, variantId!),
      );
      return res.data;
    },
    enabled: !!productId && !!variantId,
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
};

export function formatPrice(price: string | number): string {
  return `₹${Number(price).toFixed(2)}`;
}
