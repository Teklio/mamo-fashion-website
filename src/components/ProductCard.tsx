"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiX, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { toast } from "sonner";
import { formatPrice } from "@/services/product.service";
import { useAddToCart } from "@/services/cart.service";
import { useWishlistedIds, useAddToWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import { getMultiColorBackground, type CustomerProduct } from "@/types/product.type";
import type { RootState } from "@/store";
import type { AxiosError } from "axios";

interface ProductCardProps {
  product: CustomerProduct;
  cardVariants?: Variants;
}

export default function ProductCard({ product, cardVariants }: ProductCardProps) {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();
  const wishlistedIds = useWishlistedIds();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  const [showSizes, setShowSizes] = useState(false);

  // Card shows one representative variant (the first active one returned by
  // the API); the full color/size selector lives on the product detail page.
  const defaultVariant = product.variants[0] as
    | (typeof product.variants)[number]
    | undefined;

  const mainImage = defaultVariant?.primaryImageUrl ?? "";
  const availableSizes = (defaultVariant?.sizes ?? []).filter((s) => s.stock > 0);
  const isWishlisted = wishlistedIds.has(product.id);
  const hasDiscount = Number(product.actualPrice) > Number(product.commonPrice);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    if (isWishlisted) {
      removeFromWishlist(product.id, {
        onSuccess: () => toast.success("Removed from wishlist"),
        onError: () => toast.error("Failed to remove from wishlist"),
      });
    } else {
      addToWishlist({ productId: product.id }, {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: () => toast.error("Failed to add to wishlist"),
      });
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    if (availableSizes.length === 0) { toast.error("No sizes available"); return; }
    setShowSizes(true);
  };

  const handleSizeSelect = (e: React.MouseEvent, sizeId: string) => {
    e.preventDefault();
    addToCart(
      { productVariantSizeId: sizeId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success("Added to cart!");
          setShowSizes(false);
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string }>;
          if (axiosErr.response?.status === 401) { router.push("/login"); return; }
          toast.error(axiosErr.response?.data?.message || "Failed to add to cart");
        },
      },
    );
  };

  return (
    <motion.div variants={cardVariants}>
      <Link
        href={
          defaultVariant
            ? `/shop/${product.id}?variant=${defaultVariant.id}`
            : `/shop/${product.id}`
        }
        className="group flex flex-col justify-between h-full"
      >
        {/* Image Container */}
        <div className="relative aspect-square w-full bg-[#f3f3f3] rounded-sm overflow-hidden flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#ebebeb]">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority
              className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
            />
          ) : (
            <span className="text-zinc-300 text-xs font-sans tracking-widest uppercase select-none">
              MAMO FASHION
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center shadow-xs border transition-all duration-300 z-10 ${
              isWishlisted
                ? "bg-black border-black text-white hover:scale-110 active:scale-95"
                : "bg-white border-zinc-100 text-zinc-700 hover:text-black hover:scale-110 active:scale-95"
            }`}
            aria-label="Add to Wishlist"
          >
            <FiHeart
              size={14}
              className={`transition-all duration-300 stroke-[1.8] ${
                isWishlisted
                  ? "fill-white text-white scale-110"
                  : ""
              }`}
            />
          </button>

          {/* Size Picker Overlay */}
          {showSizes && (
            <div
              className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3 z-20 p-4"
              onClick={(e) => e.preventDefault()}
            >
              <button
                onClick={(e) => { e.preventDefault(); setShowSizes(false); }}
                className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
              >
                <FiX size={13} className="text-zinc-500" />
              </button>
              <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-900 uppercase">
                Select Size
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {availableSizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={(e) => handleSizeSelect(e, s.id)}
                    disabled={isAddingToCart}
                    className="px-3 py-1.5 border border-zinc-200 rounded-sm text-xs font-sans text-zinc-800 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex items-end justify-between px-1 mt-auto">
          <div className="flex flex-col">
            <span className="text-[11px] text-black font-sans tracking-wide font-medium mb-1">
              {product.name ?? ""}
            </span>
            {defaultVariant?.colorName && (
              <span className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-zinc-200 shrink-0"
                  style={{ background: getMultiColorBackground(defaultVariant.colorCodes) }}
                />
                <span className="text-[10px] text-zinc-600 font-sans">{defaultVariant.colorName}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5 mb-0.5">
              <span className="text-sm font-semibold text-zinc-900 font-sans tracking-wide">
                {formatPrice(product.commonPrice)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] text-zinc-400 font-sans line-through">
                  {formatPrice(product.actualPrice)}
                </span>
              )}
            </span>
          </div>

          <button
            onClick={handleCartClick}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-zinc-100 hover:scale-110 active:scale-95 transition-all duration-300 z-10"
            aria-label="Add to Cart"
          >
            <FiShoppingBag size={16} />
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
