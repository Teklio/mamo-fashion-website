// ─────────────────────────────────────────────────────────────────────────────
// src/lib/axios.ts
// Real axios instance for the mamo-fashion-server API.
//   • baseURL from NEXT_PUBLIC_API_URL (includes the /v1 prefix)
//   • withCredentials so the httpOnly refresh cookie flows and the server can
//     silently refresh the access token
//   • request interceptor attaches `Authorization: Bearer <accessToken>` from Redux
//   • response interceptor clears auth + redirects to /login on 401
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import { store } from "@/store";
import { logoutSuccess } from "@/store/slices/authSlice";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/v1";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach the access token from the persisted Redux store (browser only).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = store.getState().auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// On 401 the session is unrecoverable (both access + refresh are invalid/expired):
// clear auth state and bounce to login. Other errors pass through to callers.
let isRedirecting = false;
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      store.dispatch(logoutSuccess());
      const path = window.location.pathname;
      const isAuthPage =
        path.startsWith("/login") ||
        path.startsWith("/register") ||
        path.startsWith("/forgot-password") ||
        path.startsWith("/reset-password") ||
        path.startsWith("/verify-email");
      if (!isRedirecting && !isAuthPage) {
        isRedirecting = true;
        window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
