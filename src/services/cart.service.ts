// ─────────────────────────────────────────────────────────────────────────────
// src/services/cart.service.ts  — real API calls to mamo-fashion-server
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import {
  setCartCount,
  incrementCartCount,
  decrementCartCount,
} from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { CartApiResponse, CartItem } from "@/types/cart.type";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCart = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  return useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<CartApiResponse> => {
      const res = await api.get<CartApiResponse>(endpoints.cart.base);
      // Keep the header badge in sync with the server's authoritative count.
      dispatch(setCartCount(res.data.itemCount));
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (payload: { productVariantSizeId: string; quantity: number }) => {
      const res = await api.post<{ message: string; item: CartItem }>(
        endpoints.cart.items,
        payload,
      );
      return res.data;
    },
    onSuccess: (_data, variables) => {
      dispatch(incrementCartCount(variables.quantity));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateCartItem = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await api.patch<{ message: string; item?: CartItem }>(
        endpoints.cart.item(id),
        { quantity },
      );
      return res.data;
    },
    onMutate: ({ id, quantity }) => {
      const cartData = qc.getQueryData<CartApiResponse>(["cart"]);
      const existing = cartData?.items?.find((i: CartItem) => i.id === id);
      const oldQty = existing?.quantity ?? quantity;
      return { diff: quantity - oldQty };
    },
    onSuccess: (_data, _vars, context) => {
      if (context?.diff && context.diff !== 0) {
        dispatch(incrementCartCount(context.diff));
      }
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveCartItem = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<{ message: string }>(endpoints.cart.item(id));
      return res.data;
    },
    onMutate: (id) => {
      const cartData = qc.getQueryData<CartApiResponse>(["cart"]);
      const item = cartData?.items?.find((i: CartItem) => i.id === id);
      return { quantity: item?.quantity ?? 1 };
    },
    onSuccess: (_data, _vars, context) => {
      dispatch(decrementCartCount(context?.quantity ?? 1));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async () => {
      const res = await api.delete<{ message: string }>(endpoints.cart.base);
      return res.data;
    },
    onSuccess: () => {
      dispatch(setCartCount(0));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
