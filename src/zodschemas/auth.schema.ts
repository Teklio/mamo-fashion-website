import z from "zod";
import { passwordSchema, phoneSchema } from "./common.schema";

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});
export type LoginFormType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email({ message: "Invalid email address" }),
  phone: phoneSchema.optional(),
  password: passwordSchema,
});
export type RegisterFormType = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
    token: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").optional(),
  phone: phoneSchema.optional(),
});
export type UpdateProfileFormType = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
export type UpdatePasswordFormType = z.infer<typeof updatePasswordSchema>;
