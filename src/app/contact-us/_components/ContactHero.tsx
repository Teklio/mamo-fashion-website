import { FiMail, FiMessageCircle, FiPhone, FiMapPin, FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

export default function ContactHero() {
  return (
    <section className="py-24 md:py-32 px-6 max-w-6xl mx-auto flex flex-col items-center">
      <h1 className="text-5xl md:text-7xl font-serif text-center text-zinc-900 mb-6 font-light tracking-wide">
        Get In Touch
      </h1>
      <p className="text-center text-zinc-500 font-sans tracking-wide max-w-2xl mb-20 leading-relaxed">
        We're here to help and answer any questions you might have. We look forward to hearing from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {/* Email Card */}
        <div className="group flex flex-col items-center justify-center p-10 bg-amber-50/60 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-100/50 hover:border-amber-200 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-white mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
            <FiMail size={22} />
          </div>
          <h3 className="font-serif text-xl text-zinc-900 mb-3 relative z-10">Email Us</h3>
          <a href="mailto:support@sorin.com" className="font-sans text-sm text-zinc-600 hover:text-zinc-900 transition-colors relative z-10 mb-4">
            support@sorin.com
          </a>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-sans relative z-10">
            We reply within 24h
          </p>
        </div>

        {/* Call Card */}
        <div className="group flex flex-col items-center justify-center p-10 bg-amber-50/60 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-100/50 hover:border-amber-200 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-white mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
            <FiPhone size={22} />
          </div>
          <h3 className="font-serif text-xl text-zinc-900 mb-3 relative z-10">Call Us</h3>
          <a href="tel:+971507284619" className="font-sans text-sm text-zinc-600 hover:text-zinc-900 transition-colors relative z-10 mb-4">
            +971 50 728 4619
          </a>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-sans relative z-10">
            Mon-Fri from 9am to 6pm
          </p>
        </div>

        {/* WhatsApp Card */}
        <div className="group flex flex-col items-center justify-center p-10 bg-amber-50/60 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-100/50 hover:border-amber-200 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500 shadow-md shadow-green-500/20">
            <FiMessageCircle size={22} />
          </div>
          <h3 className="font-serif text-xl text-zinc-900 mb-3 relative z-10">WhatsApp</h3>
          <a href="https://wa.me/971507284619" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-zinc-600 hover:text-green-600 transition-colors relative z-10 mb-4">
            +971 50 728 4619
          </a>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-sans relative z-10">
            Quick responses
          </p>
        </div>

        <div className="group flex flex-col items-center justify-center p-10 bg-amber-50/60 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-100/50 hover:border-amber-200 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden lg:col-span-2">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center text-white mb-6 relative z-10 group-hover:scale-110 transition-transform duration-500">
            <FiMapPin size={22} />
          </div>
          <h3 className="font-serif text-xl text-zinc-900 mb-3 relative z-10">Our Studio</h3>
          <p className="font-sans text-sm text-zinc-600 relative z-10 mb-2 text-center max-w-sm">
            Building 4, Dubai Design District (d3)<br />
            Dubai, United Arab Emirates
          </p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-[0.2em] text-zinc-900 font-sans font-semibold relative z-10 hover:underline mt-2">
            Get Directions
          </a>
        </div>

        {/* Social Card */}
        <div className="group flex flex-col items-center justify-center p-10 bg-amber-50/60 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-amber-100/50 hover:border-amber-200 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 className="font-serif text-xl text-zinc-900 mb-8 relative z-10">Follow Us</h3>
          
          <div className="flex items-center gap-6 relative z-10">
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300">
              <FiInstagram size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300">
              <FiFacebook size={20} />
            </a>
            <a href="#" className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300">
              <FiTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
