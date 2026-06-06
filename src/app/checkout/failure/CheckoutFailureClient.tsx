"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiAlertTriangle, FiLoader } from "react-icons/fi";
import Header from "@/components/Header";
import { useClearCart } from "@/services/cart.service";
import { verifyPaymentStatus } from "@/services/checkout.service";

const getFailureMessage = (status: "FAILED" | "CANCELLED" | "PENDING") => {
  if (status === "CANCELLED") {
    return "Your payment was cancelled. You can return to checkout and try again.";
  }
  if (status === "FAILED") {
    return "Your payment could not be processed. Please try again or use a different method.";
  }
  return "We could not confirm your payment yet. If you completed payment, check your orders in a moment.";
};

export default function CheckoutFailureClient({
  orderId,
}: {
  orderId?: string;
}) {
  const router = useRouter();
  const { mutateAsync: clearCart } = useClearCart();
  const handledRef = useRef(false);
  const [status, setStatus] = useState<"FAILED" | "CANCELLED" | "PENDING">("FAILED");

  useEffect(() => {
    if (!orderId || handledRef.current) return;
    handledRef.current = true;

    const run = async () => {
      const isBuyNow = sessionStorage.getItem("checkoutMode") === "buynow";
      sessionStorage.removeItem("checkoutMode");

      const verification = await verifyPaymentStatus(orderId);

      if (verification.status === "PAID") {
        if (!isBuyNow) { try { await clearCart(); } catch { /* non-blocking */ } }
        router.replace("/account/orders");
        return;
      }

      if (verification.status === "CANCELLED") {
        if (!isBuyNow) { try { await clearCart(); } catch { /* non-blocking */ } }
        setStatus("CANCELLED");
        return;
      }

      if (verification.status === "FAILED") {
        if (!isBuyNow) { try { await clearCart(); } catch { /* non-blocking */ } }
        setStatus("FAILED");
        return;
      }

      if (!isBuyNow) { try { await clearCart(); } catch { /* non-blocking */ } }
      setStatus("PENDING");
    };

    void run();
  }, [clearCart, orderId, router]);

  return (
    <>
      <Header theme="light" />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-8 pb-24 pt-28">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <FiAlertTriangle size={26} className="text-red-500" />
          </div>

          <h1 className="mb-3 font-serif text-3xl text-zinc-900">
            Payment Not Completed
          </h1>
          <p className="mb-3 font-sans text-sm text-zinc-500">
            {getFailureMessage(status)}
          </p>
          {orderId ? (
            <p className="mb-8 font-sans text-xs text-zinc-400">
              Order #{orderId}
            </p>
          ) : null}

          {status === "PENDING" ? (
            <div className="mb-8 flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-zinc-500">
              <FiLoader className="animate-spin" size={14} />
              Awaiting Update
            </div>
          ) : null}

          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="w-full rounded-md bg-zinc-900 py-3.5 text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black"
            >
              RETRY CHECKOUT
            </Link>
            <Link
              href="/account/orders"
              className="w-full rounded-md border border-zinc-200 py-3.5 text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:border-zinc-400"
            >
              VIEW MY ORDERS
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
