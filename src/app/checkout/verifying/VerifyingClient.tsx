"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiLoader } from "react-icons/fi";
import Header from "@/components/Header";
import { useClearCart } from "@/services/cart.service";
import { useVerifyPayment } from "@/services/checkout.service";

interface VerifyingClientProps {
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

const MAX_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 2000;

export default function VerifyingClient({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: VerifyingClientProps) {
  const router = useRouter();
  const { mutateAsync: clearCart } = useClearCart();
  const { mutateAsync: verifyPayment } = useVerifyPayment();
  const handledRef = useRef(false);
  const [stillProcessing, setStillProcessing] = useState(false);

  const hasReference = !!(orderId && razorpayOrderId && razorpayPaymentId && razorpaySignature);

  useEffect(() => {
    if (!hasReference || handledRef.current) return;
    handledRef.current = true;

    const run = async () => {
      const isCart = sessionStorage.getItem("checkoutMode") === "cart";

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        try {
          const result = await verifyPayment({
            orderId: orderId!,
            razorpay_order_id: razorpayOrderId!,
            razorpay_payment_id: razorpayPaymentId!,
            razorpay_signature: razorpaySignature!,
          });

          if (result.status === "PAID") {
            if (isCart) { try { await clearCart(); } catch { /* non-blocking */ } }
            sessionStorage.removeItem("checkoutMode");
            router.replace("/account/orders");
            return;
          }

          if (result.status === "FAILED") {
            if (isCart) { try { await clearCart(); } catch { /* non-blocking */ } }
            sessionStorage.removeItem("checkoutMode");
            router.replace(`/checkout/failure?orderId=${orderId}&reason=failed`);
            return;
          }
        } catch {
          // Invalid signature or network error — treat as failed.
          if (isCart) { try { await clearCart(); } catch { /* non-blocking */ } }
          sessionStorage.removeItem("checkoutMode");
          router.replace(`/checkout/failure?orderId=${orderId}&reason=failed`);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }

      // Still pending after polling — webhook/cron may just be slow. Don't
      // spin forever; let the shopper check their orders in a moment.
      setStillProcessing(true);
    };

    void run();
  }, [hasReference, orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, verifyPayment, clearCart, router]);

  return (
    <>
      <Header theme="light" />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-8 pb-24 pt-28">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <FiCheck size={28} className="text-green-600" />
          </div>

          <h1 className="mb-3 font-serif text-3xl text-zinc-900">
            {stillProcessing ? "Still Processing" : "Confirming Payment"}
          </h1>
          <p className="mb-2 font-sans text-sm text-zinc-500">
            {!hasReference
              ? "Missing payment reference — if you completed payment, check your orders."
              : stillProcessing
                ? "This is taking longer than usual. If you completed payment, it will appear in your orders shortly."
                : "We're verifying your payment with Razorpay before updating your order."}
          </p>
          {orderId ? (
            <p className="mb-10 font-sans text-xs text-zinc-400">
              Order #{orderId}
            </p>
          ) : (
            <p className="mb-10 font-sans text-xs text-zinc-400">
              Missing order reference.
            </p>
          )}

          {hasReference && !stillProcessing && (
            <div className="mb-8 flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-zinc-500">
              <FiLoader className="animate-spin" size={14} />
              Verifying
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/account/orders"
              className="w-full rounded-md bg-zinc-900 py-3.5 text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-black"
            >
              VIEW MY ORDERS
            </Link>
            <Link
              href="/shop"
              className="w-full rounded-md border border-zinc-200 py-3.5 text-center font-sans text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 transition-colors hover:border-zinc-400"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
