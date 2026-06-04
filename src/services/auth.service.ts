import { useMutation, useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { axiosInstance } from "@/lib/axios";
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

const loginApi = async (data: LoginFormType): Promise<CustomerLoginResponse> => {
  const res = await axiosInstance.post("/customer/auth/login", data);
  return res.data;
};

export const useLogin = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      dispatch(loginSuccess(data));
    },
  });
};

// ─── Register ─────────────────────────────────────────────────────────────────

const registerApi = async (data: RegisterFormType): Promise<MessageResponse> => {
  const res = await axiosInstance.post("/customer/auth/register", data);
  return res.data;
};

export const useRegister = () => {
  return useMutation({ mutationFn: registerApi });
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logoutApi = async (): Promise<MessageResponse> => {
  const res = await axiosInstance.post("/customer/auth/logout");
  return res.data;
};

export const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(logoutSuccess());
    },
  });
};

// ─── Update Profile ───────────────────────────────────────────────────────────

const updateProfileApi = async (data: UpdateProfileFormType): Promise<MessageResponse> => {
  const res = await axiosInstance.patch("/customer/auth/update-profile", data);
  return res.data;
};

export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (_data, variables) => {
      dispatch(updateProfile({ name: variables.name, phone: variables.phone }));
    },
  });
};

// ─── Update Password ──────────────────────────────────────────────────────────

const updatePasswordApi = async (data: UpdatePasswordFormType): Promise<MessageResponse> => {
  const res = await axiosInstance.patch("/customer/auth/update-password", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  return res.data;
};

export const useUpdatePassword = () => {
  return useMutation({ mutationFn: updatePasswordApi });
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

const forgotPasswordApi = async (data: ForgotPasswordFormType): Promise<MessageResponse> => {
  const res = await axiosInstance.post("/customer/auth/forgot-password", data);
  return res.data;
};

export const useForgotPassword = () => {
  return useMutation({ mutationFn: forgotPasswordApi });
};

// ─── Validate Reset Token ─────────────────────────────────────────────────────

const validateResetTokenApi = async (token: string): Promise<ValidateResetTokenResponse> => {
  const res = await axiosInstance.patch(
    "/customer/auth/validate-reset-token",
    {},
    { params: { token } },
  );
  return res.data;
};

export const useValidateResetToken = (token: string | null) => {
  return useQuery({
    queryKey: ["validate-reset-token", token],
    queryFn: () => validateResetTokenApi(token!),
    enabled: !!token,
    retry: false,
  });
};

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPasswordApi = async (data: {
  token: string;
  newPassword: string;
}): Promise<MessageResponse> => {
  const res = await axiosInstance.patch("/customer/auth/reset-password", data);
  return res.data;
};

export const useResetPassword = () => {
  return useMutation({ mutationFn: resetPasswordApi });
};
