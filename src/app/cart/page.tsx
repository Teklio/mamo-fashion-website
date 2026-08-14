"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useGetCart, useUpdateCartItem, useRemoveCartItem } from "@/services/cart.service";
import type { RootState } from "@/store";
import type { CartItem } from "@/types/cart.type";
import { getMultiColorBackground } from "@/types/product.type";

export default function CartPage() {
  const cartCount = useSelector((s: RootState) => s.auth.cartCount);
  const { data, isLoading } = useGetCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const cartItems = data?.items ?? [];

  const getLineTotal = (item: CartItem): number =>
    Number(item.lineTotal) || Number(item.price) * item.quantity;

  const subtotal = data?.subtotal ?? cartItems.reduce(
    (total: number, item: CartItem) => total + getLineTotal(item),
    0,
  );

  return (
    <main className="relative min-h-screen bg-white overflow-x-hidden text-zinc-950 pt-32 pb-24">
      <Header theme="light" />

      <div className="max-w-400 mx-auto px-4 md:px-16 mt-0 md:mt-10 relative z-10">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 border-b border-zinc-100 pb-6">
          <h1 className="text-2xl md:text-4xl font-serif text-black">Shopping Cart</h1>
          <span className="text-[10px] tracking-[0.2em] font-sans font-semibold text-zinc-400 uppercase">
            {cartCount} {cartCount === 1 ? "PIECE" : "PIECES"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-zinc-100 animate-pulse"
              />
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border border-zinc-100 rounded-3xl bg-zinc-50/50">
            <h2 className="font-serif text-2xl text-black mb-4">Your cart is empty</h2>
            <p className="text-zinc-500 font-serif mb-8 text-sm">
              Looks like you haven&apos;t added anything to your cart yet.
            </p>
            <Link
              href="/shop"
              className="bg-[#111] hover:bg-black transition-colors text-white px-8 py-4 rounded-md text-xs tracking-widest font-sans uppercase font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left Column: Cart Items */}
            <div className="w-full lg:w-[60%] flex flex-col">
              {cartItems.map((item: CartItem) => {
                const imageUrl = item.primaryImageUrl ?? "";
                const colorName = item.color?.name ?? "";
                const colorBackground = getMultiColorBackground(item.color?.colorCodes);
                const sizeName = item.size?.name ?? "";
                const productId = item.product?.id ?? "";
                const title = item.product?.name ?? "";

                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border border-black/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 bg-white shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_20px_-10px_rgba(0,0,0,0.06)] transition-shadow"
                  >
                    {/* Left: Image + Info */}
                    <Link
                      href={`/shop/${productId}?variant=${item.variantId}`}
                      className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0 group cursor-pointer"
                    >
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#f5f5f5] rounded-xl overflow-hidden shrink-0">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-serif text-sm sm:text-base md:text-lg text-black mb-1 group-hover:text-zinc-600 transition-colors">
                          {title}
                        </h3>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div
                            className="w-2.5 h-2.5 rounded-full border border-zinc-200"
                            style={{ background: colorBackground }}
                          />
                          <p className="text-[10px] text-zinc-400 font-sans tracking-wider uppercase">
                            {colorName}
                          </p>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-sans tracking-widest uppercase font-semibold">
                          {sizeName ? `SIZE - ${sizeName}` : "ONE SIZE"}
                        </p>
                      </div>
                    </Link>

                    {/* Right: Quantity, Price, Delete */}
                    <div className="flex items-center gap-4 sm:gap-6 md:gap-10 w-full sm:w-auto justify-between sm:justify-end border-t border-zinc-50 sm:border-t-0 pt-4 sm:pt-0">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-zinc-200 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            updateItem({ id: item.id, quantity: item.quantity - 1 })
                          }
                          disabled={item.quantity <= 1}
                          className="text-zinc-400 hover:text-black transition-colors px-1 focus:outline-none disabled:opacity-40"
                        >
                          <FiMinus size={10} className="sm:size-3" />
                        </button>
                        <span className="font-sans text-xs font-semibold text-black w-6 sm:w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                          className="text-zinc-400 hover:text-black transition-colors px-1 focus:outline-none"
                        >
                          <FiPlus size={10} className="sm:size-3" />
                        </button>
                      </div>

                      <p className="font-serif text-base sm:text-lg text-black whitespace-nowrap min-w-24 text-right">
                        INR {getLineTotal(item).toFixed(2)}
                      </p>

                      <button
                        onClick={() => {
                          removeItem(item.id, {
                            onSuccess: () =>
                              toast("Item Removed", {
                                description: `${title} has been removed from your cart.`,
                              }),
                          });
                        }}
                        disabled={isRemoving}
                        className="text-zinc-300 hover:text-red-500 transition-colors ml-1 focus:outline-none"
                        aria-label="Remove item"
                      >
                        <FiX size={16} className="sm:size-4.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary */}
            <div className="w-full lg:w-[40%]">
              <div className="border border-black/10 rounded-2xl md:rounded-3xl p-5 md:p-8 lg:p-10 sticky top-32 bg-white shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)]">
                <h2 className="font-serif text-xl md:text-2xl text-black mb-6 md:mb-8">
                  Order Summary
                </h2>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-sans text-xs tracking-wider">Subtotal</span>
                  <span className="text-black font-sans text-xs font-semibold">
                    INR {subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-sans text-xs tracking-wider">Shipping</span>
                  <span className="text-black font-sans text-xs font-semibold">Free</span>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-sans text-xs tracking-wider">Tax</span>
                  <span className="text-black font-sans text-[11px]">Inclusive of duties.</span>
                </div>

                <div className="w-full h-px bg-zinc-100 my-6 md:my-8" />

                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <span className="text-black font-sans text-[11px] font-semibold tracking-widest uppercase">
                    TOTAL
                  </span>
                  <span className="text-black font-serif text-lg md:text-xl">
                    INR {subtotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="block text-center w-full bg-[#111] hover:bg-black text-white text-[11px] tracking-[0.2em] font-sans font-semibold uppercase py-4.5 rounded-lg transition-colors shadow-sm"
                >
                  CHECKOUT
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
