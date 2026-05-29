"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiHeart, FiCheck, FiSliders, FiChevronDown, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";

import { products, type Product } from "@/data/products";

export default function ShopGrid() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Filter & Sort State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sortBy, setSortBy] = useState<string>("low-to-high");

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigating to product detail
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceVal,
      image: product.image,
    });
    
    setAddingId(product.id);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigating to product detail
    toggleWishlist({
      id: product.id,
      name: product.name,
      priceText: product.priceText,
      priceVal: product.priceVal,
      image: product.image
    });
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(product => {
    if (minPrice !== "" && product.priceVal < minPrice) return false;
    if (maxPrice !== "" && product.priceVal > maxPrice) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-to-high") {
      return a.priceVal - b.priceVal;
    }
    if (sortBy === "high-to-low") {
      return b.priceVal - a.priceVal;
    }
    return 0; // Default/Featured
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
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
          <FiSliders size={12} className="sm:size-[14px]" />
          <span>FILTER{(minPrice !== "" || maxPrice !== "") && " • ACTIVE"}</span>
        </button>

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
                {sortBy === "low-to-high" 
                  ? "Price: Low to High" 
                  : "Price: High to Low"}
              </span>
              <FiChevronDown size={12} className={`sm:size-[14px] transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Sort Dropdown Options */}
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
                    {[
                      { value: "low-to-high", label: "Price: Low to High" },
                      { value: "high-to-low", label: "Price: High to Low" }
                    ].map((opt) => (
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
                        {sortBy === opt.value && <FiCheck size={12} className="text-zinc-900" />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Filter panel (Dropdown/Drawer) */}
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
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 font-sans uppercase mb-2">Min Price (AED)</label>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 font-sans uppercase mb-2">Max Price (AED)</label>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm font-sans focus:outline-hidden focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all text-zinc-900 placeholder:text-zinc-400"
                />
              </div>
              <div className="flex gap-4">
                {(minPrice !== "" || maxPrice !== "") && (
                  <button
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="flex-1 py-3 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 bg-zinc-900 hover:bg-black text-white rounded-lg text-[10px] md:text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Products */}
      {sortedProducts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50 flex flex-col items-center justify-center">
          <h3 className="font-serif text-xl text-zinc-900 mb-2">No styles found</h3>
          <p className="text-xs md:text-sm text-zinc-500 mb-6 font-sans">No products match your active price filters.</p>
          <button
            onClick={() => {
              setMinPrice("");
              setMaxPrice("");
            }}
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
          key={sortBy + minPrice + maxPrice} // Smooth entry animation on filter/sort changes
        >
          {sortedProducts.map((product) => (
            <motion.div key={product.id} variants={cardVariants}>
              <Link href={`/shop/${product.id}`} className="group flex flex-col justify-between h-full">
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-[#f3f3f3] rounded-sm overflow-hidden flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#ebebeb]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={340}
                    height={340}
                    priority
                    className={`object-contain p-4 transition-all duration-700 ease-in-out ${
                      product.hoverImage ? "group-hover:opacity-0 group-hover:scale-95" : "group-hover:scale-105"
                    }`}
                  />
                  {product.hoverImage && (
                    <Image
                      src={product.hoverImage}
                      alt={`${product.name} Styled`}
                      fill
                      sizes="340px"
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
                        isInWishlist(product.id)
                          ? "fill-black text-black scale-110"
                          : "text-zinc-700 hover:text-black"
                      }`}
                    />
                  </button>
                </div>

                {/* Product Info & Cart Button */}
                <div className="flex justify-between items-center px-1 mt-auto">
                  {/* Text Section */}
                  <div className="flex flex-col">
                    <span className="text-[11px] text-zinc-400 font-sans tracking-wide font-medium mb-1">
                      {product.brand}
                    </span>
                    <span className="text-sm font-semibold text-zinc-900 font-sans tracking-wide">
                      {product.priceText}
                    </span>
                  </div>

                  {/* Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={addingId !== null}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-90 z-10 relative ${
                      addingId === product.id
                        ? "bg-zinc-900 border-zinc-900 text-white"
                        : "bg-white border-zinc-300 hover:border-zinc-900 text-zinc-800 hover:bg-zinc-950 hover:text-white"
                    }`}
                    aria-label="Add to Cart"
                  >
                    {addingId === product.id ? (
                      <FiCheck size={14} className="stroke-[2.5] animate-scale-in" />
                    ) : (
                      <FiShoppingBag size={14} className="stroke-[1.8]" />
                    )}
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
