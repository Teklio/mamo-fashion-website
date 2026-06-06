"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiHeart, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/services/product.service";
import { useAddToCart } from "@/services/cart.service";
import { useWishlistedIds, useAddToWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import type { RootState } from "@/store";
import type {
  CustomerProductDetail,
  CustomerProductVariant,
} from "@/types/product.type";
import type { AxiosError } from "axios";

export default function ProductDetailClient({
  product,
}: {
  product: CustomerProductDetail;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const { mutate: addToCartApi, isPending: isAdding } = useAddToCart();
  const wishlistedIds = useWishlistedIds();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const activeVariants = product.variants;
  const defaultVariant = activeVariants[0];

  const [selectedColor, setSelectedColor] = useState<string>(
    defaultVariant?.colorName ?? "",
  );
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("DESCRIPTION");
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Derived from selected color
  const selectedVariant: CustomerProductVariant =
    activeVariants.find((v) => v.colorName === selectedColor) ?? defaultVariant;

  // Build image gallery: primary → secondary → rest (deduped)
  const variantImages: string[] = [
    selectedVariant?.primaryImage?.publicUrl,
    selectedVariant?.secondaryImage?.publicUrl,
    ...(selectedVariant?.images ?? [])
      .filter(
        (img) =>
          img.id !== selectedVariant?.primaryImage?.id &&
          img.id !== selectedVariant?.secondaryImage?.id,
      )
      .map((img) => img.publicUrl),
  ].filter(Boolean) as string[];

  const availableSizes = (selectedVariant?.sizes ?? [])
    .filter((s) => s.stock > 0)
    .map((s) => s.size);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    setActiveImage(0);
    setSelectedSize(null);
  };

  // Prevent background scroll when size guide is open
  useEffect(() => {
    document.body.style.overflow = isSizeGuideOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSizeGuideOpen]);

  const priceText = formatPrice(product.price);
  const isWishlisted = wishlistedIds.has(product.id);
  const tabs = ["DESCRIPTION", "CARE", "SHIPPING & RETURNS"];

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error("Please select a size"); return; }
    const sizeObj = selectedVariant?.sizes.find((s) => s.size === selectedSize);
    if (!sizeObj) return;
    if (!isAuthenticated) { router.push("/login"); return; }
    addToCartApi(
      { productVariantSizeId: sizeObj.id, quantity },
      {
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
    const sizeObj = selectedVariant?.sizes.find((s) => s.size === selectedSize);
    if (!sizeObj) return;
    const params = new URLSearchParams({
      mode: "buynow",
      pvs: sizeObj.id,
      qty: String(quantity),
      title: product.title,
      price: String(product.price),
      color: selectedColor,
      size: selectedSize,
      img: selectedVariant?.primaryImage?.publicUrl ?? "",
    });
    router.push(`/checkout?${params}`);
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ productId: product.id });
    }
  };

  return (
    <div className="flex flex-col gap-24">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-24">
        {/* Left: Images */}
        <div className="flex flex-col-reverse col-span-3 lg:flex-row gap-6 lg:h-165">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto no-scrollbar pb-2 lg:pb-0">
            {variantImages.length > 0 ? (
              variantImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-[#f3f3f3] rounded-sm overflow-hidden border-2 transition-all ${
                    activeImage === idx ? "border-zinc-900" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx}`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))
            ) : (
              <div className="w-20 h-20 lg:w-24 lg:h-24 shrink-0 bg-[#f3f3f3] rounded-sm flex items-center justify-center">
                <span className="text-zinc-300 text-[9px] font-sans tracking-widest">SORIN</span>
              </div>
            )}
          </div>

          {/* Main Image */}
          <div className="relative flex-1 bg-[#f3f3f3] rounded-sm overflow-hidden min-h-100 lg:min-h-full">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              {variantImages[activeImage] ? (
                <Image
                  key={`${selectedColor}-${activeImage}`}
                  src={variantImages[activeImage]}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover animate-in fade-in duration-300"
                  priority
                />
              ) : (
                <span className="text-zinc-200 text-sm font-sans tracking-[0.3em] uppercase select-none">
                  SORIN
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
        </div>

        {/* Right: Details */}
        <div className="flex flex-col pt-4 col-span-2 lg:pt-12">
          <h1 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-2">
            {product.title}
          </h1>
          <p className="text-xl font-semibold text-zinc-900 mb-1">
            {priceText}
          </p>
          <p className="text-xs text-zinc-500 font-sans mb-8">
            Inclusive of duties. Complimentary shipping.
          </p>

          {/* Color & Quantity */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-8 md:gap-4 w-full">
            {/* Color */}
            <div>
              <span className="text-xs font-bold tracking-widest text-zinc-900 font-sans mb-4 block uppercase">
                Color
              </span>
              <div className="flex items-center space-x-3 mb-3">
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
                        backgroundColor: variant.colorCode,
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

            {/* Quantity */}
            <div>
              <span className="text-xs font-bold tracking-widest text-zinc-900 font-sans mb-4 block uppercase md:text-right">
                Quantity
              </span>
              <div className="flex items-center border border-zinc-200 rounded-sm w-fit md:ml-auto">
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

          {/* Size */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold tracking-widest text-zinc-900 font-sans">
                SIZE
              </span>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs text-zinc-500 underline underline-offset-4 hover:text-zinc-900 transition-colors font-sans cursor-pointer"
              >
                Find your size
              </button>
            </div>

            {availableSizes.length > 0 ? (
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
                    className={`py-3 px-5 text-xs font-sans border-r border-zinc-200 last:border-r-0 transition-colors ${
                      selectedSize === size
                        ? "bg-zinc-900 text-white"
                        : "bg-white text-zinc-700 hover:bg-zinc-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 font-sans">
                No sizes available for this color.
              </p>
            )}
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
                {activeTab === "CARE" && (
                  <p>
                    Wipe clean with a damp cloth. Avoid prolonged exposure to
                    direct sunlight and water. Store in the provided dust bag
                    when not in use.
                  </p>
                )}
                {activeTab === "SHIPPING & RETURNS" && (
                  <p>
                    Free standard shipping on all orders. Returns are accepted
                    within 14 days of delivery. Items must be unworn and in
                    original packaging.
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-3xl bg-[#fdfdfd] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-start justify-between p-8 border-b border-zinc-100">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center shrink-0">
                    <span className="text-lg">👣</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-zinc-900 mb-2">
                      SORIN Size Guide
                    </h2>
                    <p className="text-sm text-zinc-500 font-sans max-w-md leading-relaxed">
                      Use the chart below to find your perfect fit. Measurements
                      may slightly vary depending on handcrafted production.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="overflow-x-auto p-8 no-scrollbar">
                <table className="w-full text-sm font-sans text-left min-w-150">
                  <thead>
                    <tr className="border-b-2 border-zinc-100 text-zinc-900">
                      <th className="py-4 font-bold">Size</th>
                      <th className="py-4 font-bold text-center">35</th>
                      <th className="py-4 font-bold text-center">36</th>
                      <th className="py-4 font-bold text-center">37</th>
                      <th className="py-4 font-bold text-center">38</th>
                      <th className="py-4 font-bold text-center">39</th>
                      <th className="py-4 font-bold text-center">40</th>
                      <th className="py-4 font-bold text-center">41</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-600">
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">
                        Australia
                      </td>
                      <td className="py-4 text-center">4.5</td>
                      <td className="py-4 text-center">5.5</td>
                      <td className="py-4 text-center">6.5</td>
                      <td className="py-4 text-center">7.5</td>
                      <td className="py-4 text-center">8.5</td>
                      <td className="py-4 text-center">9.5</td>
                      <td className="py-4 text-center">10.5</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">US</td>
                      <td className="py-4 text-center">5.5</td>
                      <td className="py-4 text-center">6</td>
                      <td className="py-4 text-center">6.5</td>
                      <td className="py-4 text-center">7.5</td>
                      <td className="py-4 text-center">8</td>
                      <td className="py-4 text-center">9</td>
                      <td className="py-4 text-center">9.5</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">Italy</td>
                      <td className="py-4 text-center">35</td>
                      <td className="py-4 text-center">36</td>
                      <td className="py-4 text-center">37</td>
                      <td className="py-4 text-center">38</td>
                      <td className="py-4 text-center">39</td>
                      <td className="py-4 text-center">40</td>
                      <td className="py-4 text-center">41</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">France</td>
                      <td className="py-4 text-center">36</td>
                      <td className="py-4 text-center">37</td>
                      <td className="py-4 text-center">38</td>
                      <td className="py-4 text-center">39</td>
                      <td className="py-4 text-center">40</td>
                      <td className="py-4 text-center">41</td>
                      <td className="py-4 text-center">42</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">UK</td>
                      <td className="py-4 text-center">2.5</td>
                      <td className="py-4 text-center">3</td>
                      <td className="py-4 text-center">4</td>
                      <td className="py-4 text-center">5</td>
                      <td className="py-4 text-center">6</td>
                      <td className="py-4 text-center">7</td>
                      <td className="py-4 text-center">8</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">China</td>
                      <td className="py-4 text-center">225</td>
                      <td className="py-4 text-center">230</td>
                      <td className="py-4 text-center">235</td>
                      <td className="py-4 text-center">240</td>
                      <td className="py-4 text-center">245</td>
                      <td className="py-4 text-center">250</td>
                      <td className="py-4 text-center">255</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">Mexico</td>
                      <td className="py-4 text-center">22.5</td>
                      <td className="py-4 text-center">23.5</td>
                      <td className="py-4 text-center">24</td>
                      <td className="py-4 text-center">24.5</td>
                      <td className="py-4 text-center">25.5</td>
                      <td className="py-4 text-center">26</td>
                      <td className="py-4 text-center">26.5</td>
                    </tr>
                    <tr className="border-b border-zinc-100">
                      <td className="py-4 font-medium text-zinc-900">
                        Foot Length (CM)
                      </td>
                      <td className="py-4 text-center">22.6</td>
                      <td className="py-4 text-center">23.3</td>
                      <td className="py-4 text-center">24</td>
                      <td className="py-4 text-center">24.6</td>
                      <td className="py-4 text-center">25.3</td>
                      <td className="py-4 text-center">26</td>
                      <td className="py-4 text-center">26.6</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-medium text-zinc-900">
                        Foot Length (INCH)
                      </td>
                      <td className="py-4 text-center">8.9</td>
                      <td className="py-4 text-center">9.2</td>
                      <td className="py-4 text-center">9.4</td>
                      <td className="py-4 text-center">9.7</td>
                      <td className="py-4 text-center">10</td>
                      <td className="py-4 text-center">10.2</td>
                      <td className="py-4 text-center">10.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-zinc-50 p-8 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  Handcrafted in limited quantities
                </span>
                <Link
                  href="/contact-us"
                  className="text-sm font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors"
                >
                  Need help?
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
