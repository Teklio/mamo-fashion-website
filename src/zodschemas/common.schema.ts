import z from "zod";

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Must be at least 8 characters")
  .max(32, "Must be at most 32 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/\d/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

//phone schema — accepts combined code+number string, e.g. "+966501234567"
export const phoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^\+\d{6,19}$/, "Invalid phone number");

export type PhoneForm = z.infer<typeof phoneSchema>;

//numbers
export const positiveNumberSchema = z.coerce
  .number()
  .positive("Must be greater than 0");

export const nonNegativeNumberSchema = z.coerce
  .number()
  .nonnegative("Cannot be negative");

//date & time
export const dateSchema = z.coerce.date().optional();
