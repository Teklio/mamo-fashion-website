import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ppFragmentSerif, ppFragmentText } from "@/lib/font";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SORIN | Endless Escape",
  description: "Discover the luxury collection of HOUSE OF SORIN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ppFragmentSerif.variable} ${ppFragmentText.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <CartProvider>
          <WishlistProvider>
            {children}
            <Footer />
            <Toaster />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}

