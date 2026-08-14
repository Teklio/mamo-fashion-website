"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HouseOfMamo() {
  return (
    <section className="w-full py-16 px-4 md:px-16 bg-white text-zinc-950">
      <div className="max-w-400 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side: Sandal Beach Image */}
        <motion.div
          className="relative w-full aspect-square md:aspect-4/5 lg:aspect-3/4 overflow-hidden rounded-3xl shadow-xs"
          initial={{ opacity: 0, x: -40, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Image
            src="/images/grid-2.jpg"
            alt="Handcrafted ethnic wear by Mamo Fashion, inspired by the sun-kissed shores of Kerala"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover transition-transform duration-700 hover:scale-103"
          />
        </motion.div>

        {/* Right Side: Editorial Content */}
        <div className="flex flex-col items-center justify-center text-center px-2 lg:px-8">
          <motion.h2
            className="text-zinc-900 text-3xl md:text-5xl font-serif tracking-wide font-normal mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            The House Of MAMO FASHION
          </motion.h2>

          <motion.p
            className="text-zinc-500 text-sm md:text-base font-sans font-light leading-loose tracking-wide mb-10 max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            Born on the sun kissed shores of Kerala, MAMO FASHION redefines coastal luxury
            through timeless craftsmanship and effortless elegance. Inspired by the sea
            breeze and golden light, each piece is designed for those who follow the sun.
            More than a brand, MAMO FASHION is a lifestyle your endless escape. Take the
            sunshine with you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <Link
              href="/shop"
              className="group relative inline-flex items-center justify-center px-10 py-4 border border-zinc-800 rounded-xl text-[10px] md:text-xs tracking-[0.25em] text-zinc-900 font-sans font-semibold bg-white hover:bg-zinc-950 hover:text-white transition-all duration-400"
            >
              VIEW COLLECTIONS
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
