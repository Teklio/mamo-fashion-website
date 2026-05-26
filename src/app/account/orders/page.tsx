"use client";

import Image from "next/image";
import { FiChevronRight, FiClock } from "react-icons/fi";

const dummyOrders = [
  {
    id: "SRN1028",
    date: "May 20, 2026",
    items: 1,
    total: 289.00,
    status: "Processing",
    image: "/assets/about/2.jpg", // Using an existing placeholder image
  }
];

export default function OrdersPage() {
  return (
    <div className="bg-white border border-black/10 rounded-2xl p-8 lg:p-10 w-full min-h-[600px]">
      <div className="mb-10">
        <h1 className="font-serif text-2xl lg:text-3xl text-black mb-2">Orders</h1>
        <p className="text-zinc-500 font-sans text-sm">
          Manage your orders
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {dummyOrders.map((order) => (
          <div 
            key={order.id}
            className="flex items-center justify-between border border-black/10 rounded-xl p-4 md:p-6 hover:shadow-sm transition-shadow cursor-pointer group"
          >
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 bg-[#f5f5f5] rounded-lg overflow-hidden shrink-0">
                <Image src={order.image} alt={`Order ${order.id}`} fill className="object-cover mix-blend-multiply" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-serif text-lg text-black mb-1">Order #{order.id}</h3>
                <p className="text-sm text-zinc-500 font-sans mb-1">{order.date}</p>
                <p className="text-xs text-zinc-600 font-sans font-medium">
                  {order.items} {order.items === 1 ? 'Item' : 'Items'} <span className="mx-2">•</span> AED {order.total.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-[#fdfaf2] text-[#d4b068] px-3 py-1.5 rounded-full text-xs font-sans font-medium">
                <FiClock size={12} />
                {order.status}
              </div>
              <FiChevronRight size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
