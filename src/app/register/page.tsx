"use client";

import Header from "@/components/Header";
import Link from "next/link";
import Input from "@/components/Input";
import PhoneInput from "@/components/shared/PhoneInput";
import GuestRoute from "@/components/middleware/GuestRoute";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema } from "@/zodschemas/auth.schema";
import { useRegister } from "@/services/auth.service";
import type { AxiosError } from "axios";
import { z } from "zod";
import { passwordSchema } from "@/zodschemas/common.schema";

// Client-side only: extends the base schema with confirmPassword match validation.
// confirmPassword is stripped before the API call.
const clientRegisterSchema = registerSchema
  .omit({ phone: true })
  .extend({ confirmPassword: passwordSchema })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CoreRegisterForm = z.infer<typeof clientRegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();
  const [phone, setPhone] = useState("");

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<CoreRegisterForm>({
    resolver: zodResolver(clientRegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (formData: CoreRegisterForm) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...data } = formData;

    register(
      {
        ...data,
        phone: phone.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(
            res?.message ||
              "Account created! Check your email to verify your account before logging in.",
          );
          router.push("/login");
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string }>;
          toast.error(
            axiosErr.response?.data?.message || "Registration failed",
          );
        },
      },
    );
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
            Create an account to save favourites &amp; track orders.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-5 w-full"
          >
            {/* Full Name */}
            <div>
              <Input
                label="FULL NAME"
                type="text"
                placeholder="Your full name"
                {...formRegister("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Input
                label="EMAIL"
                type="email"
                placeholder="you@example.com"
                {...formRegister("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone — compound component, managed outside RHF */}
            <PhoneInput
              label="PHONE (OPTIONAL)"
              value={phone}
              onChange={setPhone}
              placeholder="50 123 4567"
            />

            {/* Password */}
            <div>
              <Input
                label="PASSWORD"
                type="password"
                {...formRegister("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password — client-side only, not sent to API */}
            <div>
              <Input
                label="CONFIRM PASSWORD"
                type="password"
                {...formRegister("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#111] hover:bg-black text-white text-xs tracking-[0.2em] font-sans font-semibold uppercase py-4 rounded-md mt-6 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12.5"
            >
              {isPending ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-zinc-500 font-sans">
            Already have an Account?{" "}
            <Link
              href="/login"
              className="text-black font-semibold underline underline-offset-4"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    </GuestRoute>
  );
}
