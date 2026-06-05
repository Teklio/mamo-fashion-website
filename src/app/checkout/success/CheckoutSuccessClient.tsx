"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiCheck, FiLoader } from "react-icons/fi";
import Header from "@/components/Header";
import { useClearCart } from "@/services/cart.service";
import { verifyPaymentStatus } from "@/services/checkout.service";

export default function CheckoutSuccessClient({
  orderId,
}: {
  orderId?: string;
}) {
  const router = useRouter();
  const { mutateAsync: clearCart } = useClearCart();
  const handledRef = useRef(false);

  useEffect(() => {
    if (!orderId || handledRef.current) return;
    handledRef.current = true;

    const run = async () => {
      for (let attempt = 0; attempt < 6; attempt += 1) {
        const result = await verifyPaymentStatus(orderId);

        if (result.status === "PAID") {
          try { await clearCart(); } catch { /* non-blocking */ }
          router.replace("/account/orders");
          return;
        }

        if (result.status === "FAILED" || result.status === "CANCELLED") {
          // Cart is cleared on the failure page after it verifies
          router.replace(`/checkout/failure?orderId=${orderId}`);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Polling exhausted — payment still PENDING. Order already exists so clear the cart.
      try { await clearCart(); } catch { /* non-blocking */ }
    };

    void run();
  }, [clearCart, orderId, router]);

  return (
    <>
      <Header theme="light" />
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-8 pb-24 pt-28">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <FiCheck size={28} className="text-green-600" />
          </div>

          <h1 className="mb-3 font-serif text-3xl text-zinc-900">
            Confirming Payment
          </h1>
          <p className="mb-2 font-sans text-sm text-zinc-500">
            We&apos;re verifying your Checkout.com payment before updating your
            order.
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

          <div className="mb-8 flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-zinc-500">
            <FiLoader className="animate-spin" size={14} />
            Verifying
          </div>

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
