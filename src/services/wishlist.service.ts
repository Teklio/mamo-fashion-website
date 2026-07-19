// ─────────────────────────────────────────────────────────────────────────────
// src/services/wishlist.service.ts  — real API calls to mamo-fashion-server
// The server wishlist is PRODUCT-based (keyed on productId), not variant-based.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import { incrementWishlistCount, decrementWishlistCount, setWishlistCount } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { WishlistApiResponse, WishlistItem } from "@/types/wishlist.type";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetWishlist = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const dispatch = useDispatch<AppDispatch>();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<WishlistApiResponse> => {
      const res = await api.get<WishlistApiResponse>(endpoints.wishlist.base);
      dispatch(setWishlistCount(res.data.wishlist.length));
      return res.data;
    },
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
};

export const useAddToWishlist = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (payload: { productId: string }) => {
      const res = await api.post<{ message: string }>(
        endpoints.wishlist.base,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      dispatch(incrementWishlistCount());
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (productId: string) => {
      const res = await api.delete<{ message: string }>(
        endpoints.wishlist.item(productId),
      );
      return res.data;
    },
    onSuccess: () => {
      dispatch(decrementWishlistCount());
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

/** Returns a Set of productIds in the user's wishlist (empty when not authenticated). */
export const useWishlistedIds = (): Set<string> => {
  const { data } = useGetWishlist();
  return new Set((data?.wishlist ?? []).map((w: WishlistItem) => w.productId));
};
