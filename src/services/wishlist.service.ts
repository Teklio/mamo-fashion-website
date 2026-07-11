// ─────────────────────────────────────────────────────────────────────────────
// src/services/wishlist.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { incrementWishlistCount, decrementWishlistCount } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { WishlistApiResponse, WishlistItem } from "@/types/wishlist.type";
import { mockWishlistResponse } from "@/lib/mockData";
import { mockProducts } from "@/lib/mockProducts";

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
    mutationFn: async (payload: { variantId: string }) => {
      await new Promise((r) => setTimeout(r, 300));
      
      const variant = mockProducts.find(v => v.id === payload.variantId);
      if (variant && !mockWishlistResponse.wishlist.some(w => w.variantId === variant.id)) {
        const newItem: WishlistItem = {
          id: `wish-${Date.now()}`,
          customerId: "user-mock-1",
          variantId: variant.id,
          createdAt: new Date().toISOString(),
          variant: {
            id: variant.id,
            productId: variant.productId,
            colorName: variant.colorName || "",
            colorCode: variant.colorCode || "",
            primaryImage: variant.primaryImageUrl ? {
              id: "img-1",
              imageKey: "key-1",
              publicUrl: variant.primaryImageUrl,
            } : null,
            secondaryImage: variant.secondaryImageUrl ? {
              id: "img-2",
              imageKey: "key-2",
              publicUrl: variant.secondaryImageUrl,
            } : null,
            sizes: variant.sizes,
            product: {
              id: variant.productId,
              title: variant.title,
              price: variant.price,
              status: "ACTIVE"
            }
          }
        };
        mockWishlistResponse.wishlist.push(newItem);
      }
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
    mutationFn: async (variantId: string) => {
      await new Promise((r) => setTimeout(r, 200));
      mockWishlistResponse.wishlist = mockWishlistResponse.wishlist.filter(w => w.variantId !== variantId);
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
