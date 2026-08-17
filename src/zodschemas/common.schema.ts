import z from "zod";

// Password validation schema
export const passwordSchema = z
  .string()
  .min(6, "Must be at least 6 characters")
  .max(12, "Must be at most 12 characters")
  .regex(/[A-Za-z]/, "Must include a letter")
  .regex(/\d/, "Must include a number")
  .regex(/[^A-Za-z0-9]/, "Must include a special character");

//phone schema — server stores a bare 10-digit national number
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, "Enter a valid 10-digit phone number");

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

// Contact form
export const contactFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters").max(100),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address"),
  subject: z.string().trim().min(2, "Subject is required").max(150),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});
export type ContactFormType = z.infer<typeof contactFormSchema>;
