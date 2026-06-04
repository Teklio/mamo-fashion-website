"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { FiChevronRight, FiClock, FiX } from "react-icons/fi";

const dummyOrders = [
  {
    id: "SRN1028",
    date: "May 20, 2026",
    status: "Processing",
    total: 289.00,
    paymentMethod: "Credit Card (Visa)",
    image: "/assets/Home/1.png",
    items: [
      {
        id: "item-1",
        name: "Onyx Essence Perfume",
        quantity: 1,
        price: 289.00,
        size: "100ml",
        image: "/assets/Home/1.png"
      }
    ],
    shippingAddress: {
      name: "Angela R",
      phone: "9187690560",
      line1: "XYZ Road, Southampton Street",
      city: "London",
      district: "Greater London",
      countryCode: "GB",
      postalCode: "SO14 3TB",
      landMark: "Near Central Station"
    }
  },
  {
    id: "SRN1015",
    date: "April 12, 2026",
    status: "Delivered",
    total: 450.00,
    paymentMethod: "Tabby",
    image: "/assets/Home/1.png",
    items: [
      {
        id: "item-2",
        name: "Amber Nights Perfume",
        quantity: 1,
        price: 450.00,
        size: "100ml",
        image: "/assets/Home/1.png"
      }
    ],
    shippingAddress: {
      name: "Angela R",
      phone: "9187690560",
      line1: "Apartment 4B, Blue Tower, Sheikh Zayed Road",
      city: "Dubai",
      countryCode: "AE",
      postalCode: "00000",
      landMark: "Opposite Metro Station"
    }
  }
];

export default function OrdersPage() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable scroll when modal is open
  useEffect(() => {
    if (selectedOrderId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedOrderId]);

  const selectedOrder = dummyOrders.find(o => o.id === selectedOrderId);

  // Render the modal overlay content
  const renderModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 transition-all duration-300">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={() => setSelectedOrderId(null)}
        />
        
        {/* Modal Container */}
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] md:max-h-[85vh] overflow-hidden transform scale-100 translate-y-0 transition-all border border-black/10 z-101">
          {/* Absolute close button */}
          <button 
            onClick={() => setSelectedOrderId(null)}
            className="absolute right-5 top-5 text-zinc-400 hover:text-black transition-colors p-1.5 rounded-full hover:bg-zinc-100 z-10"
          >
            <FiX size={20} />
          </button>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
            {/* Simple Header Info inside Modal Content */}
            <div>
              <span className="text-[10px] tracking-[0.2em] text-zinc-400 font-sans font-semibold uppercase block mb-1">
                Order Details
              </span>
              <h2 className="font-serif text-xl md:text-2xl text-black">Order #{selectedOrder.id}</h2>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500 font-sans">
                <span>Placed on {selectedOrder.date}</span>
                <span>•</span>
                <span className={`font-semibold ${
                  selectedOrder.status === "Delivered" ? "text-green-600" : "text-[#d4b068]"
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            {/* Items Ordered (Simple list with sizable image) */}
            <div className="space-y-4 pt-6 border-t border-black/10">
              <h3 className="font-serif text-base text-black mb-1">Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-6 items-center">
                    <div className="relative w-24 h-24 md:w-28 md:h-28 bg-[#f5f5f5] rounded-xl overflow-hidden shrink-0 border border-black/5">
                      <Image src={item.image} alt={item.name} fill className="object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-sans font-semibold text-black text-sm md:text-base truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-500 font-sans mt-1">Size: {item.size}</p>
                      <p className="text-xs text-zinc-500 font-sans">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans font-semibold text-black text-sm md:text-base">AED {item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="pt-6 border-t border-black/10 space-y-4">
              <h3 className="font-serif text-base text-black">Delivery Details</h3>
              
              <div className="space-y-3 font-sans text-sm">
                {/* Name and Phone at the top */}
                <div className="grid grid-cols-2 gap-4 pb-1">
                  <div>
                    <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Name</span>
                    <span className="text-black font-medium">{selectedOrder.shippingAddress.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Phone Number</span>
                    <span className="text-black font-medium">{selectedOrder.shippingAddress.phone}</span>
                  </div>
                </div>

                {/* Country Code and City aligned */}
                <div className="grid grid-cols-2 gap-4 pb-1">
                  <div>
                    <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Country Code</span>
                    <span className="text-black font-medium">{selectedOrder.shippingAddress.countryCode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">City</span>
                    <span className="text-black font-medium">{selectedOrder.shippingAddress.city}</span>
                  </div>
                </div>

                {/* Address, Postal Code, Landmark */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Address</span>
                    <span className="text-black font-medium leading-relaxed">{selectedOrder.shippingAddress.line1}</span>
                  </div>
                  {selectedOrder.shippingAddress.postalCode && (
                    <div>
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Postal Code</span>
                      <span className="text-black font-medium">{selectedOrder.shippingAddress.postalCode}</span>
                    </div>
                  )}
                  {selectedOrder.shippingAddress.landMark && (
                    <div>
                      <span className="text-[10px] tracking-wider text-zinc-400 uppercase block mb-0.5">Landmark</span>
                      <span className="text-zinc-600 font-medium">{selectedOrder.shippingAddress.landMark}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="pt-6 border-t border-black/10 space-y-4">
              <h3 className="font-serif text-base text-black">Summary</h3>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="text-black font-medium">AED {selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-zinc-500 pt-2 border-t border-black/5">
                  <span>Payment Method</span>
                  <span className="text-black font-medium">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-end pt-3 text-base">
                  <span className="text-xs text-zinc-400 tracking-wider uppercase font-semibold">Total</span>
                  <span className="text-lg font-bold text-black">AED {selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-5 border-t border-black/10 flex justify-end bg-zinc-50/50">
            <button 
              onClick={() => setSelectedOrderId(null)}
              className="px-6 py-2 bg-black hover:bg-black/90 text-white text-xs font-sans font-semibold rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-8 lg:p-10 w-full min-h-150 relative">
      <div className="mb-10">
        <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-black mb-2">Orders</h1>
        <p className="text-zinc-500 font-sans text-xs md:text-sm">
          Manage your orders
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {dummyOrders.map((order) => (
          <div 
            key={order.id}
            onClick={() => setSelectedOrderId(order.id)}
            className="flex items-center justify-between border border-black/10 rounded-xl p-4 md:p-6 hover:shadow-sm transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 bg-[#f5f5f5] rounded-lg overflow-hidden shrink-0 border border-black/5">
                <Image src={order.image} alt={`Order ${order.id}`} fill className="object-cover mix-blend-multiply" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif text-lg text-black mb-1">Order #{order.id}</h3>
                <p className="text-sm text-zinc-500 font-sans mb-1">{order.date}</p>
                <p className="text-xs text-zinc-600 font-sans font-medium">
                  {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'} <span className="mx-2">•</span> AED {order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-sans font-medium ${
                order.status === "Delivered" 
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-[#fdfaf2] text-[#d4b068] border border-[#f5ebcd]"
              }`}>
                <FiClock size={12} />
                {order.status}
              </div>
              <FiChevronRight size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Render Modal via Portal so it breaks out of layout stacking context */}
      {mounted && typeof window !== "undefined" && createPortal(renderModal(), document.body)}
    </div>
  );
}
