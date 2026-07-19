export interface CustomerUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerLoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  cartItemsCount: number;
  wishlistCount: number;
  user: CustomerUser;
}

export interface ValidateResetTokenResponse {
  message: string;
  email: string;
}

export interface MessageResponse {
  message: string;
}
