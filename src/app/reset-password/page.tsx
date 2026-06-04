"use client";

import Header from "@/components/Header";
import Input from "@/components/Input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FiAlertTriangle, FiLoader } from "react-icons/fi";
import { resetPasswordSchema, type ResetPasswordFormType } from "@/zodschemas/auth.schema";
import { useValidateResetToken, useResetPassword } from "@/services/auth.service";
import type { AxiosError } from "axios";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { data: tokenData, isLoading: isValidating, isError } = useValidateResetToken(token);

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "", token: token ?? "" },
  });

  const onSubmit = (data: ResetPasswordFormType) => {
    resetPassword(
      { token: data.token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully. Please log in.");
          router.push("/login");
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string }>;
          toast.error(axiosErr.response?.data?.message || "Reset failed");
        },
      },
    );
  };

  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FiLoader className="w-10 h-10 animate-spin text-zinc-400" />
        <p className="text-sm text-zinc-500 font-sans">Validating your link…</p>
      </div>
    );
  }

  if (!token || isError || !tokenData) {
    return (
      <div className="w-full max-w-md px-6 mx-auto flex flex-col items-center mt-20 text-center">
        <FiAlertTriangle className="w-12 h-12 text-red-400 mb-4" />
        <h2 className="text-2xl font-serif text-black mb-2">Link Expired or Invalid</h2>
        <p className="text-sm text-zinc-500 font-sans mb-6">
          This password reset link is no longer valid. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase px-8 py-4 rounded-md transition-colors hover:bg-black/90"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-6 mx-auto flex flex-col mt-10">
      <h1 className="text-4xl text-center mb-2 font-serif text-black">Reset Password</h1>
      <p className="text-center text-sm text-zinc-500 mb-10 font-serif">
        Please enter your new password below.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5 w-full">
        <input type="hidden" {...register("token")} value={token} />

        <div>
          <Input
            label="NEW PASSWORD"
            type="password"
            placeholder="Enter new password"
            {...register("newPassword")}
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        <div>
          <Input
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="Confirm new password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#111] hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-4 rounded-md mt-6 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12.5"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "RESET PASSWORD"
          )}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
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
        <ResetPasswordContent />
      </Suspense>
    </main>
  );
}
