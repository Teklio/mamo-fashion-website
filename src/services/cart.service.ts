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
import { mockProducts } from "@/lib/mockProducts";

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
      
      const existingItem = mockCartResponse.cart.items.find(i => i.productVariantSizeId === payload.productVariantSizeId);
      if (existingItem) {
        existingItem.quantity += payload.quantity;
      } else {
        const variant = mockProducts.find(v => v.sizes.some(s => s.id === payload.productVariantSizeId));
        if (variant) {
          const sizeObj = variant.sizes.find(s => s.id === payload.productVariantSizeId);
          if (sizeObj) {
            const newItem: CartItem = {
              id: `cart-item-${Date.now()}`,
              cartId: mockCartResponse.cart.id,
              productVariantSizeId: sizeObj.id,
              productId: variant.productId,
              quantity: payload.quantity,
              price: variant.price,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              size: {
                id: sizeObj.id,
                variantId: variant.id,
                size: sizeObj.size,
                stock: sizeObj.stock,
                sku: `sku-${sizeObj.id}`,
                variant: {
                  id: variant.id,
                  productId: variant.productId,
                  colorName: variant.colorName || "",
                  colorCode: variant.colorCode || "",
                  variantCode: variant.id,
                  primaryPhotoId: "photo-1",
                  secondaryPhotoId: null,
                  isDeleted: false,
                  product: {
                    id: variant.productId,
                    title: variant.title,
                    price: variant.price,
                  },
                  primaryImage: variant.primaryImageUrl ? {
                    id: "img-1",
                    imageKey: "key-1",
                    publicUrl: variant.primaryImageUrl,
                  } : null,
                }
              }
            };
            mockCartResponse.cart.items.push(newItem);
          }
        }
      }
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
      const item = mockCartResponse.cart.items.find(i => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
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
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 200));
      mockCartResponse.cart.items = mockCartResponse.cart.items.filter(i => i.id !== id);
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
      mockCartResponse.cart.items = [];
      return { message: "Cart cleared" };
    },
    onSuccess: () => {
      dispatch(setCartCount(0));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
