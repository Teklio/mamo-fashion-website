import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "@/lib/axios";
import {
  setCartCount,
  incrementCartCount,
  decrementCartCount,
} from "@/store/slices/authSlice";
import type { AppDispatch, RootState } from "@/store";
import type { CartApiResponse, CartItem } from "@/types/cart.type";

// ─── API functions ────────────────────────────────────────────────────────────

const getCartApi = async (): Promise<CartApiResponse> => {
  const { data } = await axiosInstance.get<CartApiResponse>("/cart");
  return data;
};

const addToCartApi = async (payload: {
  productVariantSizeId: string;
  quantity: number;
}) => {
  const { data } = await axiosInstance.post("/cart/items", payload);
  return data;
};

const updateCartItemApi = async ({
  id,
  quantity,
}: {
  id: string;
  quantity: number;
}) => {
  const { data } = await axiosInstance.patch(`/cart/items/${id}`, { quantity });
  return data;
};

const removeCartItemApi = async (id: string) => {
  const { data } = await axiosInstance.delete(`/cart/items/${id}`);
  return data;
};

const clearCartApi = async () => {
  const { data } = await axiosInstance.delete("/cart");
  return data;
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export const useGetCart = () => {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAddToCart = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: addToCartApi,
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
    mutationFn: updateCartItemApi,
    onMutate: ({ id, quantity }) => {
      const cartData = qc.getQueryData<CartApiResponse>(["cart"]);
      const existing = cartData?.cart?.items?.find((i: CartItem) => i.id === id);
      const oldQty = existing?.quantity ?? quantity;
      return { diff: quantity - oldQty };
    },
    onSuccess: (_data, _vars, context) => {
      if (context?.diff !== 0) {
        dispatch(incrementCartCount(context.diff)); // works for negative diffs too
      }
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useRemoveCartItem = () => {
  const qc = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: removeCartItemApi,
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
    mutationFn: clearCartApi,
    onSuccess: () => {
      dispatch(setCartCount(0));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
