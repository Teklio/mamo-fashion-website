import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import HouseOfMamo from "@/components/HouseOfMamo";
import MamoWorld from "@/components/MamoWorld";
import BlueLadyBanner from "@/components/BlueLadyBanner";

export default function Home() {
  return (
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
  );
}
