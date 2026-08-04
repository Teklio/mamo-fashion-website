// ─────────────────────────────────────────────────────────────────────────────
// src/services/catalog.service.ts  — public catalog metadata (/v1/settings/*)
// Used to drive storefront filter UIs. All list GETs are public; we always pass
// isActive=true so only live catalog entries surface.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { endpoints } from "@/lib/endpoints";

export interface MainCategory {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SubCategory {
  id: string;
  name: string;
  mainCategoryId: string;
  displayOrder: number;
  isActive: boolean;
}

export interface Material {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ColorOption {
  id: string;
  name: string;
  /** Comma-separated hex list */
  colorCodes: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SizeOption {
  id: string;
  name: string;
  displayOrder: number;
  isActive: boolean;
}

const activeParams = { isActive: "true" as const };

export const useMainCategories = () =>
  useQuery({
    queryKey: ["catalog", "main-categories"],
    queryFn: async () => {
      const res = await api.get<{ mainCategories: MainCategory[] }>(
        endpoints.catalog.mainCategories,
        { params: activeParams },
      );
      return res.data.mainCategories;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useSubCategories = (mainCategoryId?: string) =>
  useQuery({
    queryKey: ["catalog", "sub-categories", mainCategoryId ?? "all"],
    queryFn: async () => {
      const res = await api.get<{ subCategories: SubCategory[] }>(
        endpoints.catalog.subCategories,
        {
          params: {
            ...activeParams,
            ...(mainCategoryId ? { mainCategoryId } : {}),
          },
        },
      );
      return res.data.subCategories;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useMaterials = () =>
  useQuery({
    queryKey: ["catalog", "materials"],
    queryFn: async () => {
      const res = await api.get<{ materials: Material[] }>(
        endpoints.catalog.materials,
        { params: activeParams },
      );
      return res.data.materials;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useColors = () =>
  useQuery({
    queryKey: ["catalog", "colors"],
    queryFn: async () => {
      const res = await api.get<{ colors: ColorOption[] }>(
        endpoints.catalog.colors,
        { params: activeParams },
      );
      return res.data.colors;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });

export const useSizes = () =>
  useQuery({
    queryKey: ["catalog", "sizes"],
    queryFn: async () => {
      const res = await api.get<{ sizes: SizeOption[] }>(
        endpoints.catalog.sizes,
        { params: activeParams },
      );
      return res.data.sizes;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
