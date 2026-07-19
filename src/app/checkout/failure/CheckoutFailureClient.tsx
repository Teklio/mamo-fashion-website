"use client";

import Link from "next/link";
import { FiAlertTriangle } from "react-icons/fi";
import Header from "@/components/Header";

interface CheckoutFailureClientProps {
  orderId?: string;
  reason?: "failed" | "cancelled";
}

const getFailureMessage = (reason?: "failed" | "cancelled") => {
  if (reason === "cancelled") {
    return "Your payment was cancelled. You can return to checkout and try again.";
  }
  return "Your payment could not be processed. Please try again or use a different method.";
};

export default function CheckoutFailureClient({ orderId, reason }: CheckoutFailureClientProps) {
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
            {getFailureMessage(reason)}
          </p>
          {orderId ? (
            <p className="mb-8 font-sans text-xs text-zinc-400">
              Order #{orderId}
            </p>
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
