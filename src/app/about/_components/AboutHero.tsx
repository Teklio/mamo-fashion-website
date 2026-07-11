"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <div className="w-full bg-zinc-950 text-white">
      {/* Immersive Hero Section */}
      <div className="relative w-full h-[80vh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax-like overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banner-foot.jpg"
            alt="Mamo Lifestyle"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-zinc-950/60 to-zinc-950"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center px-6 mt-20">
          <motion.span
            className="text-[10px] tracking-[0.4em] text-amber-300 font-sans font-semibold uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            OUR STORY
          </motion.span>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="mb-8 relative flex justify-center items-center"
          >
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-[2] pointer-events-none"></div>
            <Image
              src="/logo/mamo-logo.png"
              alt="Mamo Fashion Logo"
              width={400}
              height={100}
              className="relative z-10 object-contain h-20 md:h-28 lg:h-32 w-auto brightness-0 invert drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              priority
            />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-8xl font-serif tracking-wide font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            The House Of MAMO
          </motion.h1>

          <motion.p
            className="text-zinc-300 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
          >
            Born on the sun kissed shores of Kerala, MAMO FASHION redefines coastal luxury through refined craftsmanship and effortless allure. Each creation embodies the art of timeless elegance, from signature details to silhouettes that whisper of sea breeze and sophistication.
          </motion.p>
        </div>
      </div>

      {/* Craftsmanship Section */}
      <div className="max-w-6xl mx-auto py-24 md:py-32 px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Craftsmanship Text */}
        <motion.div
          className="flex flex-col justify-center order-2 lg:order-1"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span className="flex items-center gap-4 text-[10px] tracking-[0.3em] text-amber-300 font-sans font-semibold uppercase mb-8">
            <span className="w-12 h-px bg-amber-300/50"></span>
            CRAFTSMANSHIP
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-light mb-8 leading-tight text-white">
            Woven by hand. <br />
            Curated for you.
          </h2>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-light">
            Each MAMO FASHION piece is woven by master artisans across a slow, deliberate week. We honor the hands that make them, creating exclusive collections that carry the imperfect, beautiful signature of their maker.
          </p>
        </motion.div>

        {/* Craftsmanship Image */}
        <motion.div
          className="relative w-full aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] order-1 lg:order-2 group"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-40"></div>
          <Image
            src="/images/grid-1.jpg"
            alt="MAMO FASHION Craftsmanship"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
        </motion.div>
      </div>
    </div>
  );
}
