import z from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  line1: z.string().max(255).optional(),
  city: z.string().min(1, "City is required").max(50),
  district: z.string().min(1, "District is required").max(50),
  pinCode: z
    .string()
    .min(3, "Postal code must be at least 3 characters")
    .max(12, "Postal code must not exceed 12 characters"),
  landMark: z.string().max(255).optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormType = z.infer<typeof addressSchema>;
