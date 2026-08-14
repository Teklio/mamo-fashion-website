"use client";

import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-white pt-16 md:pt-24 pb-8 px-4 md:px-16 border-t border-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-12 md:gap-16 mb-16 md:mb-24">

          {/* Brand & Model Image (Left) */}
          <div className="w-full lg:w-[35%] flex flex-col justify-start items-start">
            <Link href="/" className="inline-block mb-8">
              <Image
                src="/logo/mamo-logo.png"
                alt="Mamo Fashion"
                width={200}
                height={100}
                className="object-contain h-10 md:h-16 w-auto brightness-0 invert"
              />
            </Link>
            <div className="relative w-full h-38 rounded-2xl overflow-hidden shadow-lg group">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <Image
                src="/images/hero_banner.png"
                alt="Mamo Fashion Model"
                fill
                className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Navigation Columns (Right) */}
          <div className="lg:w-[60%] grid grid-cols-2 md:flex md:flex-row md:justify-between md:items-start w-full gap-y-12 gap-x-8 pt-4">
            {/* The House */}
            <div className="flex flex-col items-start">
              <h4 className="text-[10px] tracking-[0.2em] text-amber-300 font-sans font-semibold uppercase mb-8 flex items-center justify-start gap-2">
                <span className="w-3 h-px bg-amber-300 hidden md:block"></span>
                THE HOUSE
              </h4>
              <ul className="flex flex-col space-y-5 items-start">
                <li>
                  <Link
                    href="/shop"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    Our Shop 
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    About Mamo
                  </Link>
                </li>
                
                <li>
                  <Link
                    href="/shop?category=Kids"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    Kids Collection
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shop?category=Women"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    Women Collection 
                  </Link>
                </li>
            
              </ul>
            </div>

            {/* Customer Care */}
            <div className="flex flex-col items-start">
              <h4 className="text-[10px] tracking-[0.2em] text-amber-300 font-sans font-semibold uppercase mb-8 flex items-center justify-start gap-2">
                <span className="w-3 h-px bg-amber-300 hidden md:block"></span>
                CUSTOMER CARE
              </h4>
              <ul className="flex flex-col space-y-5 items-start">
                <li>
                  <Link
                    href="/contact-us"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-policy"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us?scrollTo=faq"
                    className="text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="flex flex-col items-start">
              <h4 className="text-[10px] tracking-[0.2em] text-amber-300 font-sans font-semibold uppercase mb-8 flex items-center justify-start gap-2">
                <span className="w-3 h-px bg-amber-300 hidden md:block"></span>
                SOCIAL
              </h4>
              <ul className="flex flex-col space-y-5 items-start">
                <li>
                  <a
                    href="https://www.instagram.com/mamo_fashion._/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    <FiInstagram size={16} /> Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/mamo_fashion"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    <FiTwitter size={16} /> Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/919567530926"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    <FaWhatsapp size={16} /> WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-zinc-400 hover:text-white text-[13px] md:text-sm font-serif transition-colors"
                  >
                    <FiFacebook size={16} /> Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-500 font-sans tracking-widest uppercase">
            &copy; 2026 MAMO FASHION. ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center space-x-4 text-[10px] text-zinc-500 font-sans tracking-widest uppercase">
            <Link
              href="/privacy-policy"
              className="hover:text-zinc-300 transition-colors"
            >
              PRIVACY
            </Link>
            <span>&middot;</span>
            <Link
              href="/terms-and-conditions"
              className="hover:text-zinc-300 transition-colors"
            >
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
