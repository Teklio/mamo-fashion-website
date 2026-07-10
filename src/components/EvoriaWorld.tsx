"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EvoriaWorld() {
  return (
    <section className="w-full py-16 md:py-24 px-8 md:px-16 bg-white text-zinc-950 border-t border-zinc-100">
      <div className="max-w-400 mx-auto">
        {/* Title */}
        <motion.h2
          className="text-zinc-900 text-3xl md:text-5xl font-serif tracking-wide font-normal mb-10 md:mb-14 text-center md:text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          The EVORIA FASHION World
        </motion.h2>

        {/* Collage Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12 md:mb-16 items-stretch">

          {/* Left Column: Loop Video (Col span 2) */}
          <motion.div
            className="lg:col-span-2 relative w-full min-h-112.5 lg:min-h-150 xl:min-h-162.5 rounded-[20px] overflow-hidden bg-zinc-50 shadow-xs group"
            initial={{ opacity: 0, x: -40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            
            <Image
                src="/images/naseeb-3.jpg"
                alt="Evoria Lifestyle"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-103"
            />
        
            {/* Subtle premium gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
          </motion.div>

          {/* Right Column: Collection of Images (Col span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6 justify-between">

            {/* Top Widescreen Image */}
            <motion.div
              className="relative w-full aspect-16/10 overflow-hidden rounded-[20px] shadow-xs bg-zinc-50 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <Image
                src="/images/banner-dress.jpg"
                alt="EVORIA FASHION Footwear Detail"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-103"
              />
            </motion.div>

            {/* Bottom Two Equal Columns Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left Portrait Image */}
              <motion.div
                className="relative aspect-3/4 overflow-hidden rounded-[20px] shadow-xs bg-zinc-50 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <Image
                  src="/images/naseeb-1.jpg"
                  alt="EVORIA FASHION Beach Lifestyle"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </motion.div>

              {/* Right Portrait Image */}
              <motion.div
                className="relative aspect-3/4 overflow-hidden rounded-[20px] shadow-xs bg-zinc-50 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <Image
                  src="/images/nasseb-2.jpg"
                  alt="EVORIA FASHION Fashion Green Coordinates"
                  fill
                  sizes="(max-width: 1024px) 50vw, 30vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-103"
                />
              </motion.div>
            </div>

          </div>

        </div>

        {/* Action Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center px-11 py-3.5 border border-zinc-800 rounded-xl text-[10px] md:text-xs tracking-[0.2em] text-zinc-900 font-sans font-medium bg-white hover:bg-zinc-950 hover:text-white transition-colors duration-400 uppercase"
          >
            ENTER THE WORLD
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
