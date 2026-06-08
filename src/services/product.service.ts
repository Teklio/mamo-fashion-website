import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
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
  showOnHomePage?: boolean; // filters by variant's showOnHomePage flag
}

const getCustomerProductsApi = async (
  filters: GetProductsFilters,
): Promise<GetCustomerProductsResponse> => {
  const params: Record<string, string | number> = {};
  if (filters.page !== undefined) params.page = filters.page;
  if (filters.limit !== undefined) params.limit = filters.limit;
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
  if (filters.isAscending !== undefined)
    params.isAscending = String(filters.isAscending);
  if (filters.showOnHomePage !== undefined)
    params.showOnHomePage = String(filters.showOnHomePage);
  const { data } = await axiosInstance.get("/products/customer", { params });
  return data;
};

export const useGetProducts = (filters: GetProductsFilters = {}) => {
  return useQuery({
    queryKey: ["customer-products", filters],
    queryFn: () => getCustomerProductsApi(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

const getCustomerProductApi = async (
  id: string,
): Promise<GetCustomerProductResponse> => {
  const { data } = await axiosInstance.get(`/products/customer/${id}`);
  return data;
};

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["customer-product", id],
    queryFn: () => getCustomerProductApi(id),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export function formatPrice(price: string): string {
  return `AED ${Number(price).toFixed(2)}`;
}
