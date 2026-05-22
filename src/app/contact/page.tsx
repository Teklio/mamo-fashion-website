import Header from "@/components/Header";
import ContactHero from "@/app/contact/_components/ContactHero";
import ContactForm from "@/app/contact/_components/ContactForm";
import Faq from "@/app/contact/_components/Faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SORIN | Contact Us",
  description: "Get in touch with HOUSE OF SORIN customer care.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950 pt-20">
      <Header theme="light" />
      <div className="relative z-10 bg-white text-zinc-950">
        <ContactHero />
        <ContactForm />
        <Faq />
      </div>
    </main>
  );
}
