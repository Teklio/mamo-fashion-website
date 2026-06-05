"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiSliders, FiChevronDown, FiCheck } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProducts, formatPrice } from "@/services/product.service";
import { useWishlistedIds, useAddToWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import type { CustomerProduct } from "@/types/product.type";
import type { RootState } from "@/store";

export default function ShopGrid() {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const wishlistedIds = useWishlistedIds();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();
  // Filter & Sort State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState<number | "">("");
  const [maxPriceInput, setMaxPriceInput] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<"low-to-high" | "high-to-low">("low-to-high");

  // Applied params sent to API
  const [appliedMin, setAppliedMin] = useState<number | undefined>(undefined);
  const [appliedMax, setAppliedMax] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetProducts({
    minPrice: appliedMin,
    maxPrice: appliedMax,
    isAscending: sortBy === "low-to-high",
  });

  const handleWishlistToggle = (e: React.MouseEvent, product: CustomerProduct) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    if (wishlistedIds.has(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ productId: product.id });
    }
  };

  const handleApplyFilters = () => {
    setAppliedMin(minPriceInput !== "" ? minPriceInput : undefined);
    setAppliedMax(maxPriceInput !== "" ? maxPriceInput : undefined);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedMin(undefined);
    setAppliedMax(undefined);
  };

  const isFiltered = appliedMin !== undefined || appliedMax !== undefined;
  const products = data?.products ?? [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center py-4 border-y border-zinc-100 relative z-30 mb-4 gap-2">
        {/* Filter button */}
        <button
          onClick={() => {
            setIsFilterOpen(!isFilterOpen);
            setIsSortOpen(false);
          }}
          className={`flex items-center space-x-1.5 px-3 py-2 sm:px-5 sm:py-2.5 border rounded-lg text-xs font-sans font-semibold tracking-widest transition-all duration-300 cursor-pointer ${
            isFilterOpen
              ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
              : "border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
          }`}
        >
          <FiSliders size={12} className="sm:size-3.5" />
          <span>FILTER{isFiltered && " • ACTIVE"}</span>
        </button>

        {/* Sort dropdown */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-sans text-zinc-500">
          <span className="hidden sm:inline">Sort by:</span>
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsFilterOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border border-zinc-200 rounded-lg bg-white min-w-32 sm:min-w-40 justify-between text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-300 cursor-pointer shadow-xs"
            >
              <span className="text-[11px] sm:text-xs">
                {sortBy === "low-to-high" ? "Price: Low to High" : "Price: High to Low"}
              </span>
              <FiChevronDown
                size={12}
                className={`sm:size-3.5 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-zinc-100 rounded-xl shadow-xl py-2 z-50 overflow-hidden"
                  >
                    {(
                      [
                        { value: "low-to-high", label: "Price: Low to High" },
                        { value: "high-to-low", label: "Price: High to Low" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-sans transition-colors flex justify-between items-center ${
                          sortBy === opt.value
                            ? "bg-zinc-50 font-bold text-zinc-900"
                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.value && (
                          <FiCheck size={12} className="text-zinc-900" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-zinc-100 pb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end bg-[#fafafa] p-6 md:p-8 rounded-xl border border-zinc-100">
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 font-sans uppercase mb-2">
                  Min Price (AED)
                </label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPriceInput}
                  onChange={(e) =>
                    setMinPriceInput(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 font-sans uppercase mb-2">
                  Max Price (AED)
                </label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPriceInput}
                  onChange={(e) =>
                    setMaxPriceInput(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              <div className="flex gap-4">
                {(minPriceInput !== "" || maxPriceInput !== "") && (
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 py-3 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={handleApplyFilters}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-black text-white rounded-lg text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-square w-full bg-[#f3f3f3] rounded-sm animate-pulse" />
              <div className="flex justify-between items-center px-1">
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
                </div>
                <div className="w-9 h-9 rounded-full bg-zinc-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 flex flex-col items-center justify-center">
          <h3 className="font-serif text-xl text-zinc-900 mb-2">No styles found</h3>
          <p className="text-xs md:text-sm text-zinc-500 mb-6 font-sans">
            No products match your active price filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-3 bg-zinc-900 hover:bg-black text-white text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase rounded-lg transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${sortBy}-${appliedMin}-${appliedMax}`}
        >
          {products.map((product) => {
            const mainImage = product.primaryImageUrl ?? "";
            const hoverImage = product.secondaryImageUrl ?? undefined;

            return (
              <motion.div key={product.id} variants={cardVariants}>
                <Link
                  href={`/shop/${product.id}`}
                  className="group flex flex-col justify-between h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-[#f3f3f3] rounded-sm overflow-hidden flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#ebebeb]">
                    {mainImage ? (
                      <Image
                        src={mainImage}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                        className={`object-cover transition-all duration-700 ease-in-out ${
                          hoverImage
                            ? "group-hover:opacity-0 group-hover:scale-95"
                            : "group-hover:scale-105"
                        }`}
                      />
                    ) : (
                      <span className="text-zinc-300 text-xs font-sans tracking-widest uppercase select-none">
                        SORIN
                      </span>
                    )}
                    {hoverImage && (
                      <Image
                        src={hoverImage}
                        alt={`${product.title} Styled`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
                      />
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-zinc-100 hover:scale-110 active:scale-95 transition-all duration-300 z-10"
                      aria-label="Add to Wishlist"
                    >
                      <FiHeart
                        size={14}
                        className={`transition-all duration-300 stroke-[1.8] ${
                          wishlistedIds.has(product.id)
                            ? "fill-black text-black scale-110"
                            : "text-zinc-700 hover:text-black"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col px-1 mt-auto">
                    <span className="text-[11px] text-zinc-400 font-sans tracking-wide font-medium mb-1">
                      {product.title ?? ""}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 font-sans tracking-wide">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
