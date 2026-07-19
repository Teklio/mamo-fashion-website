// ─────────────────────────────────────────────────────────────────────────────
// src/services/settings.service.ts
// Contact-us has no backend yet — it remains a stubbed mutation.
// TODO(backend): add a /settings/contact endpoint on mamo-fashion-server.
// For catalog metadata (categories/materials/colors/sizes) use catalog.service.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation } from "@tanstack/react-query";

// ─── Contact Us (no backend yet — stubbed) ──────────────────────────────────────

export const useContactUs = () => {
  return useMutation({
    mutationFn: async (_payload: {
      fullName: string;
      phone?: string;
      email?: string;
      subject?: string;
      message?: string;
    }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { message: "Thank you for contacting us! We'll get back to you shortly." };
    },
  });
};
