"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <div className="w-full bg-white text-zinc-950 mt-0 md:mt-10 pt-32 md:pt-40 pb-20 px-8 md:px-16">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Story Section */}
        <motion.span
          className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          OUR STORY
        </motion.span>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-wide font-normal mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          The House Of SORIN
        </motion.h1>

        <motion.p
          className="text-zinc-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-24 md:mb-32"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          Born on the sun kissed shores of Dubai, SORIN redefines coastal
          luxury through refined craftsmanship and effortless allure. Each
          creation embodies the art of timeless elegance, from the
          signature rope knot details to silhouettes that whisper of sea
          breeze and sophistication. Designed for those who follow the call
          of the sun, SORIN is more than a brand, it&apos;s a lifestyle, a state of
          mind, and a tribute to the art of living beneath the golden
          light. Your endless escape. Take the sunshine with you.
        </motion.p>
      </div>

      <div className="max-w-400 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Craftsmanship Image */}
        <motion.div
          className="relative w-full aspect-square md:aspect-4/5 rounded-3xl overflow-hidden shadow-xs"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Image
            src="/assets/about/1.jpg"
            alt="SORIN Craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Craftsmanship Text */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-6">
            CRAFTSMANSHIP
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wide font-normal mb-8 leading-tight">
            Fifty pairs. <br className="hidden lg:block" />
            Numbered by hand.
          </h2>
          <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
            Each SORIN piece is woven by master artisans across a slow, deliberate
            week. We honor the hands that make them, limiting every collection to
            fifty numbered pairs, each carrying the imperfect signature of its maker.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
