"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiHeart, FiCheck } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";

import { products, type Product } from "@/data/products";

export default function FeaturedProducts({ title = "Signature Styles", hideViewAll = false }: { title?: string, hideViewAll?: boolean } = {}) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart({
      id: `${product.id}-${product.color || "Ocean Blue"}`, // Make the cart ID unique for default color
      name: product.name,
      price: product.priceVal,
      image: product.image,
      color: product.color || "Ocean Blue",
      quantity: 1,
    });

    // Quick micro-animation feedback
    setAddingId(product.id);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    toggleWishlist({
      id: product.id,
      name: product.name,
      priceText: product.priceText,
      priceVal: product.priceVal,
      image: product.image,
      color: product.color || "Ocean Blue",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 px-8 md:px-16 bg-white text-zinc-950">
      <div className="max-w-400 mx-auto">
        {/* Section Header */}
        <motion.div
          className="flex justify-between items-center sm:items-end gap-4 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 className="text-zinc-900 text-2xl sm:text-3xl md:text-5xl font-serif tracking-wide font-normal whitespace-nowrap">
            {title}
          </h2>
          {!hideViewAll && (
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center px-4 py-2 sm:px-7 sm:py-3 border border-zinc-800 rounded-xl text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] text-zinc-900 font-sans font-medium bg-white hover:bg-zinc-950 hover:text-white transition-colors duration-400 whitespace-nowrap shrink-0"
            >
              VIEW ALL
            </Link>
          )}
        </motion.div>

        {/* Product Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.slice(0, 4).map((product) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
            >
              <Link href={`/shop/${product.id}`} className="group flex flex-col justify-between h-full">
                {/* Image Container with light gray background */}
                <div className="relative aspect-square w-full bg-[#f3f3f3] rounded-sm overflow-hidden flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#ebebeb]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={340}
                    height={340}
                    priority
                    className={`object-contain p-4 transition-all duration-700 ease-in-out ${product.hoverImage ? "group-hover:opacity-0 group-hover:scale-95" : "group-hover:scale-105"
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

                  {/* Wishlist Button (Heart) */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer z-10"
                    aria-label="Add to Wishlist"
                  >
                    <FiHeart
                      size={14}
                      className={`transition-all duration-300 stroke-[1.8] ${isInWishlist(product.id)
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
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer z-10 relative ${addingId === product.id
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
      </div>
    </section>
  );
}
