import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesSection from "@/components/CategoriesSection";
import HouseOfEvoria from "@/components/HouseOfEvoria";
import EvoriaWorld from "@/components/EvoriaWorld";
import BlueLadyBanner from "@/components/BlueLadyBanner";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950">
      <Header />
      <Hero />
      <div className="relative z-10 bg-white text-zinc-950">
        <CategoriesSection />
        <FeaturedProducts />
        <HouseOfEvoria />
        <EvoriaWorld />
        <BlueLadyBanner />
      </div>
    </main>
  );
}
