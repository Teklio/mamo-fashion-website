"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface WishlistItem {
  id: string;
  name: string;
  priceText: string;
  priceVal: number;
  image: string;
  color?: string;
  quantity?: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (product: WishlistItem) => void;
  updateWishlistQuantity: (id: string, quantity: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("sorin-wishlist");
    if (savedWishlist) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (e) {
        console.error("Error parsing wishlist data", e);
      }
    }
  }, []);

  const saveWishlist = (items: WishlistItem[]) => {
    setWishlistItems(items);
    localStorage.setItem("sorin-wishlist", JSON.stringify(items));
  };

  const addToWishlist = (product: WishlistItem) => {
    if (!isInWishlist(product.id)) {
      saveWishlist([...wishlistItems, product]);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const removeFromWishlist = (id: string) => {
    const newItems = wishlistItems.filter((item) => item.id !== id);
    saveWishlist(newItems);
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const toggleWishlist = (product: WishlistItem) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist({ ...product, quantity: product.quantity || 1 });
    }
  };

  const updateWishlistQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    const newItems = wishlistItems.map((item) => 
      item.id === id ? { ...item, quantity } : item
    );
    saveWishlist(newItems);
  };

  const clearWishlist = () => {
    saveWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        updateWishlistQuantity,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
