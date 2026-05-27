import { FiMail, FiMessageCircle } from "react-icons/fi";

export default function ContactHero() {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl font-serif text-center text-black mb-4">
        Get In Touch
      </h1>
      <p className="text-center text-zinc-500 font-serif mb-16">
        We&apos;re here to help and answer any questions you might have
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Email Card */}
        <div className="flex flex-col items-center justify-center border border-zinc-100 rounded-xl p-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] bg-white hover:border-zinc-200 transition-colors">
          <div className="w-14 h-14 bg-[#111] rounded-full flex items-center justify-center text-white mb-6">
            <FiMail size={24} />
          </div>
          <h3 className="font-serif text-lg text-black mb-2">Email Us</h3>
          <p className="font-sans text-xs font-semibold text-zinc-800 tracking-wider mb-6">
            support@sorin.com
          </p>
          <p className="text-[10px] text-zinc-400 font-sans tracking-wide">
            We reply within 24h
          </p>
        </div>

        {/* WhatsApp Card */}
        <div className="flex flex-col items-center justify-center border border-zinc-100 rounded-xl p-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] bg-white hover:border-zinc-200 transition-colors">
          <div className="w-14 h-14 bg-[#111] rounded-full flex items-center justify-center text-white mb-6">
            <FiMessageCircle size={24} />
          </div>
          <h3 className="font-serif text-lg text-black mb-2">WhatsApp</h3>
          <p className="font-sans text-xs font-semibold text-zinc-800 tracking-wider mb-6">
            +971 50 728 4619
          </p>
          <p className="text-[10px] text-zinc-400 font-sans tracking-wide">
            Quick responses
          </p>
        </div>
      </div>
    </section>
  );
}
