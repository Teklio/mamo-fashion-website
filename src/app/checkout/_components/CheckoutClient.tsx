"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
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

const fmt = (v: string | number) => `AED ${Number(v).toFixed(2)}`;

export default function CheckoutClient() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const authEmail = useSelector((s: RootState) => s.auth.email);

  const { data: cartData, isLoading: cartLoading } = useGetCart();
  const { data: addrData } = useGetCustomerAddresses();
  const { mutate: checkoutAuth, isPending: isAuthing } = useCheckoutAuth();
  const { mutate: applyCouponMutation, isPending: isApplyingCoupon } =
    useApplyCoupon();
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder();

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

  const [addressMode, setAddressMode] = useState<"saved" | "new">("saved");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [addrPhone, setAddrPhone] = useState("");
  const [countrySearch, setCountrySearch] = useState("");

  const addrForm = useForm<InlineAddressFormType>({
    resolver: zodResolver(inlineAddressSchema),
    defaultValues: { name: "", line1: "", city: "", countryCode: "" },
  });

  const watchedCountry = addrForm.watch("countryCode");
  const watchedCity = addrForm.watch("city");

  const { data: countryCodes, isLoading: loadingCountries } =
    useGetCountrycodes(countrySearch);
  const { data: citiesData, isLoading: loadingCities } = useGetCities(
    watchedCountry ?? "",
  );

  const countryOpts = useMemo(
    () =>
      (countryCodes?.countrycodes ?? []).map((country) => ({
        value: country.countrycode,
        label: `${country.countrycode} - ${country.name}`,
      })),
    [countryCodes],
  );

  const cityOpts = useMemo(
    () =>
      (citiesData ?? []).map((city) => ({
        value: city.cityName,
        label: city.cityName,
      })),
    [citiesData],
  );

  useEffect(() => {
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, [defaultAddress, selectedAddressId]);

  const [couponInput, setCouponInput] = useState("");
  const [couponResult, setCouponResult] = useState<ApplyCouponResponse | null>(
    null,
  );
  const [couponError, setCouponError] = useState("");

  const rawSubtotal = cartItems.reduce((sum: number, item: CartItem) => {
    const price =
      Number(item.price) > 0
        ? Number(item.price)
        : Number(item.size?.variant?.product?.price ?? 0);
    return sum + price * item.quantity;
  }, 0);

  const subtotal = couponResult ? Number(couponResult.subTotal) : rawSubtotal;
  const discount = couponResult ? Number(couponResult.discount) : 0;
  const total = couponResult ? Number(couponResult.total) : rawSubtotal;

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
      { couponCode: couponInput.trim(), mode: "cart" },
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
    if (addressMode === "saved" && selectedAddressId) {
      return selectedAddressId;
    }

    const valid = await addrForm.trigger();
    if (!valid || !addrPhone.trim()) {
      if (!addrPhone.trim()) toast.error("Phone number is required");
      return null;
    }

    const values = addrForm.getValues();
    return {
      name: values.name,
      phone: addrPhone.trim(),
      line1: values.line1,
      city: values.city,
      countryCode: values.countryCode,
      district: values.district || undefined,
      postalCode: values.postalCode || undefined,
      landMark: values.landMark || undefined,
    };
  };

  const handlePayNow = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const shipping = await resolveShipping();
    if (!shipping) return;

    createOrder(
      {
        mode: "cart",
        shippingAddress: shipping,
        couponCode: couponResult?.couponCode,
      },
      {
        onSuccess: (data) => {
          window.location.href = data.paymentUrl;
        },
        onError: (err) => {
          const ae = err as AxiosError<{ message: string }>;
          toast.error(ae.response?.data?.message || "Failed to create order");
        },
      },
    );
  };

  if (!cartLoading && cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-400 px-8 py-24 text-center md:px-16">
        <p className="mb-4 font-serif text-2xl text-zinc-900">
          Your cart is empty
        </p>
        <Link
          href="/shop"
          className="font-sans text-sm text-zinc-600 underline underline-offset-4"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-400 px-8 md:px-16">
      <div className="flex flex-col-reverse items-start gap-12 lg:flex-row lg:gap-16">
        <div className="flex w-full flex-col gap-8 lg:flex-1">
          {!isAuthenticated ? (
            <section className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-1 font-serif text-xl text-zinc-900">
                Sign In to Checkout
              </h2>
              <p className="mb-6 font-sans text-xs text-zinc-500">
                New to SORIN? We&apos;ll create your account automatically.
              </p>
              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <div>
                  <Input
                    label="EMAIL"
                    type="email"
                    placeholder="you@example.com"
                    {...authForm.register("email")}
                  />
                  {authForm.formState.errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {authForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="PASSWORD"
                    type="password"
                    {...authForm.register("password")}
                  />
                  {authForm.formState.errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {authForm.formState.errors.password.message}
                    </p>
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
              Signed in as{" "}
              <span className="font-medium text-zinc-900">{authEmail}</span>
            </div>
          )}

          <div
            className={
              !isAuthenticated
                ? "pointer-events-none select-none opacity-40"
                : ""
            }
          >
            <section className="mb-8 rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-6 font-serif text-xl text-zinc-900">
                Shipping Address
              </h2>

              {savedAddresses.length > 0 && (
                <div className="mb-6 flex flex-col gap-3">
                  {savedAddresses.map((addr: CustomerAddress) => (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => {
                        setAddressMode("saved");
                        setSelectedAddressId(addr.id);
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${addressMode === "saved" && selectedAddressId === addr.id ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 hover:border-zinc-400"}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-sans text-sm font-semibold text-zinc-900">
                            {addr.name}
                          </p>
                          <p className="mt-0.5 font-sans text-xs text-zinc-400">
                            {addr.phone}
                          </p>
                          <p className="mt-1 font-sans text-xs text-zinc-600">
                            {addr.line1}, {addr.city}, {addr.countryCode}
                          </p>
                        </div>
                        <Radio
                          selected={
                            addressMode === "saved" &&
                            selectedAddressId === addr.id
                          }
                        />
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
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                        Country *
                      </label>
                      <SearchableDropdown
                        value={watchedCountry ?? ""}
                        onChange={(value) => {
                          addrForm.setValue("countryCode", value, {
                            shouldValidate: true,
                          });
                          addrForm.setValue("city", "", {
                            shouldValidate: true,
                          });
                        }}
                        options={countryOpts}
                        placeholder="Select country"
                        searchPlaceholder="Search country..."
                        loading={loadingCountries}
                        onSearchChange={setCountrySearch}
                      />
                      {addrForm.formState.errors.countryCode && (
                        <p className="mt-1 text-xs text-red-500">
                          {addrForm.formState.errors.countryCode.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <label className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                        City *
                      </label>
                      <SearchableDropdown
                        value={watchedCity ?? ""}
                        onChange={(value) =>
                          addrForm.setValue("city", value, {
                            shouldValidate: true,
                          })
                        }
                        options={cityOpts}
                        placeholder={
                          watchedCountry ? "Select city" : "Select country first"
                        }
                        searchPlaceholder="Search city..."
                        loading={loadingCities}
                        disabled={!watchedCountry}
                      />
                      {addrForm.formState.errors.city && (
                        <p className="mt-1 text-xs text-red-500">
                          {addrForm.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Input
                        label="Full Name *"
                        placeholder="e.g. Angela R"
                        {...addrForm.register("name")}
                      />
                      {addrForm.formState.errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {addrForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <PhoneInput
                      label="PHONE *"
                      value={addrPhone}
                      onChange={setAddrPhone}
                      placeholder="50 123 4567"
                    />
                  </div>
                  <div>
                    <Input
                      label="Address Line 1 *"
                      placeholder="e.g. 123 Sheikh Zayed Rd"
                      {...addrForm.register("line1")}
                    />
                    {addrForm.formState.errors.line1 && (
                      <p className="mt-1 text-xs text-red-500">
                        {addrForm.formState.errors.line1.message}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="District (optional)"
                      placeholder="e.g. Downtown"
                      {...addrForm.register("district")}
                    />
                    <Input
                      label="Postal Code (optional)"
                      placeholder="e.g. 00000"
                      {...addrForm.register("postalCode")}
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="mb-8 rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-4 font-serif text-xl text-zinc-900">
                Coupon Code
              </h2>
              {couponResult ? (
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FiTag size={14} className="text-green-600" />
                    <span className="font-sans text-sm font-semibold text-green-700">
                      {couponResult.couponCode}
                    </span>
                    <span className="font-sans text-xs text-green-600">
                      ({Number(couponResult.discountPercentage).toFixed(0)}% off)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCouponResult(null);
                      setCouponInput("");
                      setCouponError("");
                    }}
                    className="text-zinc-400 hover:text-zinc-700"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    placeholder="ENTER CODE"
                    className="flex-1 rounded-md border border-transparent bg-zinc-100 px-4 py-3 font-mono text-sm tracking-widest transition-colors placeholder:font-sans placeholder:tracking-normal placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-3 font-sans text-xs font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
                  >
                    {isApplyingCoupon ? (
                      <FiLoader size={12} className="animate-spin" />
                    ) : null}
                    APPLY
                  </button>
                </div>
              )}
              {couponError && (
                <p className="mt-2 font-sans text-xs text-red-500">
                  {couponError}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-200 p-6 md:p-8">
              <h2 className="mb-6 font-serif text-xl text-zinc-900">Payment</h2>
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                <p className="font-sans text-sm text-zinc-700">
                  After you click <span className="font-semibold">Pay Now</span>,
                  you&apos;ll be redirected to Checkout.com&apos;s hosted payment
                  page.
                </p>
                <p className="mt-2 font-sans text-xs text-zinc-500">
                  Checkout.com will securely handle Card, Apple Pay, Google
                  Pay, and Tamara.
                </p>
              </div>
            </section>
          </div>
        </div>

        <div className="w-full shrink-0 lg:sticky lg:top-32 lg:w-96">
          <div className="rounded-2xl border border-zinc-200 p-6 md:p-8">
            <h2 className="mb-6 font-serif text-xl text-zinc-900">
              Order Summary
            </h2>

            <div className="mb-6 flex max-h-72 flex-col gap-4 overflow-y-auto">
              {cartLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-14 animate-pulse rounded-lg bg-zinc-100"
                    />
                  ))
                : cartItems.map((item: CartItem) => {
                    const variant = item.size?.variant;
                    const product = variant?.product;
                    const imgUrl = variant?.primaryImage?.publicUrl ?? "";
                    const unitPrice =
                      Number(item.price) > 0
                        ? Number(item.price)
                        : Number(product?.price ?? 0);

                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                          {imgUrl && (
                            <Image
                              src={imgUrl}
                              alt={product?.title ?? ""}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-sans text-sm font-semibold text-zinc-900">
                            {product?.title ?? "-"}
                          </p>
                          <p className="mt-0.5 font-sans text-xs text-zinc-400">
                            {variant?.colorName}{" "}
                            {item.size?.size ? `· EU ${item.size.size}` : ""} · x
                            {item.quantity}
                          </p>
                        </div>
                        <p className="whitespace-nowrap font-sans text-sm font-semibold text-zinc-900">
                          {fmt(unitPrice * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
            </div>

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
                <span className="font-sans text-sm font-semibold text-zinc-900">
                  Total
                </span>
                <span className="font-serif text-xl text-zinc-900">
                  {fmt(total)}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayNow}
              disabled={!isAuthenticated || isCreatingOrder || cartLoading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 py-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isCreatingOrder ? (
                <>
                  <Spinner />
                  CREATING ORDER...
                </>
              ) : (
                <>
                  <FiLock size={12} />
                  PAY NOW · {fmt(total)}
                </>
              )}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1 text-center font-sans text-[10px] text-zinc-400">
              <FiLock size={10} /> 256-bit SSL · AED · VAT Inclusive
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <div
      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-zinc-900" : "border-zinc-300"}`}
    >
      {selected && <div className="h-2 w-2 rounded-full bg-zinc-900" />}
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between font-sans text-xs text-zinc-500">
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
