import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import HouseOfMamo from "@/components/HouseOfMamo";
import MamoWorld from "@/components/MamoWorld";
import BlueLadyBanner from "@/components/BlueLadyBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mamo Fashion | Premium Women's Ethnic Wear & Dresses",
  description: "Discover the premium collection of churidars, ethnic dresses, kurtis and more at Mamo Fashion. Experience quality, style, and tradition crafted for the modern woman.",
  openGraph: {
    title: "Mamo Fashion | Premium Women's Ethnic Wear",
    description: "Shop the finest ethnic wear for women – churidars, kurtis, dresses and more. Born in Kerala, loved across India.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950">
        <Header />
        <Hero />
        <div className="relative z-10 bg-white text-zinc-950">
          <CategoriesSection />
          <FeaturedProducts />
          <HouseOfMamo />
          <MamoWorld />
          <BlueLadyBanner />
        </div>
      </main>
    </>
  );
}

