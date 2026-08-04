"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Input from "@/components/Input";
import GuestRoute from "@/components/middleware/GuestRoute";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginSchema, type LoginFormType } from "@/zodschemas/auth.schema";
import { useLogin } from "@/services/auth.service";
import type { AxiosError } from "axios";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = (data: LoginFormType) => {
    login(data, {
      onSuccess: () => {
        toast.success("Welcome back!");
        router.push(searchParams.get("redirect") || "/");
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message = axiosErr.response?.data?.message;
        if (
          axiosErr.response?.status === 403 &&
          message === "Please verify your email before logging in"
        ) {
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
          return;
        }
        toast.error(message || "Login failed");
      },
    });
  };

  return (
    <GuestRoute>
      <main className="grow bg-white min-h-screen flex flex-col items-center pt-32 pb-20">
        <Header theme="light" />

        <div className="w-full max-w-md px-6 mx-auto flex flex-col mt-10">
          <h1 className="text-4xl text-center mb-2 font-serif text-black flex items-center justify-center gap-x-3">
            My Account
          </h1>
          <p className="text-center text-sm text-zinc-500 mb-10 font-serif">
            Sign in to access your favourites &amp; track orders.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5 w-full">
            <div>
              <Input
                label="EMAIL"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                label="PASSWORD"
                type="password"
                rightLabel={
                  <Link href="/forgot-password" className="text-[10px] text-black hover:text-black/40 transition-colors">
                    Forgot password?
                  </Link>
                }
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="remember"
                {...register("rememberMe")}
                className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-zinc-500 font-sans">
                Remember me on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#111] hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-4 rounded-md mt-6 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12.5"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "LOG IN"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-500 font-sans">
            Don&apos;t have an Account?{" "}
            <Link href="/register" className="text-black font-semibold underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </div>
      </main>
    </GuestRoute>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginContent />
    </Suspense>
  );
}
