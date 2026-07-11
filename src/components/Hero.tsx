"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    image: "/images/banner-3.jpg",
    tag: "Premium Ethnic",
    title: "Wear Your\nStory",
    subtitle: "From festive churidars to casual kurtis — style that speaks",
    cta: "VIEW LOOKBOOK",
    href: "/shop",
    overlay: "from-black/65 via-black/25 to-black/65",
    accent: "bg-purple-400",
  },
  {
    id: 2,
    image: "/images/hero_banner_model_bw.png",
    tag: "New Arrivals",
    title: "Crafted for\nEvery Occasion",
    subtitle: "Discover our exclusive churidar & ethnic wear collection",
    cta: "SHOP NEW ARRIVALS",
    href: "/shop",
    overlay: "from-black/70 via-black/30 to-black/60",
    accent: "bg-gray-300",
  },
  {
    id: 3,
    image: "/images/hero_banner_woman_shopping.png",
    tag: "Summer Collection",
    title: "Elegance in\nEvery Thread",
    subtitle: "Handcrafted dresses that celebrate the spirit of Indian fashion",
    cta: "EXPLORE COLLECTION",
    href: "/shop",
    overlay: "from-black/60 via-black/20 to-black/70",
    accent: "bg-amber-400",
  }
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12 + 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  // Auto-play every 5 seconds
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full h-[75vh] md:h-screen overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-linear-to-b ${slide.overlay}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto">
        {/* Tag */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tag-${current}`}
            custom={0}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-3 mb-6"
          >
            <span className={`w-6 h-px ${slide.accent}`} />
            <span className="text-white/80 text-[10px] tracking-[0.4em] uppercase font-sans">
              {slide.tag}
            </span>
            <span className={`w-6 h-px ${slide.accent}`} />
          </motion.div>
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${current}`}
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-[1.05] mb-6 select-none whitespace-pre-line"
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${current}`}
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-white/70 text-sm md:text-base font-sans tracking-wide max-w-md mb-10 select-none"
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cta-${current}`}
            custom={3}
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              href={slide.href}
              className="group relative inline-flex rounded-xl items-center justify-center px-12 py-4 border border-white/40 hover:border-white text-[10px] md:text-xs tracking-[0.3em] text-white font-medium bg-black/10 backdrop-blur-sm transition-all duration-500 overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-white scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                {slide.cta}
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-500 rounded-full cursor-pointer ${
              i === current
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Side Arrows */}
      <button
        onClick={() => { setDirection(-1); setCurrent((c) => (c - 1 + slides.length) % slides.length); }}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-white hover:bg-black/40 transition-all duration-300 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-white/30 bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:border-white hover:bg-black/40 transition-all duration-300 cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
          <motion.div
            key={current}
            className="h-full bg-white/60"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      )}
    </section>
  );
}
