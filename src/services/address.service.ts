// ─────────────────────────────────────────────────────────────────────────────
// src/services/address.service.ts  — real API calls to mamo-fashion-server
// Server address fields: name, phone, line1?, city, district, pinCode, landMark?,
// isDefault. There is no countryCode. GET returns a raw Address[] array.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { RootState } from "@/store";

export interface CustomerAddress {
  id: string;
  customerId: string;
  name: string;
  phone: string;
  line1: string | null;
  city: string;
  district: string;
  pinCode: string;
  landMark: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  name: string;
  phone: string;
  line1?: string;
  city: string;
  district: string;
  pinCode: string;
  landMark?: string;
  isDefault?: boolean;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCustomerAddresses = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: async (): Promise<{ addresses: CustomerAddress[] }> => {
      const res = await api.get<CustomerAddress[]>(endpoints.address.base);
      return { addresses: res.data };
    },
    enabled: isAuthenticated,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useAddCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddressPayload) => {
      const res = await api.post<{ message: string; address: CustomerAddress }>(
        endpoints.address.base,
        payload,
      );
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};

export const useUpdateCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) => {
      const res = await api.patch<{ message: string; address: CustomerAddress }>(
        endpoints.address.item(id),
        payload,
      );
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};

export const useDeleteCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{ message: string }>(endpoints.address.item(id));
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};
