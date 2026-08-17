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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: "/fevicon.png",
  },
  title: {
    template: "%s | Mamo Fashion",
    default: "Mamo Fashion | Premium Women's Ethnic Wear & Dresses",
  },
  description: "Discover the premium collection of churidars, ethnic dresses, kurtis and more at Mamo Fashion. Experience quality, style, and tradition crafted for the modern woman.",
  keywords: ["ethnic wear", "women's clothing", "churidars", "kurtis", "Mamo Fashion", "dresses", "traditional clothing"],
  openGraph: {
    title: "Mamo Fashion | Premium Women's Ethnic Wear",
    description: "Discover the premium collection of churidars, ethnic dresses, kurtis and more at Mamo Fashion.",
    url: "/",
    siteName: "Mamo Fashion",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mamo Fashion | Premium Women's Ethnic Wear",
    description: "Discover the premium collection of churidars, ethnic dresses, kurtis and more at Mamo Fashion.",
  },
};

import StoreProvider from "@/store/provider";
import QueryProvider from "@/providers/QueryProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import NavigationLoader from "@/components/NavigationLoader";

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
            {/* Inner-page loader — fires on every navigation except home */}
            <NavigationLoader />
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
