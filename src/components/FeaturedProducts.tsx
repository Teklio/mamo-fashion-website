"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingBag, FiHeart, FiCheck } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  brand: string;
  priceText: string;
  priceVal: number;
  image: string;
}

const products: Product[] = [
  {
    id: "rae-01",
    name: "Rae Collections Blue & Yellow Sandals",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/1.png",
  },
  {
    id: "rae-02",
    name: "Rae Collections Maroon Sandals",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/2.png",
  },
  {
    id: "rae-03",
    name: "Rae Collections Green & Red Sandals",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/3.png",
  },
  {
    id: "rae-04",
    name: "Rae Collections Blue & Yellow Sandals Extra",
    brand: "Rae Collections",
    priceText: "AED 289.00",
    priceVal: 289,
    image: "/assets/Home/1.png",
  },
];

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceVal,
      image: product.image,
    });
    
    // Quick micro-animation feedback
    setAddingId(product.id);
    setTimeout(() => {
      setAddingId(null);
    }, 1200);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
    <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-white text-zinc-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="flex justify-between items-end mb-10 md:mb-14"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 className="text-zinc-900 text-3xl md:text-5xl font-serif tracking-wide font-normal">
            Signature Styles
          </h2>
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center px-7 py-3 border border-zinc-800 rounded-sm text-[10px] md:text-xs tracking-[0.2em] text-zinc-900 font-sans font-medium bg-white hover:bg-zinc-950 hover:text-white transition-colors duration-400"
          >
            VIEW ALL
          </Link>
        </motion.div>

        {/* Product Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              className="group flex flex-col justify-between"
              variants={cardVariants}
            >
              {/* Image Container with light gray background */}
              <div className="relative aspect-square w-full bg-[#f3f3f3] rounded-sm overflow-hidden flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[#ebebeb]">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={340}
                  height={340}
                  priority
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-103"
                />

                {/* Wishlist Button (Heart) */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                  aria-label="Add to Wishlist"
                >
                  <FiHeart
                    size={14}
                    className={`transition-all duration-300 stroke-[1.8] ${
                      wishlist[product.id]
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-zinc-700 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>

              {/* Product Info & Cart Button */}
              <div className="flex justify-between items-center px-1">
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
                  onClick={() => handleAddToCart(product)}
                  disabled={addingId !== null}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer ${
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
