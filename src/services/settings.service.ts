import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

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

interface GetPhonecodesResponse {
  phonecodes: Phonecode[];
}

interface GetCountrycodesResponse {
  countrycodes: Countrycode[];
}

export interface City {
  cityName: string;
}

// ─── Cities ───────────────────────────────────────────────────────────────────

const getCitiesApi = async (countryCode: string): Promise<City[]> => {
  const { data } = await axiosInstance.get<City[]>(`/settings/cities/${countryCode}`);
  return data;
};

export const useGetCities = (countryCode: string) => {
  return useQuery({
    queryKey: ["settings-cities", countryCode],
    queryFn: () => getCitiesApi(countryCode),
    enabled: !!countryCode,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ─── Contact Us ───────────────────────────────────────────────────────────────

interface ContactUsPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Phone codes ──────────────────────────────────────────────────────────────

const getPhonecodesApi = async (search = ""): Promise<GetPhonecodesResponse> => {
  const { data } = await axiosInstance.get("/settings/phonecodes", {
    params: search.trim() ? { search: search.trim() } : undefined,
  });
  return data;
};

export const useGetPhonecodes = (search = "") => {
  return useQuery({
    queryKey: ["settings-phonecodes", search],
    queryFn: () => getPhonecodesApi(search),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ─── Country codes ────────────────────────────────────────────────────────────

const getCountrycodesApi = async (search = ""): Promise<GetCountrycodesResponse> => {
  const { data } = await axiosInstance.get("/settings/countrycodes", {
    params: search.trim() ? { search: search.trim() } : undefined,
  });
  return data;
};

export const useGetCountrycodes = (search = "") => {
  return useQuery({
    queryKey: ["settings-countrycodes", search],
    queryFn: () => getCountrycodesApi(search),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ─── Contact Us ───────────────────────────────────────────────────────────────

const contactUsApi = async (payload: ContactUsPayload): Promise<{ message: string }> => {
  const { data } = await axiosInstance.post("/settings/contactus", payload);
  return data;
};

export const useContactUs = () => {
  return useMutation({ mutationFn: contactUsApi });
};
