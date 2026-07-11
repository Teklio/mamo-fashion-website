import Header from "@/components/Header";
import Link from "next/link";
import { ppFragmentSerif } from "@/lib/font";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-white text-zinc-950 flex flex-col">
      <Header theme="light" />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 pt-20">
        <h1 className={`${ppFragmentSerif.className} text-6xl md:text-8xl lg:text-9xl font-light mb-6 tracking-tight text-zinc-900`}>
          404
        </h1>
        <h2 className="text-xl md:text-2xl font-sans tracking-widest mb-8 text-zinc-600 uppercase">
          Page Not Found
        </h2>
        <p className="max-w-md mx-auto text-sm md:text-base text-zinc-500 mb-10 font-sans">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          href="/"
          className="group relative inline-flex items-center justify-center px-8 py-4 text-xs tracking-[0.2em] uppercase font-medium text-white bg-zinc-950 hover:bg-zinc-900 transition-colors duration-300"
        >
          Return to Home
          <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
        </Link>
      </div>
    </main>
  );
}
