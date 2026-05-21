import Header from "@/components/Header";
import AboutHero from "@/app/about/_components/AboutHero";
import AboutFounder from "@/app/about/_components/AboutFounder";
import AboutBanner from "@/app/about/_components/AboutBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "The House of SORIN | Our Story",
  description: "Discover the story and craftsmanship behind HOUSE OF SORIN.",
};

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950">
      <Header theme="light" />
      <div className="relative z-10 bg-white text-zinc-950">
        <AboutHero />
        <AboutFounder />
        <AboutBanner />
      </div>
    </main>
  );
}
