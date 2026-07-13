// ─────────────────────────────────────────────────────────────────────────────
// src/services/settings.service.ts
// Phone/country codes are served from static client data (no server endpoint).
// Contact-us has no backend yet — it remains a stubbed mutation.
// TODO(backend): add a /settings/contact endpoint on mamo-fashion-server.
// For catalog metadata (categories/materials/colors/sizes) use catalog.service.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  phonecodes as staticPhonecodes,
  countrycodes as staticCountrycodes,
  cities as staticCities,
  type Phonecode,
  type Countrycode,
  type City,
} from "@/lib/staticData";

export type { Phonecode, Countrycode, City };

// ─── Cities (static — used only by the mocked checkout inline-address form) ──────

export const useGetCities = (countryCode: string) => {
  return useQuery({
    queryKey: ["settings-cities", countryCode],
    queryFn: async (): Promise<City[]> => staticCities,
    enabled: !!countryCode,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

// ─── Phone codes (static) ───────────────────────────────────────────────────────

export const useGetPhonecodes = (search = "") => {
  return useQuery({
    queryKey: ["settings-phonecodes", search],
    queryFn: async () => {
      const list = search
        ? staticPhonecodes.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase()),
          )
        : staticPhonecodes;
      return { phonecodes: list };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

// ─── Country codes (static) ─────────────────────────────────────────────────────

export const useGetCountrycodes = (search = "") => {
  return useQuery({
    queryKey: ["settings-countrycodes", search],
    queryFn: async () => {
      const list = search
        ? staticCountrycodes.filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()),
          )
        : staticCountrycodes;
      return { countrycodes: list };
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

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
