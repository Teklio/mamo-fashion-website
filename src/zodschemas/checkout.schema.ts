import z from "zod";
import { phoneSchema } from "./common.schema";

export const checkoutAuthSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, "Password is required"),
});
export type CheckoutAuthFormType = z.infer<typeof checkoutAuthSchema>;

export const inlineAddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: phoneSchema,
  line1: z.string().min(5, "Address must be at least 5 characters").max(50),
  city: z.string().min(2, "City is required"),
  countryCode: z.string().optional(),
  district: z.string().max(50).optional(),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  landMark: z.string().optional(),
});
export type InlineAddressFormType = z.infer<typeof inlineAddressSchema>;

export const couponSchema = z.object({
  code: z.string().min(1, "Enter a coupon code"),
});
export type CouponFormType = z.infer<typeof couponSchema>;
