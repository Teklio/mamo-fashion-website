"use client";

import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

const faqs = [
  { question: "How do I know my correct size?", answer: "We provide detailed size guides on every product page, including measurements for bust, waist, and hips. If you're between sizes in our dresses, we recommend sizing up for a more comfortable fit." },
  { question: "What materials do you use for your dresses?", answer: "We source premium fabrics globally, including pure silks, breathable linens, and high-quality cotton blends. The specific fabric composition and care instructions are listed on each item's detail page." },
  { question: "Can I return a dress if it doesn't fit?", answer: "Yes! We accept returns within 14 days of delivery. The item must be unworn, unwashed, and have all original tags attached. We provide a prepaid return label for your convenience." },
  { question: "Do you offer styling advice or personal shopping?", answer: "Absolutely. Our expert styling team is available via WhatsApp or email to help you find the perfect outfit for any occasion, from casual brunches to evening galas." },
  { question: "How long does delivery take for new collections?", answer: "Standard delivery typically takes 3-5 business days. For our limited-edition pre-order collections, estimated shipping dates are clearly noted on the product page." },
  { question: "Are your garments sustainable?", answer: "Sustainability is at our core. We produce in small, limited-run batches to minimize waste and partner with ethical manufacturers who ensure fair wages and safe working conditions." },
  { question: "How should I care for my Mamo garments?", answer: "To preserve the rich colors and delicate fabrics, we recommend dry cleaning our evening wear and gentle hand washing for our casual linen and cotton pieces. Always check the care label inside your garment." },
  { question: "Do you restock sold-out items?", answer: "Since we operate on limited drops to ensure exclusivity, we rarely restock sold-out items. However, you can sign up for 'Back in Stock' notifications in case of returns." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get("scrollTo") === "faq") {
      // Small delay to ensure the page has painted and is at the top initially
      const timer = setTimeout(() => {
        const element = document.getElementById("faq");
        if (element) {
          const headerOffset = 100; // Account for fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 500); // Wait half a second before initiating the smooth scroll
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-6 max-w-3xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-serif text-center text-black mb-2">
        Frequently Asked Questions
      </h2>
      <p className="text-center text-zinc-500 font-serif mb-12 text-sm">
        Find answers to common questions
      </p>

      <div className="w-full space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className="border border-zinc-100 rounded-md bg-white overflow-hidden transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
            >
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left focus:outline-none"
              >
                <span className="font-serif text-sm text-zinc-800">
                  {faq.question}
                </span>
                <FiChevronDown 
                  size={16} 
                  className={`text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                />
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 opacity-100 px-6 pb-5" : "max-h-0 opacity-0 px-6 pb-0"}`}
              >
                <p className="text-sm text-zinc-500 font-sans leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
