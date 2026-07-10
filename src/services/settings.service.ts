// ─────────────────────────────────────────────────────────────────────────────
// src/services/settings.service.ts  — MOCK (no API calls)
// ─────────────────────────────────────────────────────────────────────────────

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  mockPhonecodes,
  mockCountrycodes,
  mockCities,
} from "@/lib/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Phonecode {
  id: number;
  name: string;
  phonecode: string;
}

export interface Countrycode {
  id: number;
  name: string;
  countrycode: string;
}

export interface City {
  cityName: string;
}

// ─── Cities ───────────────────────────────────────────────────────────────────

export const useGetCities = (countryCode: string) => {
  return useQuery({
    queryKey: ["settings-cities", countryCode],
    queryFn: async (): Promise<City[]> => {
      await new Promise((r) => setTimeout(r, 100));
      return mockCities;
    },
    enabled: !!countryCode,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

// ─── Phone codes ──────────────────────────────────────────────────────────────

export const useGetPhonecodes = (search = "") => {
  return useQuery({
    queryKey: ["settings-phonecodes", search],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      const filtered = search
        ? {
            phonecodes: mockPhonecodes.phonecodes.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase())
            ),
          }
        : mockPhonecodes;
      return filtered;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

// ─── Country codes ────────────────────────────────────────────────────────────

export const useGetCountrycodes = (search = "") => {
  return useQuery({
    queryKey: ["settings-countrycodes", search],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      const filtered = search
        ? {
            countrycodes: mockCountrycodes.countrycodes.filter((c) =>
              c.name.toLowerCase().includes(search.toLowerCase())
            ),
          }
        : mockCountrycodes;
      return filtered;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};

// ─── Contact Us ───────────────────────────────────────────────────────────────

export const useContactUs = () => {
  return useMutation({
    mutationFn: async (_payload: {
      fullName: string;
      email: string;
      subject: string;
      message: string;
    }) => {
      await new Promise((r) => setTimeout(r, 500));
      return { message: "Thank you for contacting us! We'll get back to you shortly." };
    },
  });
};
