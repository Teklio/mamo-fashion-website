"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/Input";
import { toast } from "sonner";
import { FiLock, FiX, FiCheck } from "react-icons/fi";
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
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  const closePasswordForm = () => {
    setIsChangingPassword(false);
    resetPasswordForm();
  };

  const onPasswordSubmit = (data: UpdatePasswordFormType) => {
    updatePassword(data, {
      onSuccess: () => {
        toast.success("Password Updated", {
          description: "Your password has been successfully changed.",
        });
        closePasswordForm();
      },
      onError: (err) => {
        const axiosErr = err as AxiosError<{ message: string }>;
        toast.error(axiosErr.response?.data?.message || "Password update failed");
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">Account Details</h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Profile Details */}
        <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 w-full">
          <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 w-full">
              <div>
                <Input label="Full Name" type="text" placeholder="Your full name" {...profileRegister("name")} />
                {profileErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{profileErrors.name.message}</p>
                )}
              </div>
              <div>
                <Input label="Email Address" type="email" defaultValue={email} disabled />
              </div>
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
        </div>

        {/* Security */}
        <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 w-full">
          <div className="flex items-center gap-2 mb-4">
            <FiLock className="text-zinc-400" size={14} />
            <h2 className="text-xs font-sans font-semibold uppercase tracking-widest text-zinc-500">
              Security
            </h2>
          </div>

          {!isChangingPassword ? (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-serif text-base text-black">Password</h3>
                <p className="text-zinc-500 text-sm font-sans mt-1">
                  A secure password helps protect your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="shrink-0 px-6 py-2.5 border border-black rounded-md text-sm font-sans font-medium text-black hover:bg-zinc-50 transition-colors whitespace-nowrap"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300 max-w-lg">
              <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                  <h3 className="font-serif text-base text-black">Update Password</h3>
                  <p className="text-zinc-500 text-sm font-sans mt-1">
                    Please enter your current password to authorize this change.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closePasswordForm}
                  className="shrink-0 text-zinc-400 hover:text-black transition-colors"
                  aria-label="Cancel password change"
                >
                  <FiX size={20} />
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

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPasswordPending}
                    className="flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold uppercase tracking-widest px-8 py-3.5 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isPasswordPending ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Save Password
                        <FiCheck size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
