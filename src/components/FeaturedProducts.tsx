"use client";

import Image from "next/image";
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useGetProducts, formatPrice } from "@/services/product.service";
import { useWishlistedIds, useAddToWishlist, useRemoveFromWishlist } from "@/services/wishlist.service";
import type { CustomerProduct } from "@/types/product.type";
import type { RootState } from "@/store";

export default function FeaturedProducts({
  title = "Signature Styles",
  hideViewAll = false,
}: {
  title?: string;
  hideViewAll?: boolean;
} = {}) {
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const wishlistedIds = useWishlistedIds();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();

  const { data, isLoading } = useGetProducts({ showOnHomePage: true });

  const handleWishlistToggle = (e: React.MouseEvent, product: CustomerProduct) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push("/login"); return; }
    if (wishlistedIds.has(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ productId: product.id });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
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
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-square w-full bg-[#f3f3f3] rounded-sm animate-pulse" />
                <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse px-1" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {(data?.products ?? []).map((product) => {
              const mainImage = product.primaryImageUrl ?? "";
              const hoverImage = product.secondaryImageUrl ?? undefined;
              const isWishlisted = wishlistedIds.has(product.id);

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
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="absolute inset-0 object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-105"
                        />
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => handleWishlistToggle(e, product)}
                        className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs border border-zinc-100 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer z-10"
                        aria-label="Add to Wishlist"
                      >
                        <FiHeart
                          size={14}
                          className={`transition-all duration-300 stroke-[1.8] ${
                            isWishlisted
                              ? "fill-black text-black scale-110"
                              : "text-zinc-700 hover:text-black"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col px-1">
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
    </section>
  );
}
