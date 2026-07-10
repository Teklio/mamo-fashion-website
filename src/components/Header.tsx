"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export default function Header({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartCount = useSelector((s: RootState) => s.auth.cartCount);
  const wishlistCount = useSelector((s: RootState) => s.auth.wishlistCount);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "ABOUT EVORIA", href: "/about" },
    { name: "CONTACT US", href: "/contact-us" },
  ];

  const mobileNavLinks = [
    ...navLinks,
    { name: "ACCOUNT", href: "/account" },
  ];

  const isDarkText = isScrolled || (theme === "light" && !isMobileMenuOpen);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled
          ? "bg-white/85 backdrop-blur-md border-b border-black/5 py-4 text-black shadow-xs"
          : `bg-transparent pt-10 pb-5 ${theme === "light" ? "text-black" : "text-white"}`
          }`}
      >
        <div className="max-w-400 mx-auto px-6 md:px-8 lg:px-16 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center">
            <span className={`text-xl md:text-2xl font-serif tracking-widest font-bold transition-all duration-500 ${isDarkText ? "text-black" : "text-white"}`}>
              EVORIA FASHION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center md:space-x-4 lg:space-x-8 xl:space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] lg:text-xs tracking-widest lg:tracking-[0.2em] whitespace-nowrap transition-colors duration-300 font-sans font-medium relative py-1 group ${isDarkText ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"
                  }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isDarkText ? "bg-black" : "bg-white"
                  }`} />
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={`hidden md:flex items-center md:space-x-3 lg:space-x-6 ${isDarkText ? "text-black/80" : "text-white/80"}`}>
            <Link
              href="/wishlist"
              className={`transition-colors duration-300 md:p-1 lg:p-2 relative flex items-center ${isDarkText ? "hover:text-black" : "hover:text-white"}`}
              aria-label="Wishlist"
            >
              <FiHeart size={18} className="stroke-[1.5]" />
              <span className={`absolute top-0 right-0 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-95 border transition-all duration-300 ${isDarkText
                ? "bg-black text-white border-black/10"
                : "bg-white text-black border-black/10"
                }`}>
                {wishlistCount}
              </span>
            </Link>
            <Link
              href="/account"
              className={`transition-colors duration-300 md:p-1 lg:p-2 ${isDarkText ? "hover:text-black" : "hover:text-white"}`}
              aria-label="Account"
            >
              <FiUser size={18} className="stroke-[1.5]" />
            </Link>
            <Link
              href="/cart"
              className={`transition-colors duration-300 md:p-1 lg:p-2 relative flex items-center ${isDarkText ? "hover:text-black" : "hover:text-white"}`}
              aria-label="Cart"
            >
              <FiShoppingBag size={18} className="stroke-[1.5]" />
              <span className={`absolute top-0 right-0 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-95 border transition-all duration-300 ${isDarkText
                ? "bg-black text-white border-black/10"
                : "bg-white text-black border-black/10"
                }`}>
                {cartCount}
              </span>
            </Link>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/wishlist"
              className={`transition-colors p-2 relative ${isDarkText ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}`}
              aria-label="Wishlist"
            >
              <FiHeart size={18} className="stroke-[1.5]" />
              <span className={`absolute top-0 right-0 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-95 transition-all duration-300 ${isDarkText
                ? "bg-black text-white"
                : "bg-white text-black"
                }`}>
                {wishlistCount}
              </span>
            </Link>
            <Link
              href="/cart"
              className={`transition-colors p-2 relative ${isDarkText ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}`}
              aria-label="Cart"
            >
              <FiShoppingBag size={18} className="stroke-[1.5]" />
              <span className={`absolute top-0 right-0 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-95 transition-all duration-300 ${isDarkText
                ? "bg-black text-white"
                : "bg-white text-black"
                }`}>
                {cartCount}
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 relative z-50 cursor-pointer focus:outline-none ${isDarkText ? "text-black" : "text-white"}`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <FiX size={24} className="stroke-[1.5] transition-transform duration-300 hover:rotate-90" />
              ) : (
                <FiMenu size={24} className="stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Overlay (Pure CSS/React Transitions) */}
      <div
        className={`fixed inset-0 bg-[#0d0d0d] z-40 flex flex-col justify-between px-8 pt-36 pb-12 md:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 translate-x-full pointer-events-none"
          }`}
      >
        {/* Ambient Background Gradient for luxury feel */}
        <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

        {/* Menu Links */}
        <nav className="relative z-10 flex flex-col space-y-6">
          {mobileNavLinks.map((link, index) => (
            <div
              key={link.name}
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMobileMenuOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
                }`}
              style={{ transitionDelay: isMobileMenuOpen ? `${index * 80}ms` : "0ms" }}
            >
              <Link
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="group flex flex-col py-2"
              >
                <span className="text-xl tracking-widest text-white font-serif font-light transition-all duration-300 group-hover:pl-2">
                  {link.name}
                </span>
              </Link>
            </div>
          ))}
        </nav>

      </div>
    </>
  );
}
