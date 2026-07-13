"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGetProducts } from "@/services/product.service";
import ProductCard from "@/components/ProductCard";

export default function FeaturedProducts({
  title = "Signature Styles",
  hideViewAll = false,
  subCategoryId,
}: {
  title?: string;
  hideViewAll?: boolean;
  subCategoryId?: string;
} = {}) {
  const { data } = useGetProducts({ limit: 4, subCategoryId });
  const displayProducts = (data?.variants ?? []).slice(0, 4);

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
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cardVariants={cardVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
