// ─────────────────────────────────────────────────────────────────────────────
// src/services/auth.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { loginSuccess, logoutSuccess, updateProfile } from "@/store/slices/authSlice";
import { mockLoginResponse, mockMessageResponse } from "@/lib/mockData";
import type {
  LoginFormType,
  RegisterFormType,
  ForgotPasswordFormType,
  UpdateProfileFormType,
  UpdatePasswordFormType,
} from "@/zodschemas/auth.schema";

// ─── Login ────────────────────────────────────────────────────────────────────

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (_data: LoginFormType) => {
      await new Promise((r) => setTimeout(r, 500)); // simulate network delay
      return mockLoginResponse;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const useRegister = () => {
  return useMutation({
    mutationFn: async (_data: RegisterFormType) => {
      await new Promise((r) => setTimeout(r, 500));
      return { message: "Registration successful! You can now log in." };
    },
  });
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async () => {
      await new Promise((r) => setTimeout(r, 200));
      return mockMessageResponse;
    },
    onSuccess: () => {
      dispatch(logoutSuccess());
    },
  });
};

// ─── Update Profile ───────────────────────────────────────────────────────────

export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (_data: UpdateProfileFormType) => {
      await new Promise((r) => setTimeout(r, 400));
      return mockMessageResponse;
    },
    onSuccess: (_data, variables) => {
      dispatch(updateProfile({ name: variables.name, phone: variables.phone }));
    },
  });
};

// ─── Update Password ──────────────────────────────────────────────────────────

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (_data: UpdatePasswordFormType) => {
      await new Promise((r) => setTimeout(r, 400));
      return mockMessageResponse;
    },
  });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (_data: ForgotPasswordFormType) => {
      await new Promise((r) => setTimeout(r, 400));
      return { message: "Password reset link sent to your email." };
    },
  });
};

// ─── Validate Reset Token ─────────────────────────────────────────────────────

export const useValidateResetToken = (token: string | null) => {
  return useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { valid: true };
    },
    enabled: !!token,
    retry: false,
  });
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (_data: { token: string; newPassword: string }) => {
      await new Promise((r) => setTimeout(r, 400));
      return { message: "Password reset successfully. You can now log in." };
    },
  });
};
