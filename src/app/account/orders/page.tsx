"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { FiChevronRight, FiClock, FiX, FiShoppingBag, FiExternalLink } from "react-icons/fi";
import { useGetCustomerOrders, useGetCustomerOrder } from "@/services/order.service";
import type { CustomerOrder, OrderItem, OrderStatus } from "@/types/order.type";

const STATUS_STYLES: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  PENDING:    { label: "Pending",    color: "text-amber-600",  dot: "bg-amber-400" },
  CONFIRMED:  { label: "Confirmed",  color: "text-blue-600",   dot: "bg-blue-400" },
  PROCESSING: { label: "Processing", color: "text-purple-600", dot: "bg-purple-400" },
  SHIPPED:    { label: "Shipped",    color: "text-cyan-600",   dot: "bg-cyan-400" },
  DELIVERED:  { label: "Delivered",  color: "text-green-600",  dot: "bg-green-400" },
  FAILED:     { label: "Failed",     color: "text-red-600",    dot: "bg-red-400" },
  CANCELLED:  { label: "Cancelled",  color: "text-zinc-500",   dot: "bg-zinc-300" },
};

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = selectedOrderId ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [selectedOrderId]);

  const { data, isLoading } = useGetCustomerOrders();
  const orders = data?.orders ?? [];

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 lg:p-10 w-full min-h-150">
      <div className="mb-8 md:mb-10">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">Order History</h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">Track and manage your orders</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-zinc-100 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-t border-zinc-100">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <FiShoppingBag className="text-zinc-300" size={28} />
          </div>
          <h2 className="font-serif text-xl text-zinc-900 mb-3">No orders yet</h2>
          <p className="text-zinc-500 font-sans text-sm mb-8 max-w-sm">
            When you place your first order, it will appear here.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-black text-white text-xs font-bold font-sans tracking-[0.2em] rounded-md hover:bg-black/90 transition-colors"
          >
            START SHOPPING
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order: CustomerOrder) => {
            const statusStyle = STATUS_STYLES[order.status] ?? { label: order.status, color: "text-zinc-500", dot: "bg-zinc-300" };
            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            });

            return (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className="w-full border border-black/10 rounded-2xl p-5 md:p-6 text-left hover:border-black/20 hover:bg-zinc-50/50 transition-all group"
              >
                {/* Order header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-zinc-200 transition-colors">
                      <FiClock size={15} className="text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-black text-sm">Order #{order.id}</p>
                      <p className="text-xs text-zinc-400 font-sans mt-0.5">{date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 pl-12 sm:pl-0">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-sans font-semibold tracking-widest uppercase text-zinc-400">Total</p>
                      <p className="text-sm font-sans text-black font-medium mt-0.5">
                        {order.currencyCode} {Number(order.total).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusStyle.dot}`} />
                      <span className={`text-sm font-sans font-semibold ${statusStyle.color}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    <FiChevronRight size={15} className="text-zinc-300 group-hover:text-zinc-600 transition-colors hidden sm:block" />
                  </div>
                </div>

                {/* Product thumbnails */}
                <div className="flex gap-2 pl-12 flex-wrap">
                  {order.items.slice(0, 4).map((item: OrderItem, idx: number) => {
                    const imgUrl = item.productVariant?.primaryImage?.imageUrl;
                    return (
                      <div
                        key={item.id}
                        className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100"
                      >
                        {imgUrl ? (
                          <Image src={imgUrl} alt={item.product?.title ?? ""} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiShoppingBag size={16} className="text-zinc-300" />
                          </div>
                        )}
                        {idx === 3 && order.items.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">+{order.items.length - 4}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex items-center ml-1">
                    <p className="text-xs text-zinc-400 font-sans">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {mounted && createPortal(
        selectedOrderId ? (
          <OrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
        ) : null,
        document.body
      )}
    </div>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { data, isLoading } = useGetCustomerOrder(orderId);
  const order = data?.order;
  const statusStyle = order
    ? (STATUS_STYLES[order.status] ?? { label: order.status, color: "text-zinc-500", dot: "bg-zinc-300" })
    : null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-black/10 z-101">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-zinc-400 hover:text-black transition-colors p-1.5 rounded-full hover:bg-zinc-100 z-10"
        >
          <FiX size={20} />
        </button>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-6 bg-zinc-100 rounded w-1/3" />
              <div className="h-4 bg-zinc-100 rounded w-1/2" />
              <div className="h-24 bg-zinc-100 rounded-xl mt-6" />
            </div>
          ) : order ? (
            <>
              {/* Header */}
              <div>
                <span className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase block mb-1">
                  Order Details
                </span>
                <h2 className="font-serif text-xl md:text-2xl text-black">Order #{order.id}</h2>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 font-sans">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span className={`flex items-center gap-1 font-semibold ${statusStyle?.color ?? ""}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle?.dot}`} />
                    {statusStyle?.label ?? order.status}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 pt-6 border-t border-black/10">
                <h3 className="font-serif text-base text-black mb-3">Items</h3>
                {order.items.map((item) => {
                  const imgUrl = item.productVariant?.primaryImage?.imageUrl;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 py-3 border-b border-zinc-50 last:border-0"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-100">
                        {imgUrl ? (
                          <Image src={imgUrl} alt={item.product?.title ?? ""} fill sizes="64px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiShoppingBag size={18} className="text-zinc-300" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        {item.product ? (
                          <Link
                            href={`/shop/${item.product.id}`}
                            onClick={onClose}
                            className="group/link inline-flex items-center gap-1 font-sans font-semibold text-black text-sm hover:underline underline-offset-2 truncate max-w-full"
                          >
                            <span className="truncate">{item.product.title}</span>
                            <FiExternalLink size={11} className="shrink-0 opacity-0 group-hover/link:opacity-60 transition-opacity" />
                          </Link>
                        ) : (
                          <p className="font-sans font-semibold text-black text-sm">—</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {item.productVariant && (
                            <span className="text-[10px] text-zinc-500 font-sans">
                              {item.productVariant.colorName}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-[10px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                              {item.size.size}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400 font-sans">×{item.quantity}</span>
                        </div>
                      </div>

                      <p className="font-sans font-semibold text-black text-sm whitespace-nowrap shrink-0">
                        {order.currencyCode} {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-black/10">
                {Number(order.discount) > 0 && (
                  <>
                    <div className="flex justify-between text-xs font-sans text-zinc-500">
                      <span>Subtotal</span>
                      <span>{order.currencyCode} {Number(order.subTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-sans text-green-600">
                      <span>Discount</span>
                      <span>− {order.currencyCode} {Number(order.discount).toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm font-sans font-semibold text-black pt-1">
                  <span>Total</span>
                  <span>{order.currencyCode} {Number(order.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping address */}
              {order.shippingAddress && (
                <div className="pt-6 border-t border-black/10 space-y-3">
                  <h3 className="font-serif text-base text-black">Delivery Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm font-sans">
                    <div>
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Name</span>
                      <span className="text-black font-medium">{order.shippingAddress.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Phone</span>
                      <span className="text-black font-medium">{order.shippingAddress.phone}</span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Country</span>
                      <span className="text-black font-medium">{order.shippingAddress.countryCode}</span>
                    </div>
                    <div>
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">City</span>
                      <span className="text-black font-medium">{order.shippingAddress.city}</span>
                    </div>
                  </div>
                  <div className="text-sm font-sans">
                    <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Address</span>
                    <span className="text-black">
                      {order.shippingAddress.line1}
                      {order.shippingAddress.district ? `, ${order.shippingAddress.district}` : ""}
                      {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
                    </span>
                  </div>
                  {order.shippingAddress.landMark && (
                    <p className="text-xs text-zinc-500 font-sans">
                      <span className="font-medium text-black">Landmark:</span>{" "}
                      {order.shippingAddress.landMark}
                    </p>
                  )}
                </div>
              )}

              {/* Payment */}
              {order.payment && (
                <div className="pt-4 border-t border-black/10">
                  <div className="flex items-center justify-between text-sm font-sans">
                    <span className="text-zinc-500">Payment</span>
                    <span className="font-medium text-black">{order.payment.paymentType ?? "Card"}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-zinc-500 font-sans text-sm">Order not found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
