import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ppFragmentSerif, ppFragmentText } from "@/lib/font";
import "./globals.css";
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
  icons: {
    icon: "/fevicon.jpg",
  },
  title: "SORIN | Endless Escape",
  description: "Discover the luxury collection of HOUSE OF SORIN.",
};

import StoreProvider from "@/store/provider";
import QueryProvider from "@/providers/QueryProvider";

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
        <StoreProvider>
          <QueryProvider>
            {children}
            <Footer />
            <Toaster />
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
