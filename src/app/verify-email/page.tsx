"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { FiAlertTriangle, FiCheckCircle, FiLoader } from "react-icons/fi";
import { useVerifyEmail, useResendVerification } from "@/services/auth.service";
import type { AxiosError } from "axios";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email") ?? "";

  const { data, isLoading, isError } = useVerifyEmail(token);
  const { mutate: resend, isPending: isResending } = useResendVerification();
  const [email, setEmail] = useState(emailParam);

  const handleResend = () => {
    if (!email.trim()) {
      toast.error("Enter your email to resend the verification link.");
      return;
    }
    resend(email.trim(), {
      onSuccess: () => {
        toast.success("Verification link sent. Please check your inbox (and spam folder).");
        router.push("/login");
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(axiosErr.response?.data?.message || "Could not resend link.");
      },
    });
  };

  const resendScreen = (heading: string, message: string) => (
    <div className="w-full max-w-md px-6 mx-auto flex flex-col items-center mt-20 text-center">
      <FiAlertTriangle className="w-12 h-12 text-red-400 mb-4" />
      <h2 className="text-2xl font-serif text-black mb-2">{heading}</h2>
      <p className="text-sm text-zinc-500 font-sans mb-6">{message}</p>
      <div className="w-full flex flex-col gap-1.5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white focus:outline-none rounded-md px-4 py-3 text-sm text-black placeholder:text-zinc-400"
        />
        <Link
          href="/login"
          className="self-end text-[10px] text-black hover:text-black/40 transition-colors"
        >
          Already verified? Login
        </Link>
        <button
          onClick={handleResend}
          disabled={isResending}
          className="mt-1.5 inline-flex justify-center items-center bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase px-8 py-4 rounded-md transition-colors hover:bg-black/90 disabled:opacity-60"
        >
          {isResending ? (
            <FiLoader className="w-4 h-4 animate-spin" />
          ) : (
            "Resend verification link"
          )}
        </button>
      </div>
    </div>
  );

  if (!token) {
    if (emailParam) {
      return resendScreen(
        "Verify Your Email",
        "Please verify your email before logging in. Enter your email to receive a new verification link.",
      );
    }

    return (
      <div className="w-full max-w-md px-6 mx-auto flex flex-col items-center mt-20 text-center">
        <FiAlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-2xl font-serif text-black mb-2">Missing Token</h2>
        <p className="text-sm text-zinc-500 font-sans mb-6">
          This verification link is incomplete. Please use the link from your email.
        </p>
        <Link
          href="/login"
          className="inline-block bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase px-8 py-4 rounded-md transition-colors hover:bg-black/90"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiLoader className="w-10 h-10 animate-spin text-zinc-400" />
        <p className="text-sm text-zinc-500 font-sans">Verifying your email…</p>
      </div>
    );
  }

  if (isError) {
    return resendScreen(
      "Link Expired or Invalid",
      "This verification link is no longer valid. Enter your email to receive a new one.",
    );
  }

  return (
    <div className="w-full max-w-md px-6 mx-auto flex flex-col items-center mt-20 text-center">
      <FiCheckCircle className="w-12 h-12 text-green-500 mb-4" />
      <h2 className="text-2xl font-serif text-black mb-2">Email Verified</h2>
      <p className="text-sm text-zinc-500 font-sans mb-6">
        {data?.message || "Your email has been verified. You can now log in."}
      </p>
      <Link
        href="/login"
        className="inline-block bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase px-8 py-4 rounded-md transition-colors hover:bg-black/90"
      >
        Continue to Login
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="grow bg-white min-h-[60vh] md:min-h-screen flex flex-col items-center pt-24 md:pt-32 pb-10 md:pb-20">
      <Header theme="light" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <span className="w-6 h-6 border-2 border-zinc-200 border-t-zinc-500 rounded-full animate-spin" />
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
