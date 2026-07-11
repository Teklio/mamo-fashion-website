// ─────────────────────────────────────────────────────────────────────────────
// src/lib/mockData.ts
// Central mock data store for Evoria Fashion (no backend required)
// ─────────────────────────────────────────────────────────────────────────────

import type { CartApiResponse } from "@/types/cart.type";
import type { WishlistApiResponse } from "@/types/wishlist.type";
import type { GetCustomerOrdersResponse } from "@/types/order.type";
import type { GetCustomerProductsResponse, GetCustomerProductResponse } from "@/types/product.type";
import { mockProducts } from "./mockProducts";

// ─── Products ─────────────────────────────────────────────────────────────────

export const mockProductsResponse: GetCustomerProductsResponse = {
  variants: mockProducts,
  meta: { page: 1, limit: 10, total: mockProducts.length, totalPages: 1 },
};

export const mockProductDetailResponse: GetCustomerProductResponse = {
  product: {
    id: "prod-1",
    title: "Evoria Signature Dress",
    price: "95.00",
    description:
      "A beautiful handcrafted dress from the Evoria Fashion collection. Made with premium fabric and attention to detail for a perfect fit.",
    feature:
      "Premium breathable fabric · Hand-stitched details · Available in multiple sizes · Machine washable",
    mainCategory: "Women",
    subCategory: "frock Nighties",
    material: "Cotton",
    variants: mockProducts.map((p) => ({
      id: p.id,
      colorName: p.colorName ?? "Default",
      colorCode: p.colorCode ?? "#000000",
      primaryImage: p.primaryImageUrl
        ? { id: `img-${p.id}-1`, publicUrl: p.primaryImageUrl }
        : null,
      secondaryImage: p.secondaryImageUrl
        ? { id: `img-${p.id}-2`, publicUrl: p.secondaryImageUrl }
        : null,
      images: [],
      sizes: p.sizes,
    })),
  },
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export const mockCartResponse: CartApiResponse = {
  cart: {
    id: "cart-mock-1",
    customerId: "user-mock-1",
    items: [],
  },
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export const mockWishlistResponse: WishlistApiResponse = {
  wishlist: [],
};

// ─── Orders ───────────────────────────────────────────────────────────────────

export const mockOrdersResponse: GetCustomerOrdersResponse = {
  orders: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
};

// ─── Addresses ────────────────────────────────────────────────────────────────

export const mockAddressesResponse = {
  addresses: [],
};

// ─── Settings ─────────────────────────────────────────────────────────────────

export const mockSettings = {
  settings: {
    _id: "settings-1",
    minimumOrderValue: 0,
    orderLimits: { min: 1, max: 10 },
    supportEmail: "support@evoria.fashion",
    supportPhone: "+91 9876543210",
  },
};

// ─── Phone / Country Codes ────────────────────────────────────────────────────

export const mockPhonecodes = {
  phonecodes: [
    { id: 1, name: "India", phonecode: "+91" },
    { id: 2, name: "United States", phonecode: "+1" },
    { id: 3, name: "United Kingdom", phonecode: "+44" },
    { id: 4, name: "UAE", phonecode: "+971" },
  ],
};

export const mockCountrycodes = {
  countrycodes: [
    { id: 1, name: "India", countrycode: "IN" },
    { id: 2, name: "United States", countrycode: "US" },
    { id: 3, name: "United Kingdom", countrycode: "GB" },
    { id: 4, name: "UAE", countrycode: "AE" },
  ],
};

export const mockCities = [
  { cityName: "Mumbai" },
  { cityName: "Delhi" },
  { cityName: "Bangalore" },
  { cityName: "Chennai" },
  { cityName: "Hyderabad" },
  { cityName: "Pune" },
  { cityName: "Kolkata" },
];

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const mockLoginResponse = {
  message: "Login successful",
  accessToken: "mock-access-token",
  refreshToken: "mock-refresh-token",
  cartItemsCount: 0,
  wishlistCount: 0,
  user: {
    id: "user-mock-1",
    name: "Guest User",
    email: "guest@evoria.fashion",
    phone: null,
    isActive: true,
  },
};

export const mockMessageResponse = { message: "Success" };
