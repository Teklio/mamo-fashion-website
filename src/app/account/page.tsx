"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import { toast } from "sonner";
import { FiLock, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "@/store";
import {
  updateProfileSchema,
  updatePasswordSchema,
  type UpdateProfileFormType,
  type UpdatePasswordFormType,
} from "@/zodschemas/auth.schema";
import { useUpdateProfile, useUpdatePassword } from "@/services/auth.service";
import type { AxiosError } from "axios";

export default function AccountDetailsPage() {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { name, email, phone } = useSelector((s: RootState) => s.auth);

  // ── Profile form ──────────────────────────────────────────────────────
  const { mutate: updateProfile, isPending: isProfilePending } = useUpdateProfile();

  const {
    register: profileRegister,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<UpdateProfileFormType>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: name || "", phone: phone || "" },
  });

  const onProfileSubmit = (data: UpdateProfileFormType) => {
    updateProfile(data, {
      onSuccess: () => {
        toast.success("Information Updated", {
          description: "Your account details have been successfully saved.",
        });
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(axiosErr.response?.data?.message || "Update failed");
      },
    });
  };

  // ── Password form ─────────────────────────────────────────────────────
  const { mutate: updatePassword, isPending: isPasswordPending } = useUpdatePassword();

  const {
    register: passwordRegister,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<UpdatePasswordFormType>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onPasswordSubmit = (data: UpdatePasswordFormType) => {
    updatePassword(data, {
      onSuccess: () => {
        toast.success("Password Updated", {
          description: "Your password has been successfully changed.",
        });
        setIsPasswordModalOpen(false);
        resetPasswordForm();
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(axiosErr.response?.data?.message || "Password update failed");
      },
    });
  };

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 lg:p-10 w-full min-h-150">
      <div className="mb-10">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">Account Details</h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 max-w-4xl">
        {/* Profile form */}
        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-8 w-full lg:w-1/2">
          <div className="flex flex-col gap-6 w-full">
            <div>
              <Input label="Full Name" type="text" placeholder="Your full name" {...profileRegister("name")} />
              {profileErrors.name && (
                <p className="mt-1 text-xs text-red-500">{profileErrors.name.message}</p>
              )}
            </div>
            {/* <div>
              <Input label="Email Address" type="email" defaultValue={email} disabled />
            </div> */}
            <div>
              <Input label="Phone Number" type="tel" inputMode="numeric" placeholder="9876543210" {...profileRegister("phone")} />
              {profileErrors.phone && (
                <p className="mt-1 text-xs text-red-500">{profileErrors.phone.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isProfileDirty || isProfilePending}
            className="w-full md:w-fit bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold uppercase tracking-widest px-8 py-3.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex justify-center items-center text-center h-12"
          >
            {isProfilePending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </form>

        {/* Password section */}
        {/* <div className="w-full lg:w-1/2 border-t lg:border-t-0 lg:border-l border-black/10 pt-8 lg:pt-0 lg:pl-12 flex flex-col justify-start">
          <h3 className="font-semibold text-black text-lg mb-1 font-sans">Password</h3>
          <p className="text-zinc-500 text-sm font-sans mb-6">
            It&apos;s a good idea to use a strong password.
          </p>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full md:w-fit px-5 py-3 md:py-2.5 border border-black rounded-md text-sm font-sans font-medium text-black hover:bg-zinc-50 transition-colors whitespace-nowrap text-center"
          >
            <FiLock size={16} /> Update Password
          </button>
        </div> */}
      </div>

      {/* Password modal */}
      {/* <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 md:p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-black">Update Password</h2>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-zinc-400 hover:text-black transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="flex flex-col gap-6">
                <div>
                  <Input label="Current Password" type="password" {...passwordRegister("currentPassword")} />
                  {passwordErrors.currentPassword && (
                    <p className="mt-1 text-xs text-red-500">{passwordErrors.currentPassword.message}</p>
                  )}
                </div>
                <div>
                  <Input label="New Password" type="password" {...passwordRegister("newPassword")} />
                  {passwordErrors.newPassword && (
                    <p className="mt-1 text-xs text-red-500">{passwordErrors.newPassword.message}</p>
                  )}
                </div>
                <div>
                  <Input label="Confirm New Password" type="password" {...passwordRegister("confirmNewPassword")} />
                  {passwordErrors.confirmNewPassword && (
                    <p className="mt-1 text-xs text-red-500">{passwordErrors.confirmNewPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPasswordPending}
                  className="w-full bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold uppercase tracking-widest px-8 py-4 rounded-md transition-colors mt-2 flex justify-center items-center"
                >
                  {isPasswordPending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}
    </div>
  );
}
