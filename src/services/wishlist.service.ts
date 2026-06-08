import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "@/lib/axios";
import { incrementWishlistCount, decrementWishlistCount } from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { WishlistApiResponse, WishlistItem } from "@/types/wishlist.type";

// ─── API functions ────────────────────────────────────────────────────────────

const getWishlistApi = async (): Promise<WishlistApiResponse> => {
  const { data } = await axiosInstance.get<WishlistApiResponse>("/wishlist");
  return data;
};

const addToWishlistApi = async (payload: { variantId: string }) => {
  const { data } = await axiosInstance.post("/wishlist", payload);
  return data;
};

const removeFromWishlistApi = async (variantId: string) => {
  const { data } = await axiosInstance.delete(`/wishlist/${variantId}`);
  return data;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetWishlist = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAddToWishlist = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: addToWishlistApi,
    onSuccess: () => {
      // Use action that always operates on current state — no stale closure
      dispatch(incrementWishlistCount());
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: removeFromWishlistApi,
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
