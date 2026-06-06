import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { axiosInstance } from "@/lib/axios";
import type { RootState } from "@/store";

export interface CustomerAddress {
  id: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  district: string | null;
  countryCode: string;
  postalCode: string | null;
  landMark: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  name: string;
  phone: string;
  line1: string;
  city: string;
  district?: string | null;
  countryCode: string;
  postalCode?: string | null;
  landMark?: string | null;
  isDefault?: boolean;
}

// ─── API ──────────────────────────────────────────────────────────────────────

const getAddressesApi = async (): Promise<{ addresses: CustomerAddress[] }> => {
  const { data } = await axiosInstance.get("/addresses/customer");
  return data;
};

const addAddressApi = async (payload: AddressPayload): Promise<{ message: string; address: CustomerAddress }> => {
  const { data } = await axiosInstance.post("/addresses/customer", payload);
  return data;
};

const updateAddressApi = async ({ id, payload }: { id: string; payload: Partial<AddressPayload> }): Promise<{ message: string; address: CustomerAddress }> => {
  const { data } = await axiosInstance.patch(`/addresses/customer/${id}`, payload);
  return data;
};

const deleteAddressApi = async (id: string): Promise<{ message: string }> => {
  const { data } = await axiosInstance.delete(`/addresses/customer/${id}`);
  return data;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCustomerAddresses = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: getAddressesApi,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAddCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: addAddressApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};

export const useUpdateCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateAddressApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};

export const useDeleteCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};
