import Header from "@/components/Header";
import AboutHero from "@/app/about/_components/AboutHero";
import AboutFounder from "@/app/about/_components/AboutFounder";
import AboutCTA from "@/app/about/_components/AboutCTA";
// import AboutBanner from "@/app/about/_components/AboutBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story | The House of Mamo Fashion",
  description: "Discover the inspiring story, craftsmanship, and legacy behind The House of Mamo Fashion. Explore our journey in creating premium ethnic wear for women.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 overflow-x-hidden text-white">
      <Header theme="dark" />
      <div className="relative z-10 bg-transparent text-white">
        <AboutHero />
        <AboutFounder />
        <AboutCTA />
        {/* <AboutBanner /> */}
      </div>
    </main>
  );
}
