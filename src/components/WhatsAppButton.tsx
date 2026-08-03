"use client";

import { FaWhatsapp, FaPhone } from "react-icons/fa";

export default function WhatsAppButton() {
  const phoneNumber = "919567530926";
  const message = encodeURIComponent("Hello! I'm interested in Mamo Fashion.");
  
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      {/* Call Button */}
      <a
        href="tel:+919778173627"
        className="relative flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-zinc-800 hover:scale-110 transition-all duration-300 group"
        aria-label="Call us"
      >
        <span className="absolute right-full mr-4 bg-black text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call us
        </span>
        <FaPhone className="w-5 h-5" />
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="absolute right-full mr-4 bg-black text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
        </span>
        <FaWhatsapp className="w-8 h-8" />
      </a>
    </div>
  );
}
