"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiHeart, FiCheck } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";

import { products, type Product } from "@/data/products";

export default function ShopGrid() {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addingId, setAddingId] = useState<string | null>(null);

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
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
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
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              />

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
                      ? "fill-red-500 text-red-500 scale-110"
                      : "text-zinc-700 hover:text-red-500"
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
  );
}
