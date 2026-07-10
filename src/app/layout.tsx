import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";

const globalFontSans = Outfit({
  variable: "--font-inter",
  subsets: ["latin"],
});

const globalFontSerif = Outfit({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/fevicon.jpg",
  },
  title: "Evoria Fashion | Girls & Women's Ethnic Wear",
  description: "Discover the premium collection of churidars, ethnic dresses and more at Evoria Fashion.",
};

import StoreProvider from "@/store/provider";
import QueryProvider from "@/providers/QueryProvider";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${globalFontSans.variable} ${globalFontSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <StoreProvider>
          <QueryProvider>
            {children}
            <Footer />
            <Toaster />
            <WhatsAppButton />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
