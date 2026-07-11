"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutCTA() {
  return (
    <div className="w-full py-24 flex flex-col items-center justify-center text-center px-6 border-t border-white/10">
      <motion.h2 
        className="text-3xl md:text-5xl font-serif font-light mb-8 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        Experience the Collection
      </motion.h2>
      <motion.div 
        className="flex flex-col sm:flex-row gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
      >
        <Link 
          href="/shop" 
          className="px-10 py-4 bg-white text-black text-xs tracking-[0.2em] font-sans font-semibold uppercase rounded-full hover:bg-zinc-200 transition-colors"
        >
          Shop Now
        </Link>
        <Link 
          href="/contact-us" 
          className="px-10 py-4 bg-transparent border border-white/30 text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase rounded-full hover:bg-white/10 transition-colors"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
}
