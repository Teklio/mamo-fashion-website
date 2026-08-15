// ─────────────────────────────────────────────────────────────────────────────
// src/lib/endpoints.ts
// Central registry of backend API paths (relative to NEXT_PUBLIC_API_URL, which
// already includes the `/v1` prefix). Server routes live in mamo-fashion-server.
// ─────────────────────────────────────────────────────────────────────────────

export const endpoints = {
  auth: {
    register: "/customer/auth/register",
    verifyEmail: "/customer/auth/verify-email",
    resendVerification: "/customer/auth/resend-verification",
    login: "/customer/auth/login",
    logout: "/customer/auth/logout",
    forgotPassword: "/customer/auth/forgot-password",
    validateResetToken: "/customer/auth/validate-reset-token",
    resetPassword: "/customer/auth/reset-password",
    updateProfile: "/customer/auth/update-profile",
    changePassword: "/customer/auth/change-password",
  },
  products: {
    list: "/products/customer",
    detail: (id: string) => `/products/customer/${id}`,
    variant: (productId: string, variantId: string) =>
      `/products/customer/${productId}/variants/${variantId}`,
  },
  catalog: {
    mainCategories: "/settings/main-categories",
    subCategories: "/settings/sub-categories",
    materials: "/settings/materials",
    colors: "/settings/colors",
    sizes: "/settings/sizes",
  },
  cart: {
    base: "/customer/cart",
    count: "/customer/cart/count",
    items: "/customer/cart/items",
    item: (id: string) => `/customer/cart/items/${id}`,
  },
  wishlist: {
    base: "/customer/wishlist",
    item: (productId: string) => `/customer/wishlist/${productId}`,
  },
  address: {
    base: "/customer/address",
    item: (id: string) => `/customer/address/${id}`,
  },
  orders: {
    list: "/orders",
    detail: (id: string) => `/orders/${id}`,
  },
  payments: {
    verify: "/payments/verify",
  },
  contact: {
    send: "/settings/contact",
  },
} as const;
