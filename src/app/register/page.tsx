"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Input from "@/components/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast("Account Created", {
      description: "Welcome to SORIN! Redirecting to login...",
    });
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <main className="grow bg-white min-h-screen flex flex-col items-center pt-32 pb-20">
      <Header theme="light" />
      
      <div className="w-full max-w-md px-6 mx-auto flex flex-col mt-10">
        <h1 className="text-4xl text-center mb-2 font-serif text-black">
          My <span className="font-serif italic tracking-widest text-[1.1em]">SORIN</span> Account
        </h1>
        <p className="text-center text-sm text-zinc-500 mb-10 font-serif">
          Create an account to save favourites & track orders.
        </p>

        <form onSubmit={handleRegister} className="flex flex-col space-y-5 w-full">
          {/* Full Name */}
          <Input label="FULL NAME" type="text" />

          {/* Email */}
          <Input 
            label="EMAIL" 
            type="email" 
            placeholder="you@example.com" 
          />

          {/* Password */}
          <Input 
            label="PASSWORD" 
            type="password" 
            rightLabel={
              <Link href="#" className="text-[10px] text-zinc-400 hover:text-black transition-colors">
                Forgot password?
              </Link>
            }
          />

          {/* Remember me */}
          <div className="flex items-center mt-2">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black"
            />
            <label htmlFor="remember" className="ml-2 text-xs text-zinc-500 font-sans">
              Remember me on this device
            </label>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#111] hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-4 rounded-md mt-6 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12.5"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              "SIGN UP"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-500 font-sans">
          Already have an Account ? <Link href="/login" className="text-black font-semibold underline underline-offset-4">Log in</Link>
        </div>
      </div>
    </main>
  );
}
