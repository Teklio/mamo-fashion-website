// ─────────────────────────────────────────────────────────────────────────────
// src/services/wishlist.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { incrementWishlistCount, decrementWishlistCount } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { WishlistApiResponse, WishlistItem } from "@/types/wishlist.type";
import { mockWishlistResponse } from "@/lib/mockData";

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetWishlist = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async (): Promise<WishlistApiResponse> => {
      await new Promise((r) => setTimeout(r, 100));
      return mockWishlistResponse;
    },
    enabled: isAuthenticated,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

export const useAddToWishlist = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (_payload: { variantId: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      return { message: "Added to wishlist" };
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
    mutationFn: async (_variantId: string) => {
      await new Promise((r) => setTimeout(r, 200));
      return { message: "Removed from wishlist" };
    },
    onSuccess: () => {
      dispatch(decrementWishlistCount());
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

/** Returns a Set of variant IDs in the user's wishlist (empty Set when not authenticated). */
export const useWishlistedIds = (): Set<string> => {
  const { data } = useGetWishlist();
  return new Set((data?.wishlist ?? []).map((w: WishlistItem) => w.variantId));
};
