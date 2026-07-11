"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BlueLadyBanner() {
  return (
    <section 
      className="relative w-full aspect-video min-h-100 flex items-center justify-center overflow-hidden" 
      style={{ background: "#FFFFFF" }}
    >
      {/* Background Image Container */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0, scale: 1.02 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <Image
          src="/images/banner-foot.jpg"
          alt="MAMO FASHION Editorial Fashion"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Full linear gradient overlay over the entire background to improve readability */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: "linear-gradient(0deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.03) 100%)" }}
        />
      </motion.div>

      {/* Content Overlay */}
      <motion.div 
        className="relative z-10 mt-0 md:mt-10 text-center px-6 flex flex-col items-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <h2 className="text-zinc-900 text-3xl md:text-5xl lg:text-6xl font-serif tracking-wide font-normal mb-4 md:mb-6 leading-tight drop-shadow-sm">
          Enter The Endless Escape
        </h2>
        <p className="text-zinc-900 text-xs md:text-lg tracking-wide font-sans mb-8 drop-shadow-sm">
          A quiet release of fifty pairs, numbered by hand.
        </p>
        <Link
          href="/shop"
          className="group relative inline-flex items-center justify-center px-10 py-3 md:py-3.5 border border-zinc-900 rounded-xl text-[10px] md:text-xs tracking-[0.2em] text-zinc-900 font-sans font-medium bg-transparent hover:bg-zinc-900 hover:text-white transition-all duration-400 uppercase backdrop-blur-sm"
        >
          SHOP NOW
        </Link>
      </motion.div>
    </section>
  );
}


