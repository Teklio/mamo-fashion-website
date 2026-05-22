"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const faqs = [
  { question: "How long does delivery take?", answer: "Delivery typically takes 3-5 business days for domestic orders, and 7-14 days for international shipments." },
  { question: "Where are our products manufactured?", answer: "Our products are ethically crafted by skilled artisans in our dedicated facilities." },
  { question: "How quickly can I expect a reply if I contact Sorin?", answer: "We aim to respond to all inquiries within 24 hours during regular business days." },
  { question: "What if an item is unavailable?", answer: "If an item is out of stock, you can sign up for notifications on the product page to be alerted when it returns." },
  { question: "How are exchange and return orders done?", answer: "Returns and exchanges can be initiated within 14 days of receiving your order through our Returns Portal." },
  { question: "Can I cancel my order?", answer: "Orders can be canceled within 1 hour of placement. After that, they enter processing." },
  { question: "How can I check my order status?", answer: "You can track your order using the link provided in your shipping confirmation email or via your SORIN Account." },
  { question: "Can I edit or cancel my order after purchase?", answer: "If you need to make changes, please contact us immediately. Once shipped, changes cannot be made." },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6 max-w-3xl mx-auto flex flex-col items-center">
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
