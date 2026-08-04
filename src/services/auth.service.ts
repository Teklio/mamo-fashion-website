// ─────────────────────────────────────────────────────────────────────────────
// src/services/auth.service.ts  — real API calls to mamo-fashion-server
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { AppDispatch } from "@/store";
import { loginSuccess, logoutSuccess, updateProfile } from "@/store/slices/authSlice";
import type {
  CustomerLoginResponse,
  MessageResponse,
  ValidateResetTokenResponse,
} from "@/types/auth.type";
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
    mutationFn: async (data: LoginFormType) => {
      const res = await api.post<CustomerLoginResponse>(endpoints.auth.login, {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
      });
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────
// Server is verify-first: no tokens are issued until the email is verified.

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterFormType) => {
      const res = await api.post<MessageResponse>(endpoints.auth.register, {
        name: data.name,
        email: data.email,
        password: data.password,
        ...(data.phone ? { phone: data.phone } : {}),
      });
      return res.data;
    },
  });
};

// ─── Resend verification ────────────────────────────────────────────────────────

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post<MessageResponse>(
        endpoints.auth.resendVerification,
        { email },
      );
      return res.data;
    },
  });
};

// ─── Verify email ───────────────────────────────────────────────────────────────

export const useVerifyEmail = (token: string | null) => {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: async () => {
      const res = await api.get<MessageResponse>(endpoints.auth.verifyEmail, {
        params: { token },
      });
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const qc = useQueryClient();
  const clearSession = () => {
    dispatch(logoutSuccess());
    qc.removeQueries({ queryKey: ["cart"] });
    qc.removeQueries({ queryKey: ["wishlist"] });
  };
  return useMutation({
    mutationFn: async () => {
      const res = await api.post<MessageResponse>(endpoints.auth.logout);
      return res.data;
    },
    onSuccess: () => {
      clearSession();
    },
    onError: () => {
      // Even if the network call fails, clear local session.
      clearSession();
    },
  });
};

// ─── Update Profile ───────────────────────────────────────────────────────────

export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: async (data: UpdateProfileFormType) => {
      const res = await api.patch<{
        message: string;
        user: { id: string; name: string | null; email: string | null; phone: string | null };
      }>(endpoints.auth.updateProfile, {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      });
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(
        updateProfile({
          name: data.user.name ?? "",
          phone: data.user.phone ?? "",
        }),
      );
    },
  });
};

// ─── Update Password ──────────────────────────────────────────────────────────

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: async (data: UpdatePasswordFormType) => {
      const res = await api.patch<MessageResponse>(endpoints.auth.changePassword, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res.data;
    },
  });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormType) => {
      const res = await api.post<MessageResponse>(endpoints.auth.forgotPassword, {
        email: data.email,
      });
      return res.data;
    },
  });
};

// ─── Validate Reset Token ─────────────────────────────────────────────────────

export const useValidateResetToken = (token: string | null) => {
  return useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: async () => {
      const res = await api.get<ValidateResetTokenResponse>(
        endpoints.auth.validateResetToken,
        { params: { token } },
      );
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { token: string; newPassword: string }) => {
      const res = await api.post<MessageResponse>(endpoints.auth.resetPassword, {
        token: data.token,
        newPassword: data.newPassword,
      });
      return res.data;
    },
  });
};
