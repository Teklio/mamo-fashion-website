import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { axiosInstance } from "@/lib/axios";
import type { RootState } from "@/store";
import type {
  GetCustomerOrdersResponse,
  GetCustomerOrderResponse,
} from "@/types/order.type";

const getCustomerOrdersApi = async (): Promise<GetCustomerOrdersResponse> => {
  const { data } = await axiosInstance.get<GetCustomerOrdersResponse>("/orders");
  return data;
};

export const useGetCustomerOrders = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-orders"],
    queryFn: getCustomerOrdersApi,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

const getCustomerOrderApi = async (id: string): Promise<GetCustomerOrderResponse> => {
  const { data } = await axiosInstance.get<GetCustomerOrderResponse>(`/orders/${id}`);
  return data;
};

export const useGetCustomerOrder = (id: string | null) => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-order", id],
    queryFn: () => getCustomerOrderApi(id!),
    enabled: isAuthenticated && !!id,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
