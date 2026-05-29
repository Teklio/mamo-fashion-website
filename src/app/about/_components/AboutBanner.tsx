"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutBanner() {
  return (
    <div className="w-full bg-white px-6 md:px-12 pb-20 md:pb-32">
      <motion.div 
        className="relative w-full max-w-7xl mx-auto aspect-4/3 sm:aspect-video md:aspect-2.5/1 lg:aspect-3/1 flex flex-col items-center justify-center overflow-hidden"
        style={{ border: "1px solid #DED6CD" }}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/assets/about/banner.jpg"
            alt="SORIN Endless Escape"
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-center"
          />
          {/* Requested specific gradient/color overlay */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{ backgroundColor: "#FFFFFFC7" }}
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-6 flex flex-col items-center">
          <h2 className="text-[#3A332C] text-3xl md:text-5xl lg:text-6xl font-serif tracking-wide font-normal mb-4 leading-tight">
            Enter the Endless Escape.
          </h2>
          <p className="text-[#4A433C] text-[11px] md:text-sm tracking-wide font-sans mb-8">
            A quiet release of fifty pairs, numbered by hand.
          </p>
          <Link
            href="/shop"
            className="group relative inline-flex items-center justify-center px-10 py-3.5 border border-[#3A332C] rounded-lg text-[9px] md:text-[10px] tracking-[0.2em] text-[#3A332C] font-sans font-semibold bg-transparent hover:bg-[#3A332C] hover:text-white transition-all duration-400 uppercase"
          >
            VIEW COLLECTIONS
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
