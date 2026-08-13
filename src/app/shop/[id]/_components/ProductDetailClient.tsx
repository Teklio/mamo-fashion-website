"use client";

import { useState } from "react";
import Image from "next/image";
import { FiHeart, FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice, useGetProduct } from "@/services/product.service";
import { useAddToCart } from "@/services/cart.service";
import { useWishlistedIds, useAddToWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import type { RootState } from "@/store";
import { getMultiColorBackground } from "@/types/product.type";
import type { CustomerProductVariant } from "@/types/product.type";
import type { AxiosError } from "axios";

export default function ProductDetailClient({
  productId,
  initialVariantId,
}: {
  productId: string;
  initialVariantId?: string;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { data, isLoading, isError } = useGetProduct(productId);
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCart();
  const wishlistedIds = useWishlistedIds();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const product = data?.product;
  const activeVariants = product?.variants ?? [];
  const defaultVariant =
    activeVariants.find((v) => v.id === initialVariantId) ?? activeVariants[0];

  // null = no explicit user choice yet → fall back to the default variant's color.
  const [selectedColorOverride, setSelectedColorOverride] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeSyncedVariantId, setSizeSyncedVariantId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("DESCRIPTION");
  const [isCopied, setIsCopied] = useState(false);

  const selectedColor = selectedColorOverride ?? defaultVariant?.colorName ?? "";

  // Derived from selected color
  const selectedVariant: CustomerProductVariant | undefined =
    activeVariants.find((v) => v.colorName === selectedColor) ?? defaultVariant;

  // Build image gallery: primary → gallery images
  const variantImages: string[] = [
    selectedVariant?.primaryImageUrl,
    ...(selectedVariant?.imageUrls ?? []),
  ].filter(Boolean) as string[];

  const availableSizes = (selectedVariant?.sizes ?? [])
    .filter((s) => s.stock > 0)
    .map((s) => s.name);

  const handleColorChange = (colorName: string) => {
    setSelectedColorOverride(colorName);
    setActiveImage(0);
  };

  // Default to the first in-stock size whenever the selected variant changes
  // (initial load or a color switch) — adjusted during render rather than in
  // an effect, per https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (selectedVariant?.id !== sizeSyncedVariantId) {
    setSizeSyncedVariantId(selectedVariant?.id);
    setSelectedSize(availableSizes[0] ?? null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <h2 className="text-2xl font-serif text-zinc-900">Product not found</h2>
        <p className="text-sm text-zinc-500 font-sans">
          This product is unavailable or has been removed.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase px-8 py-4 rounded-md transition-colors hover:bg-black/90"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const selectedSizeObj = selectedVariant?.sizes.find((s) => s.name === selectedSize);
  const displayPrice = selectedSizeObj?.finalPrice ?? Number(product.commonPrice);
  const displayActualPrice =
    Number(product.actualPrice) + Number(selectedSizeObj?.additionalPrice ?? 0);
  const hasDiscount = displayActualPrice > displayPrice;
  const isWishlisted = wishlistedIds.has(product.id);
  const tabs = ["DESCRIPTION", "FEATURES", "SHIPPING & RETURNS"];

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    const sizeObj = selectedVariant?.sizes.find((s) => s.name === selectedSize);
    if (!sizeObj) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    addToCartApi(
      { productVariantSizeId: sizeObj.id, quantity },
      {
        onSuccess: () => {
          toast.success("Added to cart!");
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string }>;
          if (axiosErr.response?.status === 401) { router.push("/login"); return; }
          toast.error(axiosErr.response?.data?.message || "Failed to add to cart");
        },
      },
    );
  };

  const handleBuyNow = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    const sizeObj = selectedVariant?.sizes.find((s) => s.name === selectedSize);
    if (!sizeObj) return;
    const params = new URLSearchParams({
      mode: "buynow",
      pvs: sizeObj.id,
      qty: String(quantity),
      title: product.name,
      price: String(sizeObj.finalPrice),
      color: selectedColor,
      size: selectedSize,
      img: selectedVariant?.primaryImageUrl ?? "",
    });
    router.push(`/checkout?${params}`);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Mamo Fashion`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleWishlistToggle = () => {
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

  return (
    <div className="flex flex-col gap-12 md:gap-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
        {/* Left: Images */}
        <div className="flex flex-col col-span-3 gap-4">
          {/* Main Image */}
          <div className="relative w-full bg-[#f3f3f3] rounded-sm overflow-hidden min-h-100 lg:min-h-150">
            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
              {variantImages[activeImage] ? (
                <Image
                  key={`${selectedColor}-${activeImage}`}
                  src={variantImages[activeImage]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover animate-in fade-in duration-300"
                  priority
                />
              ) : (
                <span className="text-zinc-200 text-sm font-sans tracking-[0.3em] uppercase select-none">
                  MAMO FASHION
                </span>
              )}
            </div>

            <button
              onClick={handleWishlistToggle}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xs border border-zinc-100 hover:scale-110 active:scale-95 transition-all duration-300 z-10"
              aria-label="Add to Wishlist"
            >
              <FiHeart
                size={16}
                className={`transition-all duration-300 stroke-[1.8] ${
                  isWishlisted
                    ? "fill-black text-black"
                    : "text-zinc-700 hover:text-black"
                }`}
              />
            </button>
          </div>

          {/* Thumbnails — all images (primary + up to 5 gallery) */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.min(Math.max(variantImages.length, 3), 6)}, minmax(0, 1fr))`,
            }}
          >
            {variantImages.length > 0 ? (
              variantImages.map((img, idx) => (
                <button
                  key={`${selectedColor}-thumb-${idx}`}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-full aspect-3/4 bg-[#f3f3f3] rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === idx
                      ? "border-zinc-900 scale-[1.03] shadow-md"
                      : "border-transparent hover:border-zinc-300 hover:scale-[1.02]"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 16vw, (max-width: 1024px) 14vw, 10vw"
                    className="object-cover"
                  />
                </button>
              ))
            ) : (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full aspect-3/4 bg-[#f3f3f3] rounded-sm flex items-center justify-center"
                >
                  <span className="text-zinc-300 text-[8px] font-sans tracking-widest text-center px-1">
                    MAMO
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col pt-4 col-span-2 lg:pt-12">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-serif text-zinc-900">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 shrink-0">
              <button
                onClick={handleShare}
                className="text-zinc-400 hover:text-black transition-colors"
                title="Share"
              >
                <FiShare2 size={20} />
              </button>
              <button
                onClick={handleCopyLink}
                className="text-zinc-400 hover:text-black transition-colors"
                title="Copy Link"
              >
                {isCopied ? <FiCheck size={20} className="text-green-600" /> : <FiCopy size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-baseline gap-3 mb-1">
            <p className="text-xl font-semibold text-zinc-900">
              {formatPrice(displayPrice)}
            </p>
            {hasDiscount && (
              <p className="text-base text-zinc-400 line-through">
                {formatPrice(displayActualPrice)}
              </p>
            )}
          </div>
          <p className="text-xs font-sans mb-8 text-zinc-500">
            Inclusive of duties. Complimentary shipping.
          </p>

          {/* Color */}
          <div className="mb-10 w-full">
            <span className="text-xs font-bold tracking-widest text-zinc-900 font-sans mb-4 block uppercase">
              Color
            </span>
            <div className="flex items-center gap-3 mb-3 overflow-x-auto scroll-smooth pb-1 touch-pan-x overscroll-x-contain">
              {activeVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleColorChange(variant.colorName)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    selectedColor === variant.colorName
                      ? "border-[1.5px] border-zinc-900"
                      : "border border-transparent hover:border-zinc-300"
                  }`}
                  title={variant.colorName}
                >
                  <div
                    className="w-8 h-8 rounded-full"
                    style={{
                      background: getMultiColorBackground(variant.colorCodes),
                      border:
                        selectedColor === variant.colorName
                          ? "none"
                          : "1px solid #e4e4e7",
                    }}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm text-zinc-500 font-sans">
              {selectedColor}
            </span>
          </div>

          {/* Size & Quantity */}
          <div className="flex flex-row items-end justify-between mb-10 gap-4 md:gap-6 w-full">
            {/* Size */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold tracking-widest text-zinc-900 font-sans">
                  SIZE
                </span>
              </div>

              {availableSizes.length > 0 ? (
                <div className="w-full overflow-x-auto scroll-smooth pb-1 touch-pan-x overscroll-x-contain">
                  <div
                    className="inline-grid border border-zinc-200 rounded-sm overflow-hidden"
                    style={{
                      gridTemplateColumns: `repeat(${availableSizes.length}, minmax(60px, 1fr))`,
                    }}
                  >
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-5 text-xs font-sans border-r border-zinc-200 last:border-r-0 transition-colors shrink-0 ${
                          selectedSize === size
                            ? "bg-zinc-900 text-white"
                            : "bg-white text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-400 font-sans">
                  No sizes available for this color.
                </p>
              )}
            </div>

            {/* Quantity */}
            <div className="shrink-0">
              <span className="text-xs font-bold tracking-widest text-zinc-900 font-sans mb-4 block uppercase text-right">
                Quantity
              </span>
              <div className="flex items-center border border-zinc-200 rounded-sm w-fit ml-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-zinc-500 hover:text-black transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-3 text-sm font-sans min-w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-zinc-500 hover:text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`flex-1 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm border transition-all duration-300 ${
                isAdding
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-900 border-zinc-900 hover:bg-zinc-950 hover:text-white"
              }`}
            >
              {isAdding ? "ADDED TO CART" : "ADD TO CART"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!selectedSize}
              className={`flex-1 py-4 text-xs font-bold tracking-[0.2em] uppercase rounded-sm border transition-all duration-300 ${
                !selectedSize
                  ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
                  : "bg-zinc-900 text-white border-zinc-900 hover:bg-black hover:border-black"
              }`}
            >
              BUY NOW
            </button>
          </div>

          {/* Tabs */}
          <div className="border-t border-zinc-200 pt-6">
            <div className="flex space-x-8 mb-6 border-b border-zinc-100 pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[10px] font-bold tracking-widest uppercase pb-2 border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-zinc-600 leading-relaxed font-sans"
              >
                {activeTab === "DESCRIPTION" && (
                  <p>{product.description ?? ""}</p>
                )}
                {activeTab === "FEATURES" && (
                  product.features.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1.5">
                      {product.features.map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No additional features listed for this product.</p>
                  )
                )}
                {activeTab === "SHIPPING & RETURNS" && (
                  <p>
                    Free standard shipping on all orders. Returns are accepted
                    within 7 days of delivery. Items must be unworn and in
                    original packaging.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
