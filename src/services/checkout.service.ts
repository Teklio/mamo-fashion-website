import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { axiosInstance } from "@/lib/axios";
import { loginSuccess } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store";
import type {
  ApplyCouponResponse,
  CheckoutAuthResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  VerifyPaymentResponse,
} from "@/types/checkout.type";
import type { CheckoutAuthFormType } from "@/zodschemas/checkout.schema";

const checkoutAuthApi = async (
  data: CheckoutAuthFormType,
): Promise<CheckoutAuthResponse> => {
  const res = await axiosInstance.post<CheckoutAuthResponse>(
    "/customer/auth/checkout-auth",
    data,
  );
  return res.data;
};

export const useCheckoutAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  return useMutation({
    mutationFn: checkoutAuthApi,
    onSuccess: (data) => {
      dispatch(
        loginSuccess({
          message: data.message,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          cartItemsCount: 0,
          wishlistCount: 0,
          user: {
            id: data.user.id,
            name: "",
            email: data.user.email,
            phone: data.user.phone,
            isActive: data.user.isActive,
          },
        }),
      );
    },
  });
};

interface ApplyCouponPayload {
  couponCode: string;
  mode: "cart" | "buynow";
  productVariantSizeId?: string;
  quantity?: number;
}

const applyCouponApi = async (
  payload: ApplyCouponPayload,
): Promise<ApplyCouponResponse> => {
  const res = await axiosInstance.post<ApplyCouponResponse>(
    "/orders/apply-coupon",
    payload,
  );
  return res.data;
};

export const useApplyCoupon = () => {
  return useMutation({ mutationFn: applyCouponApi });
};

const createOrderApi = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  const res = await axiosInstance.post<CreateOrderResponse>("/orders", payload);
  return res.data;
};

export const useCreateOrder = () => {
  return useMutation({ mutationFn: createOrderApi });
};

export const verifyPaymentStatus = async (
  orderId: string,
  result?: "success" | "failed" | "cancelled",
): Promise<VerifyPaymentResponse> => {
  const params = new URLSearchParams({ orderId });
  if (result) {
    params.set("result", result);
  }

  const res = await axiosInstance.get<VerifyPaymentResponse>(
    `/payments/verify?${params.toString()}`,
  );
  return res.data;
};
