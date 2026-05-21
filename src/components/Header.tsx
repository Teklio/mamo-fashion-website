"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiUser, FiShoppingBag, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "@/context/CartContext";

export default function Header({ theme = "dark" }: { theme?: "dark" | "light" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

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
    { name: "HOUSE OF SORIN", href: "/about" },
    { name: "CONTACT US", href: "/contact" },
  ];

  const isDarkText = isScrolled || theme === "light";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-white/85 backdrop-blur-md border-b border-black/5 py-4 text-black shadow-xs"
            : `bg-transparent pt-10 pb-5 ${theme === "light" ? "text-black" : "text-white"}`
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-50 flex items-center">
            <Image
              src="/assets/Home/logo.png"
              alt="SORIN Logo"
              width={180}
              height={52}
              priority
              className={`h-9 md:h-18 w-auto object-contain transition-all duration-500 ${
                isDarkText ? "brightness-0" : "brightness-100"
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs tracking-[0.2em] transition-colors duration-300 font-sans font-medium relative py-1 group ${
                  isDarkText ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                  isDarkText ? "bg-black" : "bg-white"
                }`} />
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className={`hidden md:flex items-center space-x-6 ${isDarkText ? "text-black/80" : "text-white/80"}`}>
            <Link
              href="/wishlist"
              className={`transition-colors duration-300 p-2 relative group ${isDarkText ? "hover:text-black" : "hover:text-white"}`}
              aria-label="Wishlist"
            >
              <FiHeart size={18} className="stroke-[1.5]" />
              <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ${
                isDarkText ? "bg-black" : "bg-white"
              }`} />
            </Link>
            <Link
              href="/account"
              className={`transition-colors duration-300 p-2 ${isScrolled ? "hover:text-black" : "hover:text-white"}`}
              aria-label="Account"
            >
              <FiUser size={18} className="stroke-[1.5]" />
            </Link>
            <Link
              href="/cart"
              className={`transition-colors duration-300 p-2 relative flex items-center ${isScrolled ? "hover:text-black" : "hover:text-white"}`}
              aria-label="Cart"
            >
              <FiShoppingBag size={18} className="stroke-[1.5]" />
              <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-95 border transition-all duration-300 ${
                isScrolled
                  ? "bg-black text-white border-black/10"
                  : "bg-white text-black border-black/10"
              }`}>
                {cartCount}
              </span>
            </Link>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex md:hidden items-center space-x-4">
            <Link
              href="/cart"
              className={`transition-colors p-2 relative ${isScrolled ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"}`}
              aria-label="Cart"
            >
              <FiShoppingBag size={18} className="stroke-[1.5]" />
              <span className={`absolute top-1.5 right-1.5 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center scale-95 transition-all duration-300 ${
                isScrolled
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}>
                {cartCount}
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 relative z-50 cursor-pointer focus:outline-none ${isScrolled ? "text-black" : "text-white"}`}
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
        className={`fixed inset-0 bg-[#0d0d0d] z-40 flex flex-col justify-between px-8 pt-36 pb-12 md:hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isMobileMenuOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        {/* Ambient Background Gradient for luxury feel */}
        <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

        {/* Menu Links */}
        <nav className="relative z-10 flex flex-col space-y-6">
          {navLinks.map((link, index) => (
            <div
              key={link.name}
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isMobileMenuOpen
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
                <span className="text-3xl tracking-widest text-white font-serif font-light transition-all duration-300 group-hover:pl-2">
                  {link.name}
                </span>
                <span className="text-[9px] tracking-[0.2em] text-white/40 mt-1 uppercase font-sans font-medium">
                  {link.name === "HOME"
                    ? "The Beginning"
                    : link.name === "SHOP"
                    ? "Browse Collection"
                    : link.name === "HOUSE OF SORIN"
                    ? "Our Story"
                    : "Get In Touch"}
                </span>
              </Link>
            </div>
          ))}
        </nav>

        {/* Extra Menu Footer */}
        <div
          className={`relative z-10 space-y-8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isMobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "320ms" : "0ms" }}
        >
          {/* Profile / Wishlist links */}
          <div className="flex items-center space-x-8 pt-6 border-t border-white/5 text-white/50 text-xs tracking-wider">
            <Link
              href="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-white transition-colors flex items-center space-x-2"
            >
              <FiHeart size={16} />
              <span>WISHLIST</span>
            </Link>
            <Link
              href="/account"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-white transition-colors flex items-center space-x-2"
            >
              <FiUser size={16} />
              <span>ACCOUNT</span>
            </Link>
          </div>

          {/* Luxury Brand Socials / Details */}
          <div className="flex flex-col space-y-2 text-[10px] tracking-[0.15em] text-white/60 font-sans">
            <span>© {new Date().getFullYear()} HOUSE OF SORIN</span>
            <span>INSTAGRAM / PINTEREST / JOURNAL</span>
          </div>
        </div>
      </div>
    </>
  );
}
