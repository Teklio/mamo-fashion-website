import Header from "@/components/Header";
import AboutHero from "@/app/about/_components/AboutHero";
import AboutFounder from "@/app/about/_components/AboutFounder";
// import AboutBanner from "@/app/about/_components/AboutBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The House of EVORIA FASHION | Our Story",
  description: "Discover the story and craftsmanship behind HOUSE OF EVORIA FASHION.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-zinc-950 overflow-x-hidden text-white">
      <Header theme="dark" />
      <div className="relative z-10 bg-transparent text-white">
        <AboutHero />
        <AboutFounder />
        {/* <AboutBanner /> */}
      </div>
    </main>
  );
}
