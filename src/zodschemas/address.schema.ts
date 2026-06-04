import z from "zod";

export const addressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  line1: z.string().min(1, "Address line is required"),
  countryCode: z.string().length(2, "Select a country"),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  landMark: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormType = z.infer<typeof addressSchema>;
