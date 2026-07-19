import z from "zod";
import { phoneSchema } from "./common.schema";

export const checkoutAuthSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});
export type CheckoutAuthFormType = z.infer<typeof checkoutAuthSchema>;

export const inlineAddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: phoneSchema,
  line1: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(50),
  district: z.string().min(1, "District is required").max(50),
  pinCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters")
    .max(12, "Postal code must not exceed 12 characters"),
  landMark: z.string().max(255).optional(),
});
export type InlineAddressFormType = z.infer<typeof inlineAddressSchema>;

export const couponSchema = z.object({
  code: z.string().min(1, "Enter a coupon code"),
});
export type CouponFormType = z.infer<typeof couponSchema>;
