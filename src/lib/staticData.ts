// ─────────────────────────────────────────────────────────────────────────────
// src/lib/staticData.ts
// Static client-side reference data for UI helpers that have no backend endpoint
// (phone codes, country codes). The server stores plain values and does not
// expose these lists, so they live here.
// ─────────────────────────────────────────────────────────────────────────────

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

export const phonecodes: Phonecode[] = [
  { id: 1, name: "India", phonecode: "+91" },
  { id: 2, name: "United States", phonecode: "+1" },
  { id: 3, name: "United Kingdom", phonecode: "+44" },
  { id: 4, name: "UAE", phonecode: "+971" },
  { id: 5, name: "Saudi Arabia", phonecode: "+966" },
  { id: 6, name: "Canada", phonecode: "+1" },
  { id: 7, name: "Australia", phonecode: "+61" },
  { id: 8, name: "Singapore", phonecode: "+65" },
];

export interface City {
  cityName: string;
}

// Placeholder city list used only by the (mocked) checkout inline-address form.
export const cities: City[] = [
  { cityName: "Mumbai" },
  { cityName: "Delhi" },
  { cityName: "Bangalore" },
  { cityName: "Chennai" },
  { cityName: "Hyderabad" },
  { cityName: "Pune" },
  { cityName: "Kolkata" },
  { cityName: "Ahmedabad" },
  { cityName: "Jaipur" },
];

export const countrycodes: Countrycode[] = [
  { id: 1, name: "India", countrycode: "IN" },
  { id: 2, name: "United States", countrycode: "US" },
  { id: 3, name: "United Kingdom", countrycode: "GB" },
  { id: 4, name: "UAE", countrycode: "AE" },
  { id: 5, name: "Saudi Arabia", countrycode: "SA" },
  { id: 6, name: "Canada", countrycode: "CA" },
  { id: 7, name: "Australia", countrycode: "AU" },
  { id: 8, name: "Singapore", countrycode: "SG" },
];
