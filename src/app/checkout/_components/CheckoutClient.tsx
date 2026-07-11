"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { FiCheck, FiLoader, FiLock, FiTag, FiX } from "react-icons/fi";
import type { AxiosError } from "axios";

import Input from "@/components/Input";
import PhoneInput from "@/components/shared/PhoneInput";
import { SearchableDropdown } from "@/components/shared/SearchableDropdown";
import { useGetCart } from "@/services/cart.service";
import { useGetCustomerAddresses } from "@/services/address.service";
import { useGetCities, useGetCountrycodes } from "@/services/settings.service";
import {
  useApplyCoupon,
  useBuyNow,
  useCheckoutAuth,
  useCreateOrder,
} from "@/services/checkout.service";
import {
  checkoutAuthSchema,
  inlineAddressSchema,
  type CheckoutAuthFormType,
  type InlineAddressFormType,
} from "@/zodschemas/checkout.schema";
import type { RootState } from "@/store";
import type { CartItem } from "@/types/cart.type";
import type { ApplyCouponResponse, InlineAddress } from "@/types/checkout.type";
import type { CustomerAddress } from "@/services/address.service";

const Spinner = () => (
  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
);

const fmt = (v: string | number) => `INR ${Number(v).toFixed(2)}`;

export default function CheckoutClient() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const authEmail = useSelector((s: RootState) => s.auth.email);
  const searchParams = useSearchParams();

  const isBuyNow = searchParams.get("mode") === "buynow";
  const buyNowPvs = searchParams.get("pvs") ?? "";
  const buyNowQty = Math.max(1, Number(searchParams.get("qty") ?? 1));
  const buyNowTitle = searchParams.get("title") ?? "";
  const buyNowPrice = Number(searchParams.get("price") ?? 0);
  const buyNowColor = searchParams.get("color") ?? "";
  const buyNowSize = searchParams.get("size") ?? "";
  const buyNowImg = searchParams.get("img") ?? "";

  const { data: cartData, isLoading: cartLoading } = useGetCart();
  const { data: addrData } = useGetCustomerAddresses();
  const { mutate: checkoutAuth, isPending: isAuthing } = useCheckoutAuth();
  const { mutate: applyCouponMutation, isPending: isApplyingCoupon } =
    useApplyCoupon();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: buyNow, isPending: isBuyingNow } = useBuyNow();

  const cartItems = cartData?.cart?.items ?? [];
  const savedAddresses = addrData?.addresses ?? [];
  const defaultAddress =
    savedAddresses.find((address) => address.isDefault) ??
    savedAddresses[0] ??
    null;

  const authForm = useForm<CheckoutAuthFormType>({
    resolver: zodResolver(checkoutAuthSchema),
    defaultValues: { email: "", password: "" },
  });

  // ── Shipping address ────────────────────────────────────────────────────────
  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addrPhone, setAddrPhone] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const addrForm = useForm<InlineAddressFormType>({
    resolver: zodResolver(inlineAddressSchema),
    defaultValues: { name: "", line1: "", city: "", countryCode: "" },
  });
  const watchedCountry = useWatch({ control: addrForm.control, name: "countryCode" });
  const watchedCity = useWatch({ control: addrForm.control, name: "city" });

  // ── Billing address ─────────────────────────────────────────────────────────
  const [billingMode, setBillingMode] = useState<"same" | "saved" | "new">("same");
  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<string | null>(null);
  const [billingAddrPhone, setBillingAddrPhone] = useState("");
  const [billingCountrySearch, setBillingCountrySearch] = useState("");

  const billingAddrForm = useForm<InlineAddressFormType>({
    resolver: zodResolver(inlineAddressSchema),
    defaultValues: { name: "", line1: "", city: "", countryCode: "" },
  });
  const watchedBillingCountry = useWatch({ control: billingAddrForm.control, name: "countryCode" });
  const watchedBillingCity = useWatch({ control: billingAddrForm.control, name: "city" });

  // ── Data hooks ───────────────────────────────────────────────────────────────
  const { data: countryCodes, isLoading: loadingCountries } = useGetCountrycodes(countrySearch);
  const { data: citiesData, isLoading: loadingCities } = useGetCities(watchedCountry ?? "");

  const { data: billingCountryCodes, isLoading: loadingBillingCountries } =
    useGetCountrycodes(billingCountrySearch);
  const { data: billingCitiesData, isLoading: loadingBillingCities } =
    useGetCities(watchedBillingCountry ?? "");

  const countryOpts = useMemo(
    () =>
      (countryCodes?.countrycodes ?? []).map((c) => ({
        value: c.countrycode,
        label: `${c.countrycode} - ${c.name}`,
      })),
    [countryCodes],
  );
  const cityOpts = useMemo(
    () => (citiesData ?? []).map((c) => ({ value: c.cityName, label: c.cityName })),
    [citiesData],
  );
  const billingCountryOpts = useMemo(
    () =>
      (billingCountryCodes?.countrycodes ?? []).map((c) => ({
        value: c.countrycode,
        label: `${c.countrycode} - ${c.name}`,
      })),
    [billingCountryCodes],
  );
  const billingCityOpts = useMemo(
    () => (billingCitiesData ?? []).map((c) => ({ value: c.cityName, label: c.cityName })),
    [billingCitiesData],
  );

  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  // ── Coupon ───────────────────────────────────────────────────────────────────
  const [couponInput, setCouponInput] = useState("");
  const [couponResult, setCouponResult] = useState<ApplyCouponResponse | null>(null);
  const [couponError, setCouponError] = useState("");

  const rawSubtotal = isBuyNow
    ? buyNowPrice * buyNowQty
    : cartItems.reduce((sum: number, item: CartItem) => {
        const price =
          Number(item.price) > 0
            ? Number(item.price)
            : Number(item.size?.variant?.product?.price ?? 0);
        return sum + price * item.quantity;
      }, 0);

  const subtotal = couponResult ? Number(couponResult.subTotal) : rawSubtotal;
  const discount = couponResult ? Number(couponResult.discount) : 0;
  const total = couponResult ? Number(couponResult.total) : rawSubtotal;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleAuth = authForm.handleSubmit((data) => {
    checkoutAuth(data, {
      onError: (err) => {
        const ae = err as AxiosError<{ message: string }>;
        authForm.setError("password", {
          message: ae.response?.data?.message || "Invalid credentials",
        });
      },
    });
  });

  const handleApplyCoupon = () => {
    setCouponError("");
    if (!couponInput.trim()) return;
    applyCouponMutation(
      isBuyNow
        ? { couponCode: couponInput.trim(), mode: "buynow", productVariantSizeId: buyNowPvs, quantity: buyNowQty }
        : { couponCode: couponInput.trim(), mode: "cart" },
      {
        onSuccess: (data) => {
          setCouponResult(data);
          toast.success(`Coupon "${data.couponCode}" applied!`);
        },
        onError: (err) => {
          const ae = err as AxiosError<{ message: string }>;
          setCouponError(ae.response?.data?.message || "Invalid coupon");
          setCouponResult(null);
        },
      },
    );
  };

  const resolveShipping = async (): Promise<string | InlineAddress | null> => {
    if (addressMode === "saved" && selectedAddressId) return selectedAddressId;
    const valid = await addrForm.trigger();
    if (!valid || !addrPhone.trim()) {
      if (!addrPhone.trim()) toast.error("Phone number is required");
      return null;
    }
    const v = addrForm.getValues();
    return {
      name: v.name,
      phone: addrPhone.trim(),
      line1: v.line1,
      city: v.city,
      countryCode: v.countryCode || "",
      district: v.district || undefined,
      postalCode: v.postalCode || undefined,
      landMark: v.landMark || undefined,
    };
  };

  const resolveBilling = async (): Promise<string | InlineAddress | null | undefined> => {
    if (billingMode === "same") return undefined;
    if (billingMode === "saved" && selectedBillingAddressId) return selectedBillingAddressId;
    const valid = await billingAddrForm.trigger();
    if (!valid || !billingAddrPhone.trim()) {
      if (!billingAddrPhone.trim()) toast.error("Billing phone number is required");
      return null;
    }
    const v = billingAddrForm.getValues();
    return {
      name: v.name,
      phone: billingAddrPhone.trim(),
      line1: v.line1,
      city: v.city,
      countryCode: v.countryCode || "",
      district: v.district || undefined,
      postalCode: v.postalCode || undefined,
      landMark: v.landMark || undefined,
    };
  };

  const handlePayNow = async () => {
    if (!isBuyNow && cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const shipping = await resolveShipping();
    if (!shipping) return;

    const billing = await resolveBilling();
    if (billing === null) return;

    if (isBuyNow) {
      buyNow(
        {
          productVariantSizeId: buyNowPvs,
          quantity: buyNowQty,
          shippingAddress: shipping,
          ...(billing !== undefined && { billingAddress: billing }),
          couponCode: couponResult?.couponCode,
        },
        {
          onSuccess: (data) => {
            sessionStorage.setItem("checkoutMode", "buynow");
            window.location.href = data.paymentUrl;
          },
          onError: (err) => {
            const ae = err as AxiosError<{ message: string }>;
            toast.error(ae.response?.data?.message || "Failed to create order");
          },
        },
      );
      return;
    }

    createOrder(
      {
        mode: "cart",
        shippingAddress: shipping,
        ...(billing !== undefined && { billingAddress: billing }),
        couponCode: couponResult?.couponCode,
      },
      {
        onSuccess: (data) => {
          sessionStorage.setItem("checkoutMode", "cart");
          window.location.href = data.paymentUrl;
        },
        onError: (err) => {
          const ae = err as AxiosError<{ message: string }>;
          toast.error(ae.response?.data?.message || "Failed to create order");
        },
      },
    );
  };

  if (!isBuyNow && !cartLoading && cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-400 px-4 py-24 text-center sm:px-8 md:px-16">
        <p className="mb-4 font-serif text-2xl text-zinc-900">Your cart is empty</p>
        <Link href="/shop" className="font-sans text-sm text-zinc-600 underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inlineDifferentBilling = billingMode === "new" || (billingMode !== "same" && savedAddresses.length === 0);

  return (
    <div className="mx-auto max-w-400 px-4 sm:px-8 md:px-16">
      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16">
        <div className="flex w-full flex-col gap-8 lg:flex-1">
          {/* ── Auth ──────────────────────────────────────────────────────── */}
          {!isAuthenticated ? (
            <section className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-1 font-serif text-xl text-zinc-900">Sign In to Checkout</h2>
              <p className="mb-6 font-sans text-xs text-zinc-500">
                New to MAMO FASHION? We&apos;ll create your account automatically.
              </p>
              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <div>
                  <Input label="EMAIL" type="email" placeholder="you@example.com" {...authForm.register("email")} />
                  {authForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">{authForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Input label="PASSWORD" type="password" {...authForm.register("password")} />
                  {authForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500">{authForm.formState.errors.password.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isAuthing}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 py-3.5 font-sans text-xs font-semibold tracking-[0.2em] text-white transition-colors hover:bg-black disabled:opacity-70"
                >
                  {isAuthing ? <Spinner /> : null}
                  {isAuthing ? "CONTINUING..." : "CONTINUE"}
                </button>
              </form>
            </section>
          ) : (
            <div className="flex items-center gap-2 font-sans text-xs text-zinc-500">
              <FiCheck size={14} className="text-green-600" />
              Signed in as <span className="font-medium text-zinc-900">{authEmail}</span>
            </div>
          )}

          <div className={!isAuthenticated ? "pointer-events-none select-none opacity-40" : ""}>
            {/* ── Shipping Address ────────────────────────────────────────── */}
            <section className="mb-8 rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-6 font-serif text-xl text-zinc-900">Shipping Address</h2>

              {savedAddresses.length > 0 && (
                <div className="mb-6 flex flex-col gap-3">
                  {savedAddresses.map((addr: CustomerAddress) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => { setAddressMode("saved"); setSelectedAddressId(addr.id); }}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${addressMode === "saved" && selectedAddressId === addr.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-sans text-sm font-semibold text-zinc-900">{addr.name}</p>
                          <p className="mt-0.5 font-sans text-xs text-zinc-400">{addr.phone}</p>
                          <p className="mt-1 font-sans text-xs text-zinc-600">
                            {addr.line1}, {addr.city}, {addr.countryCode}
                          </p>
                        </div>
                        <Radio selected={addressMode === "saved" && selectedAddressId === addr.id} />
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAddressMode("new")}
                    className={`w-full rounded-xl border p-4 text-left font-sans text-sm transition-all ${addressMode === "new" ? "border-zinc-900 bg-zinc-50 text-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"}`}
                  >
                    + Use a different address
                  </button>
                </div>
              )}

              {(addressMode === "new" || savedAddresses.length === 0) && (
                <InlineAddressForm
                  form={addrForm}
                  phone={addrPhone}
                  onPhoneChange={setAddrPhone}
                  onCountrySearchChange={setCountrySearch}
                  countryOpts={countryOpts}
                  loadingCountries={loadingCountries}
                  cityOpts={cityOpts}
                  loadingCities={loadingCities}
                  watchedCountry={watchedCountry}
                  watchedCity={watchedCity}
                />
              )}
            </section>

            {/* ── Billing Address ─────────────────────────────────────────── */}
            <section className="mb-8 rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-5 font-serif text-xl text-zinc-900">Billing Address</h2>

              {/* Same / Different toggle */}
              <div className="mb-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBillingMode("same")}
                  className={`flex flex-1 items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${billingMode === "same" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                >
                  <Radio selected={billingMode === "same"} />
                  <span className="font-sans text-sm text-zinc-700">Same as shipping</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (savedAddresses.length > 0) {
                      setBillingMode("saved");
                      setSelectedBillingAddressId(defaultAddress?.id ?? savedAddresses[0]?.id ?? null);
                    } else {
                      setBillingMode("new");
                    }
                  }}
                  className={`flex flex-1 items-center gap-2.5 rounded-xl border p-3.5 text-left transition-all ${billingMode !== "same" ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                >
                  <Radio selected={billingMode !== "same"} />
                  <span className="font-sans text-sm text-zinc-700">Different address</span>
                </button>
              </div>

              {billingMode !== "same" && (
                <>
                  {savedAddresses.length > 0 && (
                    <div className="mb-5 flex flex-col gap-3">
                      {savedAddresses.map((addr: CustomerAddress) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => { setBillingMode("saved"); setSelectedBillingAddressId(addr.id); }}
                          className={`w-full rounded-xl border p-4 text-left transition-all ${billingMode === "saved" && selectedBillingAddressId === addr.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-sans text-sm font-semibold text-zinc-900">{addr.name}</p>
                              <p className="mt-0.5 font-sans text-xs text-zinc-400">{addr.phone}</p>
                              <p className="mt-1 font-sans text-xs text-zinc-600">
                                {addr.line1}, {addr.city}, {addr.countryCode}
                              </p>
                            </div>
                            <Radio selected={billingMode === "saved" && selectedBillingAddressId === addr.id} />
                          </div>
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setBillingMode("new")}
                        className={`w-full rounded-xl border p-4 text-left font-sans text-sm transition-all ${billingMode === "new" ? "border-zinc-900 bg-zinc-50 text-zinc-900" : "border-zinc-200 text-zinc-500 hover:border-zinc-400"}`}
                      >
                        + Use a different address
                      </button>
                    </div>
                  )}

                  {inlineDifferentBilling && (
                    <InlineAddressForm
                      form={billingAddrForm}
                      phone={billingAddrPhone}
                      onPhoneChange={setBillingAddrPhone}
                      onCountrySearchChange={setBillingCountrySearch}
                      countryOpts={billingCountryOpts}
                      loadingCountries={loadingBillingCountries}
                      cityOpts={billingCityOpts}
                      loadingCities={loadingBillingCities}
                      watchedCountry={watchedBillingCountry}
                      watchedCity={watchedBillingCity}
                    />
                  )}
                </>
              )}
            </section>

            {/* ── Payment info ─────────────────────────────────────────────── */}
            <section className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-4 font-serif text-xl text-zinc-900">Payment</h2>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="font-sans text-sm text-zinc-700">
                  After you click <span className="font-semibold">Pay Now</span>, you&apos;ll be
                  redirected to Checkout.com&apos;s hosted payment page.
                </p>
                <p className="mt-2 font-sans text-xs text-zinc-500">
                  Checkout.com will securely handle Card, Apple Pay, Google Pay, and Tamara.
                </p>
              </div>
            </section>
          </div>

          {/* ── Footer links ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-t border-zinc-100 pt-6">
            <div className="flex items-center gap-5">
              <Link href="/return-and-refund-policy" className="font-sans text-xs text-zinc-400 transition-colors hover:text-zinc-600">
                Shipping &amp; Returns
              </Link>
              <Link href="/privacy-policy" className="font-sans text-xs text-zinc-400 transition-colors hover:text-zinc-600">
                Privacy
              </Link>
              <Link href="/terms-and-conditions" className="font-sans text-xs text-zinc-400 transition-colors hover:text-zinc-600">
                Terms
              </Link>
            </div>
            <span className="font-sans text-xs text-zinc-400">© MAMO FASHION — KERALA, INDIA</span>
          </div>
        </div>

        {/* ── Order Summary ─────────────────────────────────────────────────── */}
        <div className="w-full shrink-0 lg:order-last lg:sticky lg:top-32 lg:w-96">
          <div className="rounded-2xl border border-zinc-200 p-6 md:p-8">
            <h2 className="mb-6 font-serif text-xl text-zinc-900">Order Summary</h2>

            {/* Items */}
            <div className="mb-5 flex max-h-72 flex-col gap-4 overflow-y-auto">
              {isBuyNow ? (
                <div className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                    {buyNowImg && (
                      <Image src={buyNowImg} alt={buyNowTitle} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-sm font-semibold text-zinc-900">{buyNowTitle}</p>
                    <p className="mt-0.5 font-sans text-xs text-zinc-400">
                      {buyNowColor}{buyNowSize ? ` · ${buyNowSize}` : ""} · x{buyNowQty}
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-sans text-sm font-semibold text-zinc-900">
                    {fmt(buyNowPrice * buyNowQty)}
                  </p>
                </div>
              ) : cartLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-lg bg-zinc-100" />
                  ))
                : cartItems.map((item: CartItem) => {
                    const variant = item.size?.variant;
                    const product = variant?.product;
                    const imgUrl = variant?.primaryImage?.publicUrl ?? "";
                    const unitPrice =
                      Number(item.price) > 0 ? Number(item.price) : Number(product?.price ?? 0);
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {imgUrl && (
                            <Image src={imgUrl} alt={product?.title ?? ""} fill sizes="56px" className="object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sans text-sm font-semibold text-zinc-900">
                            {product?.title ?? "-"}
                          </p>
                          <p className="mt-0.5 font-sans text-xs text-zinc-400">
                            {variant?.colorName}{item.size?.size ? ` · Size: ${item.size.size}` : ""} · x{item.quantity}
                          </p>
                        </div>
                        <p className="whitespace-nowrap font-sans text-sm font-semibold text-zinc-900">
                          {fmt(unitPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
            </div>



            {/* Pricing rows */}
            <div className="space-y-2.5 border-t border-zinc-100 pt-4">
              <Row label="Subtotal" value={fmt(subtotal)} />
              {discount > 0 && (
                <Row
                  label={`Discount (${Number(couponResult?.discountPercentage ?? 0).toFixed(0)}%)`}
                  value={`-${fmt(discount)}`}
                  valueClass="text-green-600"
                />
              )}
              <Row label="Shipping" value="Free" />
              <div className="flex items-baseline justify-between border-t border-zinc-100 pt-3">
                <span className="font-sans text-sm font-semibold text-zinc-900">Total</span>
                <span className="font-serif text-xl text-zinc-900">{fmt(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              disabled={!isAuthenticated || isCreatingOrder || isBuyingNow || (!isBuyNow && cartLoading)}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {(isCreatingOrder || isBuyingNow) ? (
                <><Spinner />CREATING ORDER...</>
              ) : (
                <><FiLock size={12} />PAY NOW · {fmt(total)}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared inline address form ───────────────────────────────────────────────

interface InlineAddressFormProps {
  form: ReturnType<typeof useForm<InlineAddressFormType>>;
  phone: string;
  onPhoneChange: (v: string) => void;
  onCountrySearchChange: (v: string) => void;
  countryOpts: { value: string; label: string }[];
  loadingCountries: boolean;
  cityOpts: { value: string; label: string }[];
  loadingCities: boolean;
  watchedCountry: string | undefined;
  watchedCity: string | undefined;
}

function InlineAddressForm({
  form,
  phone,
  onPhoneChange,
  onCountrySearchChange,
  countryOpts,
  loadingCountries,
  cityOpts,
  loadingCities,
  watchedCountry,
  watchedCity,
}: InlineAddressFormProps) {
  return (
    <div className="flex flex-col gap-4">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Input label="Full Name *" placeholder="e.g. Angela R" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91..."
            value={phone}
            onChange={(e) => {
              onPhoneChange(e.target.value);
              form.setValue("phone", e.target.value, { shouldValidate: true });
            }}
          />
          {form.formState.errors.phone && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.phone.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input label="Address Line 1" placeholder="e.g. 123 Sheikh Zayed Rd" {...form.register("line1")} />
          {form.formState.errors.line1 && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.line1.message}</p>
          )}
        </div>
        <div>
          <Input label="City *" placeholder="e.g. London" {...form.register("city")} />
          {form.formState.errors.city && (
            <p className="mt-1 text-xs text-red-500">{form.formState.errors.city.message}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="District" placeholder="e.g. Downtown" {...form.register("district")} />
        <Input label="Postal Code" placeholder="e.g. 00000" {...form.register("postalCode")} />
      </div>
    </div>
  );
}

// ── Utility components ───────────────────────────────────────────────────────

function Radio({ selected }: { selected: boolean }) {
  return (
    <div
      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-zinc-900" : "border-zinc-300"}`}
    >
      {selected && <div className="h-2 w-2 rounded-full bg-zinc-900" />}
    </div>
  );
}

function Row({ label, value, valueClass = "" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between font-sans text-xs text-zinc-500">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
