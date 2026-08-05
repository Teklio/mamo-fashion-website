import { Suspense } from "react";
import Header from "@/components/Header";
import ContactHero from "@/app/contact-us/_components/ContactHero";
import ContactForm from "@/app/contact-us/_components/ContactForm";
import Faq from "@/app/contact-us/_components/Faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Mamo Fashion Customer Care",
  description: "Get in touch with Mamo Fashion for inquiries, support, and feedback. We are here to help you with your premium ethnic wear shopping experience.",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950 pt-20">
      <Header theme="light" />
      <div className="relative z-10 bg-white text-zinc-950">
        <ContactHero />
        <ContactForm />
        <Suspense fallback={<div>Loading...</div>}>
          <Faq />
        </Suspense>
      </div>
    </main>
  );
}
