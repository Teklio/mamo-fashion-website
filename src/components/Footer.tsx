"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white pt-10 md:pt-20 pb-8 px-8 md:px-16 border-t border-zinc-100">
      <div className="max-w-400 mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-10 md:gap-16 mb-10 md:mb-20">

          {/* Brand / Logo (Left) */}
          <div className="w-full lg:w-[30%] flex flex-col justify-start items-center lg:items-start mb-12 lg:mb-0">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/Home/logo.png"
                alt="SORIN Logo"
                width={300}
                height={90}
                className="h-16 md:h-22 w-auto object-contain brightness-0"
              />
            </Link>
          </div>

          {/* Navigation Columns (Right) */}
          <div className="lg:w-[70%] flex flex-col items-center md:flex-row justify-between md:items-start w-full gap-y-12 gap-x-8">

            {/* The House */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-8 flex items-center justify-center md:justify-start gap-2">
                <span className="w-3 h-px bg-zinc-300 hidden md:block"></span>
                THE HOUSE
              </h4>
              <ul className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
                <li>
                  <Link href="/about" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    The House Of Sorin
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href="/craftsmanship" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    Craftsmanship
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-8 flex items-center justify-center md:justify-start gap-2">
                <span className="w-3 h-px bg-zinc-300 hidden md:block"></span>
                CUSTOMER CARE
              </h4>
              <ul className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
                <li>
                  <Link href="/contact" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    Shipping & Returns
                  </Link>
                </li>
                <li>
                  <Link href="/contact#faq" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h4 className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase mb-8 flex items-center justify-center md:justify-start gap-2">
                <span className="w-3 h-px bg-zinc-300 hidden md:block"></span>
                SOCIAL
              </h4>
              <ul className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    TikTok
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-950 text-[13px] md:text-sm font-serif transition-colors">
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-zinc-400 font-sans tracking-widest uppercase">
            &copy; 2026 SORIN. ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center space-x-4 text-[10px] text-zinc-400 font-sans tracking-widest uppercase">
            <Link href="/privacy" className="hover:text-zinc-950 transition-colors">
              PRIVACY
            </Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-zinc-950 transition-colors">
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
