// ─────────────────────────────────────────────────────────────────────────────
// src/services/settings.service.ts — real API calls to mamo-fashion-server
// For catalog metadata (categories/materials/colors/sizes) use catalog.service.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";
import type { MessageResponse } from "@/types/auth.type";
import type { ContactFormType } from "@/zodschemas/common.schema";

// ─── Contact Us ─────────────────────────────────────────────────────────────

export const useContactUs = () => {
  return useMutation({
    mutationFn: async (data: ContactFormType) => {
      const res = await api.post<MessageResponse>(endpoints.contact.send, {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      });
      return res.data;
    },
  });
};
