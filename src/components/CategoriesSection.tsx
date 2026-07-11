"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CategoriesSection() {
  const categories = [
    {
      title: "Women's Collection",
      category: "Women",
      image: "/images/womens_coord_set_1783762105299.png",
    },
    {
      title: "Kids' Collection",
      category: "Kids",
      image: "/images/kids_daily_wear_1783762129724.png",
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 px-8 md:px-16 bg-white text-zinc-950">
      <div className="max-w-400 mx-auto">
        <motion.div
          className="flex justify-between items-center sm:items-end gap-4 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <h2 className="text-zinc-900 text-2xl sm:text-3xl md:text-5xl font-serif tracking-wide font-normal whitespace-nowrap">
            Shop by Category
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
            >
              <Link 
                href={`/shop?category=${cat.category}`}
                className="group block relative w-full aspect-[4/3] md:aspect-[3/2] lg:aspect-[21/10] overflow-hidden rounded-2xl shadow-xs"
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-3xl md:text-4xl font-serif tracking-wide drop-shadow-md">
                    {cat.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
