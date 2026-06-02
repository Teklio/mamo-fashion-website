"use client";

import Header from "@/components/Header";
import Input from "@/components/Input";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Password Reset Successful", {
        description: "Your password has been successfully updated.",
      });
      router.push("/login");
    }, 1200);
  };

  return (
    <main className="grow bg-white min-h-[60vh] md:min-h-screen flex flex-col items-center pt-24 md:pt-32 pb-10 md:pb-20">
      <Header theme="light" />

      <div className="w-full max-w-md px-6 mx-auto flex flex-col mt-10">
        <h1 className="text-4xl text-center mb-2 font-serif text-black flex items-center justify-center gap-x-3">
          Reset Password
        </h1>
        <p className="text-center text-sm text-zinc-500 mb-10 font-serif">
          Please enter your new password below.
        </p>

        <form onSubmit={handleReset} className="flex flex-col space-y-5 w-full">
          {/* New Password */}
          <Input
            label="NEW PASSWORD"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          {/* Confirm Password */}
          <Input
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              "RESET PASSWORD"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
