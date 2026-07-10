// ─────────────────────────────────────────────────────────────────────────────
// src/services/cart.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import {
  setCartCount,
  incrementCartCount,
  decrementCartCount,
} from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { CartApiResponse, CartItem } from "@/types/cart.type";
import { mockCartResponse } from "@/lib/mockData";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCart = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["cart"],
    queryFn: async (): Promise<CartApiResponse> => {
      await new Promise((r) => setTimeout(r, 100));
      return mockCartResponse;
    },
    enabled: isAuthenticated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (payload: { productVariantSizeId: string; quantity: number }) => {
      await new Promise((r) => setTimeout(r, 300));
      return { message: "Added to cart" };
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
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Cart updated" };
    },
    onMutate: ({ id, quantity }) => {
      const cartData = qc.getQueryData<CartApiResponse>(["cart"]);
      const existing = cartData?.cart?.items?.find((i: CartItem) => i.id === id);
      const oldQty = existing?.quantity ?? quantity;
      return { diff: quantity - oldQty };
    },
    onSuccess: (_data, _vars, context) => {
      if (context?.diff !== 0) {
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
    mutationFn: async (_id: string) => {
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Item removed" };
    },
    onMutate: (id) => {
      const cartData = qc.getQueryData<CartApiResponse>(["cart"]);
      const item = cartData?.cart?.items?.find((i: CartItem) => i.id === id);
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
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Cart cleared" };
    },
    onSuccess: () => {
      dispatch(setCartCount(0));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
