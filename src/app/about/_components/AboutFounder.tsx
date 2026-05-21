"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutFounder() {
  return (
    <div className="w-full bg-white text-zinc-950 pb-20 md:pb-32 pt-16 md:pt-24">
      {/* Two Image Gallery (Full Width) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        <motion.div
          className="relative w-full aspect-square md:aspect-auto md:h-[70vh] lg:h-[90vh]"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Image
            src="/assets/about/1.jpg"
            alt="SORIN Sandals Close-up"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </motion.div>
        <motion.div
          className="relative w-full aspect-square md:aspect-auto md:h-[70vh] lg:h-[90vh]"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Image
            src="/assets/about/2.jpg"
            alt="SORIN Lifestyle Beach Chair"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </motion.div>
      </div>

      {/* Founder Quote */}
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mt-10 px-6">
        <motion.span
          className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          A NOTE FROM THE FOUNDER
        </motion.span>

        <motion.h3
          className="text-2xl md:text-3xl lg:text-[2rem] leading-[1.6] md:leading-[1.8] font-serif text-zinc-800 mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          &ldquo;SORIN is not a brand. It is a way of moving <br className="hidden md:block" />
          through the world unhurried, sun warmed, in <br className="hidden md:block" />
          love with the long way home.&rdquo;
        </motion.h3>

        <motion.div
          className="flex items-center text-[10px] tracking-[0.2em] text-zinc-400 font-sans uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="w-6 h-px bg-zinc-300 mr-4"></span>
          THE FOUNDER
        </motion.div>
      </div>
    </div>
  );
}
