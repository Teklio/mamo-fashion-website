"use client";

import { motion } from "framer-motion";

export default function AboutFounder() {
  return (
    <div className="w-full bg-zinc-950 text-white pb-24 md:pb-40 pt-16 md:pt-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Founder Quote */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center px-6">
        <motion.span
          className="text-[10px] tracking-[0.4em] text-amber-300 font-sans font-semibold uppercase mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          A NOTE FROM THE FOUNDER
        </motion.span>

        <motion.h3
          className="text-3xl md:text-4xl lg:text-5xl leading-[1.6] md:leading-[1.8] font-serif text-white mb-14 font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="text-amber-300/40 text-6xl md:text-8xl leading-none absolute -top-8 -left-4 md:-left-12 -z-10 font-serif">&ldquo;</span>
          MAMO FASHION is not a brand. It is a way of moving <br className="hidden md:block" />
          through the world unhurried, sun warmed, in <br className="hidden md:block" />
          love with the long way home.
          <span className="text-amber-300/40 text-6xl md:text-8xl leading-none absolute -bottom-12 -right-4 md:-right-12 -z-10 font-serif">&rdquo;</span>
        </motion.h3>

        <motion.div
          className="flex flex-col items-center gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="w-px h-16 bg-gradient-to-b from-amber-300 to-transparent"></div>
          <span className="text-[10px] tracking-[0.3em] text-zinc-400 font-sans uppercase">
            THE FOUNDER
          </span>
        </motion.div>
      </div>
    </div>
  );
}
