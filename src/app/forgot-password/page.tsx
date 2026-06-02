"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Input from "@/components/Input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <main className="grow bg-white min-h-[60vh] md:min-h-screen flex flex-col items-center pt-24 md:pt-32 pb-10 md:pb-20">
      <Header theme="light" />

      <div className="w-full max-w-md px-6 mx-auto flex flex-col mt-20">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-12 px-8 border border-black rounded-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl text-center mb-4 font-serif text-black">
              Check your email
            </h1>
            <p className="text-center text-sm text-zinc-500 font-sans leading-relaxed">
              If an account exists with this email, a password reset link has been sent. Please check your inbox.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl text-center mb-2 font-serif text-black flex items-center justify-center gap-x-3">
              Forgot Password
            </h1>
            <p className="text-center text-sm text-zinc-500 mb-10 font-serif">
              Enter your email address to receive a password reset link.
            </p>

            <form onSubmit={handleReset} className="flex flex-col space-y-5 w-full">
              {/* Email */}
              <Input
                label="EMAIL ADDRESS"
                type="email"
                placeholder="Enter your email"
                required
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#111] hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-4 rounded-md mt-6 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12.5"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  "SEND RESET LINK"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-zinc-500 font-sans">
              Remember your password? <Link href="/login" className="text-black font-semibold underline underline-offset-4">Log in</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
