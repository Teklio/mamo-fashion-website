import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CustomerLoginResponse } from "@/types/auth.type";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuthenticated: boolean;
  id: string;
  name: string;
  email: string;
  phone: string;
  cartCount: number;
  wishlistCount: number;
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  isAuthenticated: false,
  id: "",
  name: "",
  email: "",
  phone: "",
  cartCount: 0,
  wishlistCount: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<CustomerLoginResponse>) => {
      const { accessToken, refreshToken, user, cartItemsCount, wishlistCount } =
        action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.id = user.id;
      state.name = user.name ?? "";
      state.email = user.email ?? "";
      state.phone = user.phone ?? "";
      state.cartCount = cartItemsCount;
      state.wishlistCount = wishlistCount;
    },
    logoutSuccess: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuthenticated = false;
      state.id = "";
      state.name = "";
      state.email = "";
      state.phone = "";
      state.cartCount = 0;
      state.wishlistCount = 0;
    },
    updateProfile: (state, action: PayloadAction<Partial<AuthState>>) => {
      Object.assign(state, action.payload);
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setCartCount: (state, action: PayloadAction<number>) => {
      state.cartCount = action.payload;
    },
    setWishlistCount: (state, action: PayloadAction<number>) => {
      state.wishlistCount = action.payload;
    },
    incrementCartCount: (state, action: PayloadAction<number | undefined>) => {
      state.cartCount += action.payload ?? 1;
    },
    decrementCartCount: (state, action: PayloadAction<number | undefined>) => {
      state.cartCount = Math.max(0, state.cartCount - (action.payload ?? 1));
    },
    incrementWishlistCount: (state) => {
      state.wishlistCount += 1;
    },
    decrementWishlistCount: (state) => {
      state.wishlistCount = Math.max(0, state.wishlistCount - 1);
    },
  },
});

export default authSlice.reducer;
export const {
  loginSuccess,
  logoutSuccess,
  updateProfile,
  setAccessToken,
  setRefreshToken,
  setCartCount,
  setWishlistCount,
  incrementCartCount,
  decrementCartCount,
  incrementWishlistCount,
  decrementWishlistCount,
} = authSlice.actions;
