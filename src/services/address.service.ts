// ─────────────────────────────────────────────────────────────────────────────
// src/services/address.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
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

// In-memory address store (persists during session)
let _addresses: CustomerAddress[] = [];

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCustomerAddresses = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["customer-addresses"],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      return { addresses: _addresses };
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
      await new Promise((r) => setTimeout(r, 300));
      const newAddress: CustomerAddress = {
        ...payload,
        id: `addr-${Date.now()}`,
        district: payload.district ?? null,
        postalCode: payload.postalCode ?? null,
        landMark: payload.landMark ?? null,
        isDefault: payload.isDefault ?? _addresses.length === 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (newAddress.isDefault) {
        _addresses = _addresses.map((a) => ({ ...a, isDefault: false }));
      }
      _addresses = [..._addresses, newAddress];
      return { message: "Address added", address: newAddress };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};

export const useUpdateCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<AddressPayload> }) => {
      await new Promise((r) => setTimeout(r, 300));
      _addresses = _addresses.map((a) =>
        a.id === id ? { ...a, ...payload, updatedAt: new Date().toISOString() } : a
      );
      const updated = _addresses.find((a) => a.id === id)!;
      return { message: "Address updated", address: updated };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};

export const useDeleteCustomerAddress = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200));
      _addresses = _addresses.filter((a) => a.id !== id);
      return { message: "Address deleted" };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["customer-addresses"] }),
  });
};
